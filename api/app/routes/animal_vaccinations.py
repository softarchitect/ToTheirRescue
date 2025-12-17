from datetime import datetime, timedelta

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

from ..extensions import db
from ..models import Animal, User
from ..models.animal_vaccination import AnimalVaccination
from ..models.vaccination_type import VaccinationType
from ..models.pco import PCO


animal_vaccinations_bp = Blueprint("animal_vaccinations", __name__)


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


@animal_vaccinations_bp.post("/add-animal-vaccinations")
@jwt_required(optional=True)
def add_animal_vaccinations():
    """Create completed vaccinations (and optional follow-up reminders) for animals.
    
    Port of the old C# AddAnimalVaccination endpoint.
    Supports both old system format (AnimalVaccinationListVm) and simplified format.
    
    Old format:
    {
        "animalIds": [1, 2],
        "animalVaccinationVm": [
            {
                "kindId": 1,
                "actionDate": "2025-01-15",
                "dueDate": ["2025-02-15", "2025-03-15"],  // List - creates multiple records
                "reminder": false,
                "hospitalClinicId": 1,
                ...
            }
        ]
    }
    
    Simplified format (current frontend):
    {
        "animalIds": [1, 2],
        "kindId": 1,
        "actionDate": "2025-01-15",
        "hospitalClinicId": 1,
        "reminder": false,
        "dueAgain": "365-days",
        ...
    }
    """
    payload = request.get_json(silent=True) or {}
    
    if not payload:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Vaccinations required"],
                }
            ),
            400,
        )
    
    # Get tenant and username from JWT
    username = _get_username_from_jwt()
    jwt_tenant_id = _get_tenant_id_from_jwt()
    
    # Check for old system format (AnimalVaccinationListVm)
    animal_vaccination_vm_list = payload.get("animalVaccinationVm") or []
    raw_ids = payload.get("animalIds") or []
    
    # If using old format
    if animal_vaccination_vm_list:
        if not raw_ids:
            return (
                jsonify(
                    {
                        "success": False,
                        "statusCode": 400,
                        "errors": ["Animal identifiers required"],
                    }
                ),
                400,
            )
        
        if not animal_vaccination_vm_list:
            return (
                jsonify(
                    {
                        "success": False,
                        "statusCode": 400,
                        "errors": ["Vaccinations required"],
                    }
                ),
                400,
            )
        
        try:
            animal_ids = [int(aid) for aid in raw_ids]
        except (TypeError, ValueError):
            return (
                jsonify(
                    {
                        "success": False,
                        "statusCode": 400,
                        "errors": ["animalIds must be a list of integers."],
                    }
                ),
                400,
            )
        
        animals = Animal.query.filter(Animal.id.in_(animal_ids)).all()
        if not animals:
            return (
                jsonify(
                    {
                        "success": False,
                        "statusCode": 404,
                        "errors": ["No matching animals found."],
                    }
                ),
                404,
            )
        
        now = datetime.utcnow()
        lst_animal_vaccination_list = []
        
        try:
            # Get a default hospital for reminders (database requires NOT NULL, but reminders don't have hospitals)
            # Use first available hospital for the tenant as fallback
            default_hospital_id = None
            if jwt_tenant_id:
                default_hospital = (
                    PCO.query.filter(
                        PCO.tenant_id == jwt_tenant_id,
                        PCO.hospital.is_(True),
                        PCO.is_deleted.is_(False),
                    )
                    .order_by(PCO.id.asc())
                    .first()
                )
                if default_hospital:
                    default_hospital_id = default_hospital.id
            
            # If no hospital found for tenant, try to get from first animal's tenant
            if not default_hospital_id and animals:
                first_animal_tenant = animals[0].tenant_id
                if first_animal_tenant:
                    default_hospital = (
                        PCO.query.filter(
                            PCO.tenant_id == first_animal_tenant,
                            PCO.hospital.is_(True),
                            PCO.is_deleted.is_(False),
                        )
                        .order_by(PCO.id.asc())
                        .first()
                    )
                    if default_hospital:
                        default_hospital_id = default_hospital.id
            
            # Final fallback: use 1 if no hospital found (database constraint workaround)
            if not default_hospital_id:
                default_hospital_id = 1
            
            for animal in animals:
                tenant_id = jwt_tenant_id or animal.tenant_id or 0
                
                # Generate vacc record number matching old format: VAC + animalId + tenantId + MMDDYYYY + second + millisecond
                # Old format: VAC12205072024 = VAC + AnimalID + TenantID + MMDDYYYY + Seconds + Milliseconds
                # Note: Old system does NOT zero-pad month/day, but does use 3-digit milliseconds
                vacc_record_no = (
                    f"VAC{animal.id}{tenant_id}{now.month}{now.day}{now.year}{now.second}{now.microsecond // 1000:03d}"
                )
                
                lst_animal_vaccinations = []
                
                for vaccination_vm in animal_vaccination_vm_list:
                    kind_id = vaccination_vm.get("kindId")
                    action_date_raw = vaccination_vm.get("actionDate")
                    due_dates_raw = vaccination_vm.get("dueDate") or []
                    reminder = bool(vaccination_vm.get("reminder", False))
                    hospital_clinic_id = vaccination_vm.get("hospitalClinicId")
                    # Convert to int or None - reminders may not have hospitalClinicId
                    if hospital_clinic_id is not None:
                        try:
                            hospital_clinic_id = int(hospital_clinic_id) if hospital_clinic_id else None
                        except (TypeError, ValueError):
                            hospital_clinic_id = None
                    
                    # For reminders without hospitalClinicId, use default hospital
                    # This is a workaround for the NOT NULL constraint - ideally the DB column should be nullable
                    if reminder and (hospital_clinic_id is None or hospital_clinic_id == 0):
                        hospital_clinic_id = default_hospital_id
                    administerer = (vaccination_vm.get("administerer") or "").strip()
                    tag_number = (vaccination_vm.get("tagNumber") or "").strip()
                    vaccine_manufacturer = (vaccination_vm.get("vaccineManufacturer") or "").strip()
                    vaccine_serial_no = (vaccination_vm.get("vaccineSerialNo") or "").strip()
                    notes = (vaccination_vm.get("notes") or "").strip()
                    due_again = (vaccination_vm.get("dueAgain") or "").strip()
                    
                    # Parse action date
                    action_date = None
                    if action_date_raw:
                        try:
                            if isinstance(action_date_raw, str):
                                action_date = datetime.fromisoformat(action_date_raw.replace("Z", "+00:00"))
                            else:
                                action_date = action_date_raw
                        except (ValueError, TypeError):
                            pass
                    
                    # If DueDate list exists and has items, create one record per due date
                    if due_dates_raw and isinstance(due_dates_raw, list) and len(due_dates_raw) > 0:
                        for due_date_raw in due_dates_raw:
                            if not due_date_raw:
                                continue
                            try:
                                if isinstance(due_date_raw, str):
                                    due_date = datetime.fromisoformat(due_date_raw.replace("Z", "+00:00"))
                                else:
                                    due_date = due_date_raw
                            except (ValueError, TypeError):
                                continue
                            
                            animal_vaccination = AnimalVaccination(
                                action_date=action_date,
                                administerer=administerer or None,
                                animal_id=animal.id,
                                due_date=due_date,
                                date_entered=now,
                                date_modified=now,
                                due_again=due_again or None,
                                entered_by=username,
                                hospital_clinic_id=hospital_clinic_id if hospital_clinic_id else default_hospital_id,
                                is_deleted=False,
                                kind_id=kind_id,
                                modified_by=username,
                                notes=notes or None,
                                reminder=reminder,
                                tag_number=tag_number or None,
                                tenant_id=tenant_id,
                                vaccine_manufacturer=vaccine_manufacturer or None,
                                vaccine_serial_no=vaccine_serial_no or None,
                                vacc_record_no="0" if not due_again else vacc_record_no,
                            )
                            lst_animal_vaccinations.append(animal_vaccination)
                    else:
                        # Single record (no due date list)
                        animal_vaccination = AnimalVaccination(
                            action_date=action_date,
                            administerer=administerer or None,
                            animal_id=animal.id,
                            due_date=None,
                            date_entered=now,
                            date_modified=now,
                            due_again=due_again or None,
                            entered_by=username,
                            hospital_clinic_id=hospital_clinic_id if hospital_clinic_id else default_hospital_id,
                            is_deleted=False,
                            kind_id=kind_id,
                            modified_by=username,
                            notes=notes or None,
                            reminder=reminder,
                            tag_number=tag_number or None,
                            tenant_id=tenant_id,
                            vaccine_manufacturer=vaccine_manufacturer or None,
                            vaccine_serial_no=vaccine_serial_no or None,
                            vacc_record_no="0" if not due_again else vacc_record_no,
                        )
                        lst_animal_vaccinations.append(animal_vaccination)
                
                # Add all vaccinations for this animal
                for vac in lst_animal_vaccinations:
                    db.session.add(vac)
                
                db.session.flush()  # Get IDs
                
                # Build response data
                animal_vaccinations_data = [
                    {
                        "id": vac.id,
                        "kindId": vac.kind_id,
                        "animalId": vac.animal_id,
                        "actionDate": vac.action_date.isoformat() if vac.action_date else None,
                        "dueDate": vac.due_date.isoformat() if vac.due_date else None,
                        "reminder": vac.reminder,
                    }
                    for vac in lst_animal_vaccinations
                ]
                
                lst_animal_vaccination_list.append({
                    "animalId": animal.id,
                    "animalVaccinations": animal_vaccinations_data,
                })
            
            db.session.commit()
            
            return jsonify(
                {
                    "success": True,
                    "statusCode": 200,
                    "message": "Vaccination added successfully",
                    "data": lst_animal_vaccination_list,
                }
            )
        except Exception as ex:
            db.session.rollback()
            import traceback
            traceback.print_exc()
            return (
                jsonify(
                    {
                        "success": False,
                        "statusCode": 500,
                        "errors": [
                            "Oops! Something went wrong while adding vaccination",
                            str(ex),
                        ],
                    }
                ),
                500,
            )
        except Exception as ex:
            db.session.rollback()
            return (
                jsonify(
                    {
                        "success": False,
                        "statusCode": 500,
                        "errors": [
                            "Oops! Something went wrong while adding vaccination",
                            str(ex),
                        ],
                    }
                ),
                500,
            )
    
    # Simplified format (current frontend)
    else:
        raw_ids = payload.get("animalIds") or []
        kind_id = payload.get("kindId")
        action_raw = (payload.get("actionDate") or "").strip()
        hospital_clinic_id = payload.get("hospitalClinicId")

        if not raw_ids or not kind_id or not action_raw or not hospital_clinic_id:
            return (
                jsonify(
                    {
                        "success": False,
                        "statusCode": 400,
                        "errors": [
                            "animalIds, kindId, hospitalClinicId and actionDate are required."
                        ],
                    }
                ),
                400,
            )

        try:
            animal_ids = [int(aid) for aid in raw_ids]
        except (TypeError, ValueError):
            return (
                jsonify(
                    {
                        "success": False,
                        "statusCode": 400,
                        "errors": ["animalIds must be a list of integers."],
                    }
                ),
                400,
            )

        try:
            action_date = datetime.fromisoformat(action_raw.replace("Z", "+00:00"))
        except ValueError:
            try:
                action_date = datetime.fromisoformat(action_raw)
            except ValueError:
                return (
                    jsonify(
                        {
                            "success": False,
                            "statusCode": 400,
                            "errors": ["Invalid actionDate format."],
                        }
                    ),
                    400,
                )

        animals = Animal.query.filter(Animal.id.in_(animal_ids)).all()
        if not animals:
            return (
                jsonify(
                    {
                        "success": False,
                        "statusCode": 404,
                        "errors": ["No matching animals found."],
                    }
                ),
                404,
            )

        # Get a default hospital for reminders (database requires NOT NULL, but reminders don't have hospitals)
        default_hospital_id = None
        if jwt_tenant_id:
            default_hospital = (
                PCO.query.filter(
                    PCO.tenant_id == jwt_tenant_id,
                    PCO.hospital.is_(True),
                    PCO.is_deleted.is_(False),
                )
                .order_by(PCO.id.asc())
                .first()
            )
            if default_hospital:
                default_hospital_id = default_hospital.id
        
        # If no hospital found for tenant, try to get from first animal's tenant
        if not default_hospital_id and animals:
            first_animal_tenant = animals[0].tenant_id
            if first_animal_tenant:
                default_hospital = (
                    PCO.query.filter(
                        PCO.tenant_id == first_animal_tenant,
                        PCO.hospital.is_(True),
                        PCO.is_deleted.is_(False),
                    )
                    .order_by(PCO.id.asc())
                    .first()
                )
                if default_hospital:
                    default_hospital_id = default_hospital.id
        
        # Get default hospital for reminders (database requires NOT NULL, but reminders don't have hospitals)
        default_hospital_id = None
        if jwt_tenant_id:
            default_hospital = (
                PCO.query.filter(
                    PCO.tenant_id == jwt_tenant_id,
                    PCO.hospital.is_(True),
                    PCO.is_deleted.is_(False)
                )
                .order_by(PCO.id.asc())
                .first()
            )
            if default_hospital:
                default_hospital_id = default_hospital.id
        
        # Final fallback: use 1 if no hospital found (database constraint workaround)
        if not default_hospital_id:
            default_hospital_id = 1

        administerer = (payload.get("administerer") or "").strip()
        tag_number = (payload.get("tagNumber") or "").strip()
        vaccine_mfg = (payload.get("vaccineManufacturer") or "").strip()
        vaccine_serial_no = (payload.get("vaccineSerialNo") or "").strip()
        notes = (payload.get("notes") or "").strip()
        reminder_flag = bool(payload.get("reminder"))  # This should be false for completed vaccinations

        due_again_str = (payload.get("dueAgain") or "").strip()
        
        # Parse dueAgain format (e.g., "365-days", "12-months")
        due_again_days = 0
        if due_again_str:
            parts = due_again_str.split("-")
            if len(parts) == 2:
                try:
                    number = int(parts[0])
                    unit = parts[1].lower()
                    if unit == "days":
                        due_again_days = number
                    elif unit == "weeks":
                        due_again_days = number * 7
                    elif unit == "months":
                        due_again_days = number * 30  # Approximate
                    elif unit == "years":
                        due_again_days = number * 365  # Approximate
                except (ValueError, IndexError):
                    pass

        created: list[dict] = []
        now = datetime.utcnow()

        for animal in animals:
            tenant_id = jwt_tenant_id or animal.tenant_id or 0

            # Generate vacc record number matching old format: VAC + animalId + tenantId + MMDDYYYY + second + millisecond
            # Old format: VAC12205072024 = VAC + AnimalID + TenantID + MMDDYYYY + Seconds + Milliseconds
            # Note: Old system does NOT zero-pad month/day, but does use 3-digit milliseconds
            vacc_record_no = (
                f"VAC{animal.id}{tenant_id}{now.month}{now.day}{now.year}{now.second}{now.microsecond // 1000:03d}"
            )

            # Completed vaccination entry (reminder=False always for completed vaccinations).
            # Match old system: when dueAgain is set, create both completed record AND reminder record
            completed = AnimalVaccination(
                animal_id=animal.id,
                kind_id=int(kind_id),
                reminder=False,  # Always false for completed vaccinations
                due_date=None,
                action_date=action_date,
                administerer=administerer or None,
                tag_number=tag_number or None,
                vaccine_manufacturer=vaccine_mfg or None,
                vaccine_serial_no=vaccine_serial_no or None,
                notes=notes or None,
                is_deleted=False,
                date_entered=now,
                date_modified=now,
                entered_by=username,
                modified_by=username,
                tenant_id=tenant_id,
                hospital_clinic_id=int(hospital_clinic_id) if hospital_clinic_id and hospital_clinic_id != 0 else default_hospital_id,
                due_again=due_again_str or None,
                vacc_record_no="0" if not due_again_str else vacc_record_no,
            )
            db.session.add(completed)

            created.append(
                {
                    "animalId": animal.id,
                    "kindId": int(kind_id),
                    "actionDate": action_date.date().isoformat(),
                    "reminder": False,
                }
            )

            # Match old system: If dueAgain is set, automatically create a reminder record
            # regardless of reminder_flag (reminder_flag is only for reminder-only entries)
            if due_again_str and due_again_days > 0:
                due_date = action_date + timedelta(days=due_again_days)
                reminder = AnimalVaccination(
                    animal_id=animal.id,
                    kind_id=int(kind_id),
                    reminder=True,
                    due_date=due_date,
                    action_date=None,
                    administerer=None,
                    tag_number=None,
                    vaccine_manufacturer=None,
                    vaccine_serial_no=None,
                    notes=None,  # Old system sets notes to empty string for auto-generated reminders
                    is_deleted=False,
                    date_entered=now,
                    date_modified=now,
                    entered_by=username,
                    modified_by=username,
                    tenant_id=tenant_id,
                    hospital_clinic_id=int(hospital_clinic_id) if hospital_clinic_id and hospital_clinic_id != 0 else default_hospital_id,
                    due_again=due_again_str or None,
                    vacc_record_no=vacc_record_no,
                )
                db.session.add(reminder)

                created.append(
                    {
                        "animalId": animal.id,
                        "kindId": int(kind_id),
                        "dueDate": due_date.date().isoformat(),
                        "reminder": True,
                    }
                )

        db.session.commit()

        return jsonify(
            {
                "success": True,
                "statusCode": 200,
                "message": "Vaccination recorded successfully",
                "data": {"items": created},
            }
        )


