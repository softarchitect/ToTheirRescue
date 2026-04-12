from datetime import datetime, timedelta

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from sqlalchemy import inspect, select, literal, func

from ..extensions import db
from ..models import Animal, User
from ..models.animal_procedure import AnimalProcedure
from ..models.health_procedure import HealthProcedure
from ..models.pco import PCO


animal_procedures_bp = Blueprint("animal_procedures", __name__)


def _get_tenant_id_from_jwt():
    """Get tenant_id from JWT token."""
    user_id = get_jwt_identity()
    if user_id:
        user = User.query.get(user_id)
        if user and user.tenant_id:
            return user.tenant_id
    return None


def _get_username_from_jwt():
    """Get username from JWT claims."""
    claims = get_jwt()
    return claims.get("username", "system")


@animal_procedures_bp.post("/add-animal-procedures")
@jwt_required(optional=True)
def add_animal_procedures():
    """Create completed procedures/tests/treatments for one or more animals."""
    payload = request.get_json(silent=True) or {}
    
    # Check for old system format (animalProcedureVm)
    animal_procedure_vm = payload.get("animalProcedureVm")
    raw_ids = payload.get("animalIds") or []
    
    username = _get_username_from_jwt()
    jwt_tenant_id = _get_tenant_id_from_jwt()

    # Normalize animal_procedure_vm to a list for easier processing
    vm_list = []
    if isinstance(animal_procedure_vm, list):
        vm_list = animal_procedure_vm
    elif isinstance(animal_procedure_vm, dict):
        vm_list = [animal_procedure_vm]
    
    if vm_list:
        # Old format handler
        if not raw_ids:
            return jsonify({"success": False, "statusCode": 400, "errors": ["animalIds required"]}), 400
        
        animals = Animal.query.filter(Animal.id.in_(raw_ids)).all()
        if not animals:
            return jsonify({"success": False, "statusCode": 404, "errors": ["No matching animals found."]}), 404

        now = datetime.utcnow()
        created: list[dict] = []

        for animal in animals:
            tenant_id = jwt_tenant_id or animal.tenant_id or 0
            for vm in vm_list:
                kind_id = vm.get("kindId")
                action_raw = vm.get("actionDate")
                due_dates_raw = vm.get("dueDate") or []
                if not isinstance(due_dates_raw, list):
                    due_dates_raw = [due_dates_raw]
                
                reminder = bool(vm.get("reminder", False))
                hospital_clinic_id = vm.get("hospitalClinicId") or 1
                
                # Parse action date
                action_date = None
                if action_raw:
                    try:
                        action_date = datetime.fromisoformat(str(action_raw).replace("Z", "+00:00"))
                    except (ValueError, TypeError):
                        try:
                            action_date = datetime.fromisoformat(str(action_raw))
                        except (ValueError, TypeError):
                            pass

                # If it's a reminder with due dates, create records for each
                if reminder and due_dates_raw:
                    for due_raw in due_dates_raw:
                        if not due_raw: continue
                        try:
                            due_date = datetime.fromisoformat(str(due_raw).replace("Z", "+00:00"))
                        except (ValueError, TypeError):
                            try:
                                due_date = datetime.fromisoformat(str(due_raw))
                            except (ValueError, TypeError):
                                continue
                        
                        proc = AnimalProcedure(
                            animal_id=animal.id,
                            kind_id=int(kind_id),
                            reminder=True,
                            due_date=due_date,
                            action_date=None,
                            weight=vm.get("weight") or None,
                            administerer=vm.get("administerer") or None,
                            results=vm.get("results") or None,
                            microchip_number=vm.get("microchipNumber") or None,
                            notes=vm.get("notes") or None,
                            is_deleted=False,
                            date_entered=now,
                            date_modified=now,
                            entered_by=username,
                            modified_by=username,
                            tenant_id=tenant_id,
                            hospital_clinic_id=int(hospital_clinic_id),
                        )
                        db.session.add(proc)
                else:
                    # Completed procedure
                    proc = AnimalProcedure(
                        animal_id=animal.id,
                        kind_id=int(kind_id),
                        reminder=False,
                        due_date=None,
                        action_date=action_date,
                        weight=vm.get("weight") or None,
                        administerer=vm.get("administerer") or None,
                        results=vm.get("results") or None,
                        microchip_number=vm.get("microchipNumber") or None,
                        notes=vm.get("notes") or None,
                        is_deleted=False,
                        date_entered=now,
                        date_modified=now,
                        entered_by=username,
                        modified_by=username,
                        tenant_id=tenant_id,
                        hospital_clinic_id=int(hospital_clinic_id),
                    )
                    db.session.add(proc)
                    
                    # Handle dueAgain (auto-create reminder)
                    due_again = (vm.get("dueAgain") or "").strip()
                    if due_again:
                        due_again_days = 0
                        parts = due_again.split("-")
                        if len(parts) == 2:
                            try:
                                num = int(parts[0])
                                unit = parts[1].lower()
                                if unit == "days": due_again_days = num
                                elif unit == "weeks": due_again_days = num * 7
                                elif unit == "months": due_again_days = num * 30
                                elif unit == "years": due_again_days = num * 365
                            except (ValueError, IndexError): pass
                        
                        if due_again_days > 0 and action_date:
                            due_date = action_date + timedelta(days=due_again_days)
                            reminder_proc = AnimalProcedure(
                                animal_id=animal.id,
                                kind_id=int(kind_id),
                                reminder=True,
                                due_date=due_date,
                                action_date=None,
                                weight=None,
                                administerer=None,
                                results=None,
                                microchip_number=None,
                                notes=None,
                                is_deleted=False,
                                date_entered=now,
                                date_modified=now,
                                entered_by=username,
                                modified_by=username,
                                tenant_id=tenant_id,
                                hospital_clinic_id=int(hospital_clinic_id),
                            )
                            db.session.add(reminder_proc)

                created.append({"animalId": animal.id, "kindId": int(kind_id)})

        db.session.commit()
        return jsonify({"success": True, "statusCode": 200, "message": "Procedures recorded successfully", "data": {"items": created}})

    else:
        # Simplified format handler (current frontend for completed procedures)
        kind_id = payload.get("kindId")
        action_raw = (payload.get("actionDate") or "").strip()
        hospital_clinic_id = payload.get("hospitalClinicId")
        
        try:
            action_date = datetime.fromisoformat(action_raw.replace("Z", "+00:00"))
        except (ValueError, TypeError):
            try:
                action_date = datetime.fromisoformat(action_raw)
            except (ValueError, TypeError):
                action_date = None

        if not raw_ids or not kind_id or not action_date:
            return jsonify({"success": False, "statusCode": 400, "errors": ["animalIds, kindId, and valid actionDate are required."]}), 400

        animals = Animal.query.filter(Animal.id.in_(raw_ids)).all()
        if not animals:
            return jsonify({"success": False, "statusCode": 404, "errors": ["No matching animals found."]}), 404

        administerer = (payload.get("administerer") or "").strip()
        microchip_number = (payload.get("microchipNumber") or "").strip()
        results = (payload.get("results") or "").strip()
        notes = (payload.get("notes") or "").strip()
        weight = (payload.get("weight") or "").strip()
        due_again = (payload.get("dueAgain") or "").strip()

        created: list[dict] = []
        now = datetime.utcnow()

        for animal in animals:
            tenant_id = jwt_tenant_id or animal.tenant_id or 0
            proc = AnimalProcedure(
                animal_id=animal.id,
                kind_id=int(kind_id),
                reminder=False,
                due_date=None,
                action_date=action_date,
                weight=weight or None,
                administerer=administerer or None,
                results=results or None,
                microchip_number=microchip_number or None,
                notes=notes or None,
                is_deleted=False,
                date_entered=now,
                date_modified=now,
                entered_by=username,
                modified_by=username,
                tenant_id=tenant_id,
                hospital_clinic_id=int(hospital_clinic_id) if hospital_clinic_id else 1,
            )
            db.session.add(proc)
            
            # Handle dueAgain (auto-create reminder)
            if due_again:
                due_again_days = 0
                parts = due_again.split("-")
                if len(parts) == 2:
                    try:
                        num = int(parts[0])
                        unit = parts[1].lower()
                        if unit == "days": due_again_days = num
                        elif unit == "weeks": due_again_days = num * 7
                        elif unit == "months": due_again_days = num * 30
                        elif unit == "years": due_again_days = num * 365
                    except (ValueError, IndexError): pass
                
                if due_again_days > 0:
                    due_date = action_date + timedelta(days=due_again_days)
                    reminder = AnimalProcedure(
                        animal_id=animal.id,
                        kind_id=int(kind_id),
                        reminder=True,
                        due_date=due_date,
                        action_date=None,
                        weight=None,
                        administerer=None,
                        results=None,
                        microchip_number=None,
                        notes=None,
                        is_deleted=False,
                        date_entered=now,
                        date_modified=now,
                        entered_by=username,
                        modified_by=username,
                        tenant_id=tenant_id,
                        hospital_clinic_id=int(hospital_clinic_id) if hospital_clinic_id else 1,
                    )
                    db.session.add(reminder)

            created.append({"animalId": animal.id, "kindId": int(kind_id)})

        db.session.commit()
        return jsonify({"success": True, "statusCode": 200, "message": "Procedure recorded successfully", "data": {"items": created}})


@animal_procedures_bp.post("/add-reminders")
@jwt_required(optional=True)
def add_procedure_reminders():
    """Create reminder-only AnimalProcedure records for one or more animals."""
    payload = request.get_json(silent=True) or {}
    
    # Check for old system format (animalProcedureVm)
    animal_procedure_vm = payload.get("animalProcedureVm")
    raw_ids = payload.get("animalIds") or []
    
    username = _get_username_from_jwt()
    jwt_tenant_id = _get_tenant_id_from_jwt()

    if animal_procedure_vm:
        item_name = "" # Not used in old format for procedures?
        due_dates_raw = animal_procedure_vm.get("dueDate") or []
        if not isinstance(due_dates_raw, list):
            due_dates_raw = [due_dates_raw]
        notes = (animal_procedure_vm.get("notes") or "").strip()
        kind_id = animal_procedure_vm.get("kindId") or 1
    else:
        item_name = (payload.get("itemName") or "").strip()
        due_dates_raw = payload.get("dueDates") or []
        notes = (payload.get("notes") or "").strip()
        kind_id = 1

    if not raw_ids or not due_dates_raw:
        return jsonify({"success": False, "statusCode": 400, "errors": ["animalIds and dueDates required."]}), 400

    parsed_dates: list[datetime] = []
    for raw in due_dates_raw:
        if not raw: continue
        try:
            parsed_dates.append(datetime.fromisoformat(str(raw).replace("Z", "+00:00")))
        except ValueError:
            try:
                parsed_dates.append(datetime.fromisoformat(str(raw)))
            except ValueError:
                continue

    animals = Animal.query.filter(Animal.id.in_(raw_ids)).all()
    if not animals:
        return jsonify({"success": False, "statusCode": 404, "errors": ["No matching animals found."]}), 404

    now = datetime.utcnow()
    created: list[dict] = []

    for animal in animals:
        tenant_id = jwt_tenant_id or animal.tenant_id or 0
        for due_date in parsed_dates:
            record = AnimalProcedure(
                animal_id=animal.id,
                kind_id=int(kind_id),
                reminder=True,
                due_date=due_date,
                action_date=None,
                weight=None,
                administerer=None,
                results=None,
                microchip_number=None,
                notes=notes or item_name or None,
                is_deleted=False,
                date_entered=now,
                entered_by=username,
                tenant_id=tenant_id,
                hospital_clinic_id=1,
            )
            db.session.add(record)
            created.append({"animalId": animal.id, "dueDate": due_date.date().isoformat()})

    db.session.commit()
    return jsonify({"success": True, "statusCode": 200, "message": "Procedure reminders created successfully", "data": {"items": created}})