@animal_vaccinations_bp.post("/add-reminders")
def add_vaccination_reminders():
    """Create reminder-only AnimalVaccination records for one or more animals.

    This mirrors the old SetReminderModal behaviour where only Reminder/DueDate
    are populated (no completed ActionDate).

    Expected body (simplified):
      {
        "animalIds": [1, 2],
        "itemName": "Rabies",
        "dueDates": ["2025-01-10", "2025-02-10"],
        "notes": "Booster shots"
      }
    """

    payload = request.get_json(silent=True) or {}
    raw_ids = payload.get("animalIds") or []
    item_name = (payload.get("itemName") or "").strip()
    due_dates_raw = payload.get("dueDates") or []
    notes = (payload.get("notes") or "").strip()

    if not raw_ids or not item_name or not due_dates_raw:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": [
                        "animalIds, itemName and at least one due date are required."
                    ],
                }
            ),
            400,
        )

    try:
        animal_ids = [int(aid) for aid in raw_ids]
    except (TypeError, ValueError):
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["animalIds must be a list of integers."],
                }
            ),
            400,
        )

    parsed_dates: list[datetime] = []
    for raw in due_dates_raw:
        raw_str = (raw or "").strip()
        if not raw_str:
            continue
        try:
            parsed_dates.append(datetime.fromisoformat(raw_str))
        except ValueError:
            return (
                jsonify(
                    {
                        "success": False,
                        "statusCode": 400,
                        "errors": [f"Invalid due date format: {raw_str}"],
                    }
                ),
                400,
            )

    if not parsed_dates:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["At least one valid due date is required."],
                }
            ),
            400,
        )

    animals = Animal.query.filter(Animal.id.in_(animal_ids)).all()
    if not animals:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 404,
                    "errors": ["No matching animals found."],
                }
            ),
            404,
        )

    # Get default hospital for reminders (database requires NOT NULL, but reminders don't have hospitals)
    default_hospital_id = None
    reminder_tenant_id = _get_tenant_id_from_jwt() or (animals[0].tenant_id if animals else None)
    if reminder_tenant_id:
        default_hospital = (
            PCO.query.filter(
                PCO.tenant_id == reminder_tenant_id,
                PCO.hospital.is_(True),
                PCO.is_deleted.is_(False),
            )
            .order_by(PCO.id.asc())
            .first()
        )
        if default_hospital:
            default_hospital_id = default_hospital.id
    
    # Final fallback: use 1 if no hospital found (database constraint workaround)
    if not default_hospital_id:
        default_hospital_id = 1

    now = datetime.utcnow()
    created: list[dict] = []

    for animal in animals:
        tenant_id = animal.tenant_id or 0

        for due_date in parsed_dates:
            record = AnimalVaccination(
                animal_id=animal.id,
                kind_id=1,  # placeholder until lookup tables are wired
                reminder=True,
                due_date=due_date,
                action_date=None,
                administerer=None,
                tag_number=None,
                vaccine_manufacturer=None,
                vaccine_serial_no=None,
                notes=notes or item_name,
                is_deleted=False,
                date_entered=now,
                entered_by="system",
                tenant_id=tenant_id,
                hospital_clinic_id=default_hospital_id,  # Use default hospital for reminders
                due_again=None,
                vacc_record_no=None,
            )
            db.session.add(record)

            created.append(
                {
                    "animalId": animal.id,
                    "type": "vaccination",
                    "itemName": item_name,
                    "dueDate": due_date.date().isoformat(),
                }
            )

    db.session.commit()

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Vaccination reminders created successfully",
            "data": {"items": created},
        }
    )