@animal_procedures_bp.get("/get-animal-procedure")
def get_animal_procedure():
    """Get animal procedures by animal ID, matching old C# endpoint."""
    animal_id = request.args.get("animalId", type=int)
    reminder_param = request.args.get("reminder", "false").lower() == "true"
    is_deleted = request.args.get("isDeleted", "false").lower() == "true"
    
    if not animal_id:
        return jsonify({"success": False, "statusCode": 400, "errors": ["animalId is required."]}), 400
    
    query = (
        db.session.query(AnimalProcedure, HealthProcedure, PCO)
        .outerjoin(HealthProcedure, AnimalProcedure.kind_id == HealthProcedure.id)
        .outerjoin(PCO, AnimalProcedure.hospital_clinic_id == PCO.id)
        .filter(AnimalProcedure.animal_id == animal_id)
        .filter(AnimalProcedure.reminder == reminder_param)
    )
    
    if not is_deleted:
        query = query.filter(AnimalProcedure.is_deleted.is_(False))
    
    results = query.order_by(
        AnimalProcedure.action_date.desc().nullslast() if not reminder_param
        else AnimalProcedure.due_date.desc().nullslast()
    ).all()
    
    procedures = []
    for proc, hp, clinic in results:
        procedures.append({
            "id": proc.id,
            "kindId": proc.kind_id,
            "animalId": proc.animal_id,
            "healthProcedureKind": hp.kind if hp else "",
            "reminder": proc.reminder,
            "dueDate": proc.due_date.isoformat() if proc.due_date else None,
            "actionDate": proc.action_date.isoformat() if proc.action_date else None,
            "hospitalClinicId": proc.hospital_clinic_id,
            "hospitalClinic": f"{clinic.first_name} {clinic.last_name}".strip() if clinic else "",
            "administerer": proc.administerer or "",
            "microchipNumber": proc.microchip_number or "",
            "results": proc.results or "",
            "notes": proc.notes or "",
            "weight": proc.weight or "",
            "isDeleted": proc.is_deleted,
            "tenantId": proc.tenant_id,
        })
    
    return jsonify({"success": True, "statusCode": 200, "data": {"animalProcedures": procedures}})


@animal_procedures_bp.post("/update-animal-procedure/<int:procedure_id>")
@jwt_required(optional=True)
def update_animal_procedure(procedure_id: int):
    """Update an existing animal procedure."""
    complete_reminder = request.args.get("completeReminder", "false").lower() == "true"
    payload = request.get_json(silent=True) or {}
    username = _get_username_from_jwt()
    
    proc = AnimalProcedure.query.get(procedure_id)
    if not proc:
        return jsonify({"success": False, "statusCode": 404, "errors": ["Procedure not found."]}), 404
    
    if "kindId" in payload: proc.kind_id = int(payload["kindId"])
    if "actionDate" in payload and payload["actionDate"]:
        try: proc.action_date = datetime.fromisoformat(payload["actionDate"].replace("Z", "+00:00"))
        except ValueError: pass
    if "dueDate" in payload and payload["dueDate"]:
        try: proc.due_date = datetime.fromisoformat(payload["dueDate"].replace("Z", "+00:00"))
        except ValueError: pass
    if "hospitalClinicId" in payload: proc.hospital_clinic_id = int(payload["hospitalClinicId"])
    if "administerer" in payload: proc.administerer = (payload["administerer"] or "").strip() or None
    if "results" in payload: proc.results = (payload["results"] or "").strip() or None
    if "notes" in payload: proc.notes = (payload["notes"] or "").strip() or None
    if "weight" in payload: proc.weight = (payload["weight"] or "").strip() or None
    if "microchipNumber" in payload: proc.microchip_number = (payload["microchipNumber"] or "").strip() or None
    if "reminder" in payload: proc.reminder = bool(payload["reminder"])

    if complete_reminder and proc.reminder:
        proc.action_date = datetime.utcnow()
        proc.reminder = False
        proc.due_date = None
        
        due_again = (payload.get("dueAgain") or "").strip()
        if due_again:
            due_again_days = 0
            parts = due_again.split("-")
            if len(parts) == 2:
                try:
                    num = int(parts[0])
                    unit = parts[1].lower()
                    if unit == "days": due_again_days = num
                    elif unit == "weeks": due_again_days = num * 7
                    elif unit == "months": due_again_days = num * 30
                    elif unit == "years": due_again_days = num * 365
                except (ValueError, IndexError): pass
            
            if due_again_days > 0:
                new_due_date = proc.action_date + timedelta(days=due_again_days)
                new_reminder = AnimalProcedure(
                    animal_id=proc.animal_id,
                    kind_id=proc.kind_id,
                    reminder=True,
                    due_date=new_due_date,
                    action_date=None,
                    weight=None,
                    administerer=None,
                    results=None,
                    microchip_number=None,
                    notes=None,
                    is_deleted=False,
                    date_entered=datetime.utcnow(),
                    date_modified=datetime.utcnow(),
                    entered_by=username,
                    modified_by=username,
                    tenant_id=proc.tenant_id,
                    hospital_clinic_id=proc.hospital_clinic_id,
                )
                db.session.add(new_reminder)
    
    proc.date_modified = datetime.utcnow()
    proc.modified_by = username
    db.session.commit()
    return jsonify({"success": True, "statusCode": 200, "message": "Procedure updated successfully"})