@animal_vaccinations_bp.get("/get-animal-vaccination")
def get_animal_vaccination():
    """Get animal vaccinations by animal ID, matching old C# endpoint.
    
    Query params:
      - animalId: required, integer
      - reminder: optional, boolean (true for reminders, false for completed)
      - isDeleted: optional, boolean (default false)
    """
    animal_id = request.args.get("animalId", type=int)
    reminder_param = request.args.get("reminder", "false").lower() == "true"
    is_deleted = request.args.get("isDeleted", "false").lower() == "true"
    
    if not animal_id:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["animalId is required."],
                }
            ),
            400,
        )
    
    # Query vaccinations with left outer joins to handle missing relationships
    query = (
        db.session.query(AnimalVaccination, VaccinationType, PCO)
        .outerjoin(VaccinationType, AnimalVaccination.kind_id == VaccinationType.id)
        .outerjoin(PCO, AnimalVaccination.hospital_clinic_id == PCO.id)
        .filter(AnimalVaccination.animal_id == animal_id)
        .filter(AnimalVaccination.reminder == reminder_param)
    )
    
    if not is_deleted:
        query = query.filter(AnimalVaccination.is_deleted.is_(False))
    
    results = query.order_by(
        AnimalVaccination.action_date.desc().nullslast() if not reminder_param
        else AnimalVaccination.due_date.desc().nullslast()
    ).all()
    
    vaccinations = []
    for vac, vac_type, clinic in results:
        vaccinations.append({
            "id": vac.id,
            "kindId": vac.kind_id,
            "animalId": vac.animal_id,
            "animalName": "",  # Could join Animal if needed
            "animalType": "",  # Could join AnimalType if needed
            "animalTypeId": None,  # Could join AnimalType if needed
            "vaccinationKind": vac_type.kind if vac_type else "",
            "reminder": vac.reminder,
            "dueDate": vac.due_date.isoformat() if vac.due_date else None,
            "actionDate": vac.action_date.isoformat() if vac.action_date else None,
            "hospitalClinicId": vac.hospital_clinic_id,
            "hospitalClinic": f"{clinic.first_name} {clinic.last_name}".strip() if clinic else "",
            "administerer": vac.administerer or "",
            "tagNumber": vac.tag_number or "",
            "vaccineManufacturer": vac.vaccine_manufacturer or "",
            "vaccineSerialNo": vac.vaccine_serial_no or "",
            "notes": vac.notes or "",
            "dueAgain": vac.due_again or "",
            "vaccRecordNo": vac.vacc_record_no or "",
            "dateEntered": vac.date_entered.isoformat() if vac.date_entered else None,
            "modifiedBy": vac.modified_by or "",
            "isDeleted": vac.is_deleted,
            "tenantId": vac.tenant_id,
        })
    
    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "data": {"animalVaccinations": vaccinations},
        }
    )