@animal_procedures_bp.patch("/delete-animal-procedure/<int:procedure_id>")
@jwt_required(optional=True)
def delete_animal_procedure(procedure_id: int):
    """Soft delete an animal procedure."""
    proc = AnimalProcedure.query.get(procedure_id)
    if not proc:
        return jsonify({"success": False, "statusCode": 404, "errors": ["Procedure not found."]}), 404
    
    username = _get_username_from_jwt()
    proc.is_deleted = True
    proc.date_modified = datetime.utcnow()
    proc.modified_by = username
    db.session.commit()
    return jsonify({"success": True, "statusCode": 200, "message": "Procedure deleted successfully"})


@animal_procedures_bp.get("/get-animal-weight-history")
def get_animal_weight_history():
    """Get weight history for an animal across health entries (excluding reminders)."""
    animal_id = request.args.get("animalId", type=int)
    if not animal_id:
        return jsonify({"success": False, "statusCode": 400, "errors": ["animalId is required."]}), 400

    animal = Animal.query.get(animal_id)
    if not animal:
        return jsonify({"success": False, "statusCode": 404, "errors": ["Animal not found."]}), 404

    tenant_id = animal.tenant_id
    history = []
    inspector = inspect(db.engine)

    # Search all health-entry tables that can contain a Weight column.
    # Some tenants/databases may not have every table or schema variant.
    sources = [
        ("procedure", "AnimalProcedures"),
        ("vaccination", "AnimalVaccinations"),
        ("medication", "Meds"),
        ("soap", "SOAPs"),
        ("healthNote", "HealthNotes"),
    ]

    for source_name, table_name in sources:
        try:
            columns = {col["name"] for col in inspector.get_columns(table_name)}
        except Exception:
            continue

        required_columns = {"Id", "AnimalId", "IsDeleted", "Weight"}
        if not required_columns.issubset(columns):
            continue

        action_date_column = None
        for candidate in ("ActionDate", "AdministeredDate", "DateEntered", "DueDate"):
            if candidate in columns:
                action_date_column = candidate
                break

        try:
            table = db.Table(table_name, db.metadata, autoload_with=db.engine)
        except Exception:
            continue

        filters = [
            table.c.AnimalId == animal_id,
            table.c.IsDeleted.is_(False),
            table.c.Weight.isnot(None),
            func.length(func.trim(table.c.Weight)) > 0,
        ]

        if "TenantId" in columns and tenant_id is not None:
            filters.append(table.c.TenantId == tenant_id)

        if "Reminder" in columns:
            filters.append(table.c.Reminder.is_(False))

        action_date_expr = (
            table.c[action_date_column].label("actionDate")
            if action_date_column
            else literal(None).label("actionDate")
        )

        stmt = select(
            table.c.Id.label("id"),
            table.c.Weight.label("weight"),
            action_date_expr,
        ).where(*filters)

        rows = db.session.execute(stmt).mappings().all()

        for row in rows:
            raw_action_date = row.get("actionDate")
            history.append(
                {
                    "id": row.get("id"),
                    "animalId": animal_id,
                    "weight": row.get("weight"),
                    "actionDate": raw_action_date.isoformat() if raw_action_date else None,
                    "sourceType": source_name,
                }
            )

    history.sort(key=lambda item: item.get("actionDate") or "", reverse=True)

    return jsonify({
        "success": True,
        "statusCode": 200,
        "data": {"animalWeightHistory": history}
    })