@animal_vaccinations_bp.post("/update-animal-vaccination/<int:vaccination_id>")
@jwt_required(optional=True)
def update_animal_vaccination(vaccination_id: int):
    """Update an existing animal vaccination.
    
    Query params:
      - completeReminder: optional, boolean (if true, marks reminder as completed)
    """
    complete_reminder = request.args.get("completeReminder", "false").lower() == "true"
    payload = request.get_json(silent=True) or {}
    username = _get_username_from_jwt()
    
    vaccination = AnimalVaccination.query.get(vaccination_id)
    if not vaccination:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 404,
                    "errors": ["Vaccination not found."],
                }
            ),
            404,
        )
    
    # Update fields from payload
    if "kindId" in payload:
        vaccination.kind_id = int(payload["kindId"])
    if "actionDate" in payload and payload["actionDate"]:
        try:
            vaccination.action_date = datetime.fromisoformat(payload["actionDate"])
        except ValueError:
            pass
    if "dueDate" in payload and payload["dueDate"]:
        try:
            vaccination.due_date = datetime.fromisoformat(payload["dueDate"])
        except ValueError:
            pass
    if "hospitalClinicId" in payload:
        vaccination.hospital_clinic_id = int(payload["hospitalClinicId"])
    if "administerer" in payload:
        vaccination.administerer = (payload["administerer"] or "").strip() or None
    if "tagNumber" in payload:
        vaccination.tag_number = (payload["tagNumber"] or "").strip() or None
    if "vaccineManufacturer" in payload:
        vaccination.vaccine_manufacturer = (payload["vaccineManufacturer"] or "").strip() or None
    if "vaccineSerialNo" in payload:
        vaccination.vaccine_serial_no = (payload["vaccineSerialNo"] or "").strip() or None
    if "notes" in payload:
        vaccination.notes = (payload["notes"] or "").strip() or None
    if "dueAgain" in payload:
        vaccination.due_again = (payload["dueAgain"] or "").strip() or None
    if "reminder" in payload:
        vaccination.reminder = bool(payload["reminder"])
    
    # If completing a reminder, set action date to today and clear reminder flag
    # Match old system: If completing a reminder with dueAgain, create a new reminder record
    if complete_reminder and vaccination.reminder:
        vaccination.action_date = datetime.utcnow()
        vaccination.reminder = False
        vaccination.due_date = None
        
        # Match old system behavior: If dueAgain is set, create a new reminder record
        due_again_str = vaccination.due_again or (payload.get("dueAgain") or "").strip()
        if due_again_str:
            # Parse dueAgain format (e.g., "365-days", "12-months")
            due_again_days = 0
            parts = due_again_str.split("-")
            if len(parts) == 2:
                try:
                    number = int(parts[0])
                    unit = parts[1].lower()
                    if unit == "days":
                        due_again_days = number
                    elif unit == "weeks":
                        due_again_days = number * 7
                    elif unit == "months":
                        due_again_days = number * 30  # Approximate
                    elif unit == "years":
                        due_again_days = number * 365  # Approximate
                except (ValueError, IndexError):
                    pass
            
            if due_again_days > 0:
                # Calculate new due date from action date + dueAgain interval
                new_due_date = vaccination.action_date + timedelta(days=due_again_days)
                
                # Create new reminder record with same vaccRecordNo (matching old system)
                new_reminder = AnimalVaccination(
                    animal_id=vaccination.animal_id,
                    kind_id=vaccination.kind_id,
                    reminder=True,
                    due_date=new_due_date,
                    action_date=None,
                    administerer=None,
                    tag_number=None,
                    vaccine_manufacturer=None,
                    vaccine_serial_no=None,
                    notes=None,
                    is_deleted=False,
                    date_entered=datetime.utcnow(),
                    date_modified=datetime.utcnow(),
                    entered_by=username,
                    modified_by=username,
                    tenant_id=vaccination.tenant_id,
                    hospital_clinic_id=vaccination.hospital_clinic_id,
                    due_again=due_again_str,
                    vacc_record_no=vaccination.vacc_record_no,  # Use same vaccRecordNo as old system
                )
                db.session.add(new_reminder)
    
    vaccination.date_modified = datetime.utcnow()
    vaccination.modified_by = username
    
    db.session.commit()
    
    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Vaccination updated successfully",
        }
    )


@animal_vaccinations_bp.patch("/delete-animal-vaccination/<int:vaccination_id>")
@jwt_required(optional=True)
def delete_animal_vaccination(vaccination_id: int):
    """Soft delete an animal vaccination (set is_deleted = True)."""
    vaccination = AnimalVaccination.query.get(vaccination_id)
    if not vaccination:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 404,
                    "errors": ["Vaccination not found."],
                }
            ),
            404,
        )
    
    username = _get_username_from_jwt()
    vaccination.is_deleted = True
    vaccination.date_modified = datetime.utcnow()
    vaccination.modified_by = username
    
    db.session.commit()
    
    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Vaccination deleted successfully",
        }
    )

