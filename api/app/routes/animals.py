from datetime import datetime, timedelta

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

from ..extensions import db
from ..models import Animal, User
from ..models.animal_milestone import AnimalMilestone
from ..models.artifact_attachment import ArtifactAttachment


animals_bp = Blueprint("animals", __name__)


def _get_tenant_id_from_jwt():
    """Get tenant_id from JWT token, similar to old C# GetTenantIdByUserName."""
    user_id = get_jwt_identity()
    if user_id:
        user = User.query.get(user_id)
        if user and user.tenant_id:
            return user.tenant_id
    return None


def _get_milestone_by_animal_and_type(animal_id: int, milestone_type: str):
    """Get milestone by animal ID and type, matching old C# GetAnimalMilestoneByAnimalIdAndType."""
    return AnimalMilestone.query.filter(
        AnimalMilestone.animal_id == animal_id,
        AnimalMilestone.milestone_type == milestone_type,
        AnimalMilestone.is_deleted.is_(False)
    ).first()


def _get_milestone_count_by_animal(animal_id: int):
    """Get milestone count for an animal, matching old C# GetAnimalMilestoneCountByAnimalId."""
    count = AnimalMilestone.query.filter(
        AnimalMilestone.animal_id == animal_id,
        AnimalMilestone.is_deleted.is_(False)
    ).count()
    
    # Order by ID ascending to match old system (OrderBy(a => a.Id))
    milestones = AnimalMilestone.query.filter(
        AnimalMilestone.animal_id == animal_id,
        AnimalMilestone.is_deleted.is_(False)
    ).order_by(AnimalMilestone.id.asc()).all()
    
    milestone_list = [
        {
            "id": m.id,
            "milestoneType": m.milestone_type,
            "milestoneDate": m.milestone_date.isoformat() if m.milestone_date else None,
            "notes": m.notes,
        }
        for m in milestones
    ]
    
    return {"count": count, "animalMilestones": milestone_list}


def _get_photo_attachment_by_animal(animal_id: int):
    """Get photo attachment for an animal, matching old C# GetAttachmentTypeByAnimalIdAsync."""
    attachment = ArtifactAttachment.query.filter(
        ArtifactAttachment.animal_id == animal_id,
        ArtifactAttachment.entity == "ANIMAL",
        ArtifactAttachment.attachment_type == "PHOTO",
        ArtifactAttachment.is_deleted.is_(False)
    ).order_by(ArtifactAttachment.publicity_rank.desc(), ArtifactAttachment.attachment_date.desc()).first()
    
    if attachment:
        return {
            "id": attachment.id,
            "fileName": attachment.file_name,
            "blobUrl": attachment.blob_url or "",
            "thumbnailBlobUrl": attachment.thumbnail_blob_url or "",
            "attachmentDate": attachment.attachment_date.isoformat() if attachment.attachment_date else None,
        }
    return None


def _get_attachment_count_by_animal(animal_id: int):
    """Get attachment count for an animal, matching old C# GetAttachmentCountByAnimalIdAsync."""
    count = ArtifactAttachment.query.filter(
        ArtifactAttachment.animal_id == animal_id,
        ArtifactAttachment.is_deleted.is_(False)
    ).count()
    
    attachments = ArtifactAttachment.query.filter(
        ArtifactAttachment.animal_id == animal_id,
        ArtifactAttachment.is_deleted.is_(False)
    ).order_by(ArtifactAttachment.attachment_date.desc()).all()
    
    attachment_list = [
        {
            "id": a.id,
            "fileName": a.file_name,
            "attachmentType": a.attachment_type,
            "blobUrl": a.blob_url or "",
            "attachmentDate": a.attachment_date.isoformat() if a.attachment_date else None,
        }
        for a in attachments
    ]
    
    return {"count": count, "artifactAttachments": attachment_list}


def _milestone_to_dict(milestone):
    """Convert milestone to dictionary format matching old C# response."""
    if not milestone:
        return None
    return {
        "id": milestone.id,
        "milestoneType": milestone.milestone_type,
        "milestoneDate": milestone.milestone_date.isoformat() if milestone.milestone_date else None,
        "amountPaidFee": float(milestone.amount_paid_fee) if milestone.amount_paid_fee else 0.0,
        "amountReceivedFee": float(milestone.amount_received_fee) if milestone.amount_received_fee else 0.0,
        "notes": milestone.notes,
        "acquisitionWayId": milestone.acquisition_way_id,
        "acquisitionWayName": milestone.acquisition_way_name,
        "pcoId": milestone.pco_id,
        "isApproxDOB": milestone.is_approx_dob,
    }


@animals_bp.get("/get-animal")
@jwt_required(optional=True)
def get_animals():
    """Port of the old GET api/animal/get-animal endpoint.

    Query params:
      - searchText: filter by name or breed (case-insensitive)
      - isAvailable: if 'true', filter out deleted / non-current animals
      - isDeleted: if 'true', include only deleted animals
      - Page/Limit: pagination parameters
    """
    search_text = request.args.get("searchText", "", type=str) or ""
    is_available = request.args.get("isAvailable", "false").lower() == "true"
    is_deleted = request.args.get("isDeleted", "false").lower() == "true"
    page = request.args.get("Page", request.args.get("page", 1, type=int), type=int)
    limit = request.args.get("Limit", request.args.get("limit", 20, type=int), type=int)

    # Get tenant_id from JWT, matching old C# GetTenantIdByUserName
    # tenant_id = _get_tenant_id_from_jwt()
    
    # Build query with tenant filtering
    query = Animal.query
    # if tenant_id:
    #     query = query.filter(Animal.tenant_id == tenant_id)
    
    # Apply search filter
    if search_text:
        pattern = f"%{search_text.lower()}%"
        query = query.filter(
            db.or_(
                db.func.lower(Animal.animal_name).like(pattern),
                db.func.lower(Animal.breed).like(pattern),
            )
        )
    
    # Apply deletion filter
    if is_deleted:
        query = query.filter(Animal.is_deleted.is_(True))
    elif is_available:
        query = query.filter(Animal.is_deleted.is_(False))

    total_items = query.count()
    items = (
        query.order_by(Animal.date_entered.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    # Build response matching old C# ListAnimalResponse structure
    animals_list = []
    for animal in items:
        animal_id = animal.id
        
        # Get milestones
        birth_milestone = _get_milestone_by_animal_and_type(animal_id, "Birth")
        intake_milestone = _get_milestone_by_animal_and_type(animal_id, "Intake")
        
        # Get milestone count
        milestone_count_data = _get_milestone_count_by_animal(animal_id)
        
        # Get photo attachment
        artifact_attachment = _get_photo_attachment_by_animal(animal_id)
        
        # Get attachment count
        attachment_count_data = _get_attachment_count_by_animal(animal_id)
        
        animal_dict = {
            "id": animal.id,
            "animalId": animal.animal_id or animal.id,
            "animalName": animal.animal_name,
            "animalTypeId": animal.animal_type_id,
            "currentResident": animal.current_resident,
            "breed": animal.breed or "",
            "color": animal.color or "",
            "notes": animal.notes or "",
            "flag": animal.flag,
            "flagReason": animal.flag_reason or "",
            "isDeleted": animal.is_deleted,
            "location": animal.location or "",
            "pcoId": animal.pco_id,
            "sex": animal.sex or "",
            "spayedOrNeutered": animal.spayed_or_neutered,
            "lastMilestone": animal.last_milestone or "",
            "lastMilestoneDate": animal.last_milestone_date.isoformat() if animal.last_milestone_date else None,
            "tenantId": animal.tenant_id,
            "animalType": animal.animal_type_name or "",
            "chronicCondition": animal.chronic_condition or "",
            "status": animal.status or "",
            "birthMilestone": _milestone_to_dict(birth_milestone),
            "intakeMilestone": _milestone_to_dict(intake_milestone),
            "artifactAttachment": artifact_attachment,
            "attachmentCountData": attachment_count_data,
            "animalMilestoneCountData": milestone_count_data,
        }
        animals_list.append(animal_dict)

    total_pages = (total_items + limit - 1) // limit if limit else 1
    next_page = page + 1 if page < total_pages else None
    prev_page = page - 1 if page > 1 else None

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Animal Retrived successfully",
            "data": {
                "currentPage": page,
                "animalsList": animals_list,
                "totalItems": total_items,
                "totalPage": total_pages,
                "nextPage": next_page,
                "prevPage": prev_page,
            },
        }
    )


def _get_last_animal_id(tenant_id: int) -> int:
    """Get the last AnimalId for a tenant, matching old C# GetLastAnimalIdAsync."""
    last_animal = Animal.query.filter(
        Animal.tenant_id == tenant_id
    ).order_by(Animal.animal_id.desc()).first()
    
    if last_animal and last_animal.animal_id:
        return last_animal.animal_id
    return 0


def _create_animal_with_milestones(
    *,
    base_name: str,
    suffix: int | None,
    sex: str,
    payload: dict,
    intake_date,
    birth_date,
    is_approx_dob: bool,
    birth_notes: str | None,
    how_acquired: str,
    per_animal_intake_cost: float,
    per_animal_donation_amount: float,
    intake_notes: str | None,
    tenant_id: int,
    username: str,
    animal_type_id: int,
    animal_type_name: str,
    spayed_or_neutered: bool,
    pco_id: int | None = None,
):
    """Internal helper to create one Animal and its birth/intake milestones, matching old C# logic."""

    name = base_name if suffix is None else f"{base_name}-{suffix}"
    
    # Get last animal ID for this tenant
    last_animal_id = _get_last_animal_id(tenant_id)
    new_animal_id = last_animal_id + 1
    
    # Extract animal data from payload (supporting both old and new payload structures)
    animal_data = payload.get("animal", {}) if isinstance(payload.get("animal"), dict) else payload

    animal = Animal(
        animal_name=name,
        breed=(animal_data.get("breed") or payload.get("breed") or "").strip(),
        color=(animal_data.get("color") or payload.get("color") or "").strip(),
        sex=(sex or "").capitalize() or "Unknown",
        status=(animal_data.get("status") or payload.get("status") or "available").lower(),
        animal_type_id=animal_type_id,
        animal_type_name=animal_type_name,
        chronic_condition=(animal_data.get("chronicCondition") or payload.get("chronicCondition") or "").strip(),
        publicity_blurb=(animal_data.get("description") or payload.get("description") or "").strip(),
        last_milestone="Intake",
        last_milestone_date=intake_date or datetime.utcnow(),
        animal_id=new_animal_id,
        tenant_id=tenant_id,
        entered_by=username,
        date_entered=datetime.utcnow(),
        pco_id=pco_id or 1,
        notes=(animal_data.get("notes") or payload.get("notes") or "").strip() or "",
        modified_by="",
        spayed_or_neutered=spayed_or_neutered,
    )

    db.session.add(animal)
    db.session.flush()  # Assigns animal.id without committing yet.
    
    # Get milestone data from payload (supporting both old and new structures)
    birth_milestone_data = payload.get("birthMilestone", {}) if isinstance(payload.get("birthMilestone"), dict) else {}
    intake_milestone_data = payload.get("intakeMilestone", {}) if isinstance(payload.get("intakeMilestone"), dict) else {}
    
    # Get acquisition way ID and name from howAcquired
    how_acquired_id_raw = (
        intake_milestone_data.get("acquisitionWayId") or 
        payload.get("howAcquired") or 
        how_acquired or 
        ""
    )
    acquisition_way_id = 0
    acquisition_way_name = how_acquired or ""
    
    try:
        acquisition_way_id = int(how_acquired_id_raw) if how_acquired_id_raw else 0
        # If we have an ID, try to get the name from the database
        if acquisition_way_id > 0:
            from ..models import AcquisitionWay
            acq_way = AcquisitionWay.query.filter(
                AcquisitionWay.id == acquisition_way_id,
                AcquisitionWay.is_deleted.is_(False)
            ).first()
            if acq_way:
                acquisition_way_name = acq_way.acquisition_way_name
    except (ValueError, TypeError):
        acquisition_way_id = 0
    
    # Get other rescue shelter ID and PCO ID from payload
    other_rescue_shelter_id = 0
    try:
        other_rescue_shelter_id_raw = (
            birth_milestone_data.get("otherRescueShelterId") or
            intake_milestone_data.get("otherRescueShelterId") or
            payload.get("otherRescueShelterId")
        )
        if other_rescue_shelter_id_raw is not None:
            other_rescue_shelter_id = int(other_rescue_shelter_id_raw)
    except (ValueError, TypeError):
        other_rescue_shelter_id = 0
    
    milestone_pco_id = pco_id or 1
    try:
        pco_id_raw = (
            animal_data.get("pcoId") or
            payload.get("personOrRescueId") or
            payload.get("pcoId")
        )
        if pco_id_raw is not None:
            milestone_pco_id = int(pco_id_raw)
    except (ValueError, TypeError):
        milestone_pco_id = pco_id or 1
    
    other_rescue_id_no = (
        birth_milestone_data.get("otherRescueIDNo") or
        intake_milestone_data.get("otherRescueIDNo") or
        payload.get("otherRescueID") or 
        ""
    ).strip() or ""

    # Birth milestone (if we have a date).
    birth_milestone = None
    if birth_date is not None:
        birth_milestone = AnimalMilestone(
            milestone_type="Birth",
            milestone_date=birth_date,
            other_rescue_id_no=other_rescue_id_no,
            amount_paid_fee=per_animal_intake_cost or 0,
            amount_received_fee=per_animal_donation_amount or 0,
            notes=birth_notes,
            acquisition_way_id=acquisition_way_id,
            pco_id=milestone_pco_id,
            animal_id=animal.id,
            tenant_id=tenant_id,
            acquisition_way_name=acquisition_way_name,
            other_rescue_shelter_id=other_rescue_shelter_id,
            is_approx_dob=is_approx_dob,
            entered_by=username,
            date_entered=datetime.utcnow(),
        )
        db.session.add(birth_milestone)
        db.session.flush()

    # Intake milestone.
    intake_milestone = AnimalMilestone(
        milestone_type="Intake",
        milestone_date=intake_date or datetime.utcnow(),
        other_rescue_id_no=other_rescue_id_no,
        amount_paid_fee=per_animal_intake_cost or 0,
        amount_received_fee=per_animal_donation_amount or 0,
        notes=intake_notes,
        acquisition_way_id=acquisition_way_id,
        pco_id=milestone_pco_id,
        animal_id=animal.id,
        tenant_id=tenant_id,
        acquisition_way_name=how_acquired or "",
        other_rescue_shelter_id=other_rescue_shelter_id,
        is_approx_dob=False,
        entered_by=username,
        date_entered=datetime.utcnow(),
    )
    db.session.add(intake_milestone)
    db.session.flush()
    
    # Update animal's last milestone
    animal.last_milestone = "Intake"
    animal.last_milestone_date = intake_milestone.milestone_date

    return animal, birth_milestone, intake_milestone


@animals_bp.post("/create-animal")
@jwt_required(optional=True)
def create_animal():
    """Port of the old POST api/animal/create-animal endpoint.

    Create one or more animals, cloning from a single detail form.
    Behaviour mirrors the legacy TYR multi-animal intake:

    - `animalCount` defaults to 1.
    - When `animalCount` > 1 the payload should also include
      `maleCount`, `femaleCount` and optional `unknownCount`.
      The sum of these must equal `animalCount`.
    - For multi-animal intake we create that many Animals, appending
      `-1`, `-2`, ... to the provided `name` to form individual names.
    
    Query params (matching old C#):
      - noofAnimals: number of animals (can also be in payload)
      - male: number of males
      - female: number of females
      - unknown: number of unknown sex
    """
    payload = request.get_json(silent=True) or {}
    
    
    # Prefer query params, fall back to payload
    animal_count = int(payload.get("animalCount") or 1)
    male_count = int(payload.get("maleCount") or 0)
    female_count =  int(payload.get("femaleCount") or 0)
    unknown_count = int(payload.get("unknownCount") or 0)
    
    # Get tenant_id and username from JWT
    user_id = get_jwt_identity()
    username = ""
    tenant_id = None
    
    if user_id:
        jwt_data = get_jwt()
        username = jwt_data.get("username") or ""
        user = User.query.get(user_id)
        if user:
            if not username:
                username = user.user_name or ""
            if user.tenant_id:
                tenant_id = user.tenant_id
    
    if not tenant_id:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["User or tenant not found."],
                }
            ),
            400,
        )
    
    # Validate animal type (matching old C# validation)
    # Try to get animalTypeId from payload (direct or nested)
    animal_type_id = None
    if "animalTypeId" in payload:
        animal_type_id = payload.get("animalTypeId")
    elif isinstance(payload.get("animal"), dict) and "animalTypeId" in payload.get("animal", {}):
        animal_type_id = payload.get("animal", {}).get("animalTypeId")
    
    spayed_or_neutered = payload.get("spayedNeutered") or False
    
    # Convert to int if it's a string or ensure it's a valid integer
    try:
        if animal_type_id is not None:
            animal_type_id = int(animal_type_id)
    except (ValueError, TypeError):
        animal_type_id = None
    
    # Validate that we have a valid positive integer
    if not animal_type_id or animal_type_id <= 0:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Animal details are required including animal type."],
                }
            ),
            400,
        )
    
    # Get animal type name
    from ..models import AnimalType
    animal_type = AnimalType.query.get(animal_type_id)
    if not animal_type:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Animal type not found."],
                }
            ),
            400,
        )
    animal_type_name = animal_type.type_name
    
    # Get name from payload (direct or nested)
    name = None
    if "name" in payload:
        name = payload.get("name")
    elif isinstance(payload.get("animal"), dict) and "animalName" in payload.get("animal", {}):
        name = payload.get("animal", {}).get("animalName")
    
    # Convert to string and strip whitespace
    if name is not None:
        name = str(name).strip()
    else:
        name = ""
    if not name:
        return (
            jsonify(
                {
                    "success": False,
                    "statusCode": 400,
                    "errors": ["Animal name is required."],
                }
            ),
            400,
        )
    
    # Validate animal count matches gender counts
    # if animal_count != (male_count + female_count + unknown_count):
    #     return (
    #         jsonify(
    #             {
    #                 "success": False,
    #                 "statusCode": 400,
    #                 "errors": ["Invalid animal request. Total no animals is invalid"],
    #             }
    #         ),
    #         400,
    #     )


    # Optional intake date from the UI; falls back to "now".
    intake_date_raw = (payload.get("intakeDate") or "").strip()
    intake_date = None
    if intake_date_raw:
        try:
            # Expecting an ISO date (YYYY-MM-DD) from the frontend.
            intake_date = datetime.fromisoformat(intake_date_raw)
        except ValueError:
            intake_date = None

    # Birth milestone information: either an actual birthdate or an
    # approximate age (years / months) from which we derive the date.
    actual_birth_raw = (payload.get("actualBirthDate") or "").strip()
    approx_years = int(payload.get("approximateYears") or 0)
    approx_months = int(payload.get("approximateMonths") or 0)
    birth_notes = (payload.get("birthNotes") or "").strip() or None

    birth_date = None
    is_approx_dob = False

    if actual_birth_raw:
        try:
            birth_date = datetime.fromisoformat(actual_birth_raw)
        except ValueError:
            birth_date = None

    if birth_date is None and (approx_years or approx_months):
        # Very simple approximation: convert years / months to days.
        # This mirrors the old UI behaviour closely enough for reporting.
        days = approx_years * 365 + approx_months * 30
        birth_date = (intake_date or datetime.utcnow()) - timedelta(days=days)
        is_approx_dob = True

    # Intake milestone extra info.
    # howAcquired can be either an ID (number) or a name (string)
    # We'll extract the name from acquisition ways if it's an ID
    how_acquired_raw = payload.get("howAcquired") or ""
    how_acquired = how_acquired_raw  # Will be set to name if ID is found
    intake_cost_raw = payload.get("intakeCost") or 0
    donation_amount_raw = payload.get("donationAmount") or 0
    try:
        intake_cost = float(intake_cost_raw or 0)
    except (TypeError, ValueError):
        intake_cost = 0.0
    try:
        donation_amount = float(donation_amount_raw or 0)
    except (TypeError, ValueError):
        donation_amount = 0.0
    intake_notes = (payload.get("intakeNotes") or "").strip() or None

    # Split intake / donation amounts evenly across all created animals,
    # just like the legacy implementation.
    if animal_count > 0:
        per_animal_intake_cost = intake_cost / animal_count if intake_cost else 0
        per_animal_donation_amount = (
            donation_amount / animal_count if donation_amount else 0
        )
    else:
        per_animal_intake_cost = intake_cost
        per_animal_donation_amount = donation_amount

    # Get PCO ID from payload
    pco_id = None
    try:
        animal_data = payload.get("animal", {}) if isinstance(payload.get("animal"), dict) else {}
        pco_id_raw = animal_data.get("pcoId") or payload.get("pcoId")
        if pco_id_raw is not None:
            pco_id = int(pco_id_raw)
    except (ValueError, TypeError):
        pco_id = None

    created_animals_data = []

    if animal_count == 1:
        # Single-animal case – preserve existing behaviour, using the
        # simple gender field from the payload.
        gender = (payload.get("gender") or "").lower() or "unknown"
        if male_count == 1:
            gender = "male"
        elif female_count == 1:
            gender = "female"
        elif unknown_count == 1:
            gender = "unknown"

        animal, birth_milestone, intake_milestone = _create_animal_with_milestones(
            base_name=name,
            suffix=None,
            sex=gender,
            payload=payload,
            intake_date=intake_date,
            birth_date=birth_date,
            is_approx_dob=is_approx_dob,
            birth_notes=birth_notes,
            how_acquired=how_acquired,
            per_animal_intake_cost=per_animal_intake_cost,
            per_animal_donation_amount=per_animal_donation_amount,
            intake_notes=intake_notes,
            tenant_id=tenant_id,
            username=username,
            animal_type_id=animal_type_id,
            animal_type_name=animal_type_name,
            pco_id=pco_id,
            spayed_or_neutered=spayed_or_neutered,
        )
        
        # Build response matching old C# structure
        animal_dict = {
            "id": animal.id,
            "animal": animal.to_dict_basic(),
            "birthMilestoneId": birth_milestone.id if birth_milestone else None,
            "birthAnimalMilestone": _milestone_to_dict(birth_milestone) if birth_milestone else None,
            "intakeMilestoneId": intake_milestone.id if intake_milestone else None,
            "intakeAnimalMilestone": _milestone_to_dict(intake_milestone) if intake_milestone else None,
            "animalList": [animal.to_dict_basic()],
        }
        created_animals_data.append(animal_dict)
    else:
        # Multi-animal case: expect explicit male / female / unknown counts.
        counter = 0

        # Create males.
        for _ in range(male_count):
            counter += 1
            animal, birth_milestone, intake_milestone = _create_animal_with_milestones(
                base_name=name,
                suffix=counter,
                sex="male",
                payload=payload,
                intake_date=intake_date,
                birth_date=birth_date,
                is_approx_dob=is_approx_dob,
                birth_notes=birth_notes,
                how_acquired=how_acquired,
                per_animal_intake_cost=per_animal_intake_cost,
                per_animal_donation_amount=per_animal_donation_amount,
                intake_notes=intake_notes,
                tenant_id=tenant_id,
                username=username,
                animal_type_id=animal_type_id,
                animal_type_name=animal_type_name,
                pco_id=pco_id,
                spayed_or_neutered=spayed_or_neutered,
            )
            
            animal_dict = {
                "id": animal.id,
                "animal": animal.to_dict_basic(),
                "birthMilestoneId": birth_milestone.id if birth_milestone else None,
                "birthAnimalMilestone": _milestone_to_dict(birth_milestone) if birth_milestone else None,
                "intakeMilestoneId": intake_milestone.id if intake_milestone else None,
                "intakeAnimalMilestone": _milestone_to_dict(intake_milestone) if intake_milestone else None,
                "animalList": [animal.to_dict_basic()],
            }
            created_animals_data.append(animal_dict)

        # Create females.
        for _ in range(female_count):
            counter += 1
            animal, birth_milestone, intake_milestone = _create_animal_with_milestones(
                base_name=name,
                suffix=counter,
                sex="female",
                payload=payload,
                intake_date=intake_date,
                birth_date=birth_date,
                is_approx_dob=is_approx_dob,
                birth_notes=birth_notes,
                how_acquired=how_acquired,
                per_animal_intake_cost=per_animal_intake_cost,
                per_animal_donation_amount=per_animal_donation_amount,
                intake_notes=intake_notes,
                tenant_id=tenant_id,
                username=username,
                animal_type_id=animal_type_id,
                animal_type_name=animal_type_name,
                pco_id=pco_id,
                spayed_or_neutered=spayed_or_neutered,
            )
            
            animal_dict = {
                "id": animal.id,
                "animal": animal.to_dict_basic(),
                "birthMilestoneId": birth_milestone.id if birth_milestone else None,
                "birthAnimalMilestone": _milestone_to_dict(birth_milestone) if birth_milestone else None,
                "intakeMilestoneId": intake_milestone.id if intake_milestone else None,
                "intakeAnimalMilestone": _milestone_to_dict(intake_milestone) if intake_milestone else None,
                "animalList": [animal.to_dict_basic()],
            }
            created_animals_data.append(animal_dict)

        # Create unknown-sex animals (if any).
        for _ in range(unknown_count):
            counter += 1
            animal, birth_milestone, intake_milestone = _create_animal_with_milestones(
                base_name=name,
                suffix=counter,
                sex="unknown",
                payload=payload,
                intake_date=intake_date,
                birth_date=birth_date,
                is_approx_dob=is_approx_dob,
                birth_notes=birth_notes,
                how_acquired=how_acquired,
                per_animal_intake_cost=per_animal_intake_cost,
                per_animal_donation_amount=per_animal_donation_amount,
                intake_notes=intake_notes,
                tenant_id=tenant_id,
                username=username,
                animal_type_id=animal_type_id,
                animal_type_name=animal_type_name,
                pco_id=pco_id,
                spayed_or_neutered=spayed_or_neutered,
            )
            
            animal_dict = {
                "id": animal.id,
                "animal": animal.to_dict_basic(),
                "birthMilestoneId": birth_milestone.id if birth_milestone else None,
                "birthAnimalMilestone": _milestone_to_dict(birth_milestone) if birth_milestone else None,
                "intakeMilestoneId": intake_milestone.id if intake_milestone else None,
                "intakeAnimalMilestone": _milestone_to_dict(intake_milestone) if intake_milestone else None,
                "animalList": [animal.to_dict_basic()],
            }
            created_animals_data.append(animal_dict)

    db.session.commit()

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Animals Added Successfully!",
            "data": created_animals_data,
        }
    )


@animals_bp.put("/update-animal-location")
def update_animal_location():
    """Update Location for one or more animals.

    Rough equivalent of the old
    api/animal/update-animal-location endpoint.

    Expected JSON body:
      {
        "animalIds": [1, 2, 3],
        "location": "New kennel row"
      }
    """
    payload = request.get_json(silent=True) or {}
    raw_ids = payload.get("animalIds") or []
    location = (payload.get("location") or "").strip()

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

    for animal in animals:
        animal.location = location
        animal.date_modified = datetime.utcnow()

    db.session.commit()

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Animal location updated successfully",
        }
    )


@animals_bp.put("/update-animal-diet")
def update_animal_diet():
    """Update Diet text for one or more animals.

    Simplified analogue of the old api/animal/update-animal-diet endpoint.

    Expected JSON body:
      {
        "animalIds": [1, 2, 3],
        "diet": "Timothy hay + pellets; fresh greens once daily"
      }
    """

    payload = request.get_json(silent=True) or {}
    raw_ids = payload.get("animalIds") or []
    diet_text = (payload.get("diet") or "").strip()

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
    for animal in animals:
        animal.diet = diet_text
        animal.date_modified = now

    db.session.commit()

    return jsonify(
        {
            "success": True,
            "statusCode": 200,
            "message": "Animal diet updated successfully",
        }
    )


@animals_bp.patch("/delete-animal/<int:id>")
@jwt_required(optional=True)
def delete_animal(id):
    """Port of the old PATCH api/animal/delete-animal/{id} endpoint.
    
    Soft deletes an animal and all associated milestones and attachments.
    This performs a cascading soft delete:
    1. Soft delete all milestones for the animal
    2. Soft delete all artifact attachments for the animal
    3. Soft delete the animal itself
    
    Args:
        id: The animal ID to delete
    """
    # Get tenant_id from JWT
    tenant_id = _get_tenant_id_from_jwt()
    
    # Get username from JWT for tracking who deleted
    user_id = get_jwt_identity()
    username = ""
    if user_id:
        jwt_data = get_jwt()
        username = jwt_data.get("username") or ""
        if not username:
            user = User.query.get(user_id)
            if user:
                username = user.user_name or ""
    
    # Find the animal (with tenant filtering if tenant_id is available)
    query = Animal.query.filter(Animal.id == id)
    if tenant_id:
        query = query.filter(Animal.tenant_id == tenant_id)
    
    animal = query.first()
    
    if not animal:
        return jsonify(
            {
                "success": False,
                "statusCode": 200,
                "message": "Animal does not exist",
                "errors": ["Animal does not exist"],
            }
        )
    
    try:
        animal_id = animal.id
        
        # Step 1: Soft delete all milestones for this animal
        milestones = AnimalMilestone.query.filter(
            AnimalMilestone.animal_id == animal_id,
            AnimalMilestone.is_deleted.is_(False)
        ).all()
        
        for milestone in milestones:
            milestone.is_deleted = True
            milestone.modified_by = username
            milestone.date_modified = datetime.utcnow()
        
        # Step 2: Soft delete all artifact attachments for this animal
        attachments = ArtifactAttachment.query.filter(
            ArtifactAttachment.animal_id == animal_id,
            ArtifactAttachment.is_deleted.is_(False)
        ).all()
        
        for attachment in attachments:
            attachment.is_deleted = True
            attachment.modified_by = username
            attachment.date_modified = datetime.utcnow()
        
        # Step 3: Soft delete the animal itself
        animal.is_deleted = True
        animal.modified_by = username
        animal.date_modified = datetime.utcnow()
        
        # Commit all changes
        db.session.commit()
        
        return jsonify(
            {
                "success": True,
                "statusCode": 200,
                "message": "Animal deleted successfully!",
                "data": {
                    "isDeleted": True,
                },
            }
        )
    
    except Exception as ex:
        db.session.rollback()
        error_msg = str(ex)
        inner_error = str(ex.__cause__) if ex.__cause__ else None
        
        errors = [error_msg]
        if inner_error:
            errors.append(inner_error)
        
        return jsonify(
            {
                "success": False,
                "statusCode": 200,
                "message": "Animal does not exist",
                "errors": errors,
            }
        )


@animals_bp.put("/update-animal")
@jwt_required(optional=True)
def update_animal():
    """Port of the old PUT api/animal/Update-animal endpoint.
    
    Updates an existing animal's information.
    
    Query params:
      - Id: The animal ID to update
    
    Expected JSON body:
      {
        "animalName": "string",
        "breed": "string",
        "color": "string",
        "sex": "string",
        "status": "string",
        "animalTypeId": int,
        "chronicCondition": "string",
        "notes": "string",
        "location": "string",
        "spayedOrNeutered": bool,
        "flag": bool,
        "flagReason": "string",
        "currentResident": bool,
        "pcoId": int (optional),
        "lastMilestone": "string" (optional),
        "lastMilestoneDate": "string" (optional, ISO format)
      }
    """
    # Get animal ID from query parameter
    animal_id = request.args.get("Id", type=int)
    if not animal_id or animal_id <= 0:
        return jsonify(
            {
                "success": False,
                "statusCode": 400,
                "errors": ["Animal ID is required and must be a positive integer."],
            }
        ), 400
    
    payload = request.get_json(silent=True) or {}
    
    # Get tenant_id and username from JWT
    user_id = get_jwt_identity()
    username = ""
    tenant_id = None
    
    if user_id:
        jwt_data = get_jwt()
        username = jwt_data.get("username") or ""
        user = User.query.get(user_id)
        if user:
            if not username:
                username = user.user_name or ""
            if user.tenant_id:
                tenant_id = user.tenant_id
    
    # Find the animal (with tenant filtering if tenant_id is available)
    query = Animal.query.filter(Animal.id == animal_id)
    if tenant_id:
        query = query.filter(Animal.tenant_id == tenant_id)
    
    animal = query.first()
    
    if not animal:
        return jsonify(
            {
                "success": False,
                "statusCode": 404,
                "errors": ["Animal not found."],
            }
        ), 404
    
    try:
        # Update animal fields if provided in payload
        if "animalName" in payload and payload["animalName"] is not None:
            animal.animal_name = str(payload["animalName"]).strip()
        
        if "breed" in payload and payload["breed"] is not None:
            animal.breed = str(payload["breed"]).strip()
        
        if "color" in payload and payload["color"] is not None:
            animal.color = str(payload["color"]).strip()
        
        if "sex" in payload and payload["sex"] is not None:
            animal.sex = str(payload["sex"]).strip()
        
        if "status" in payload and payload["status"] is not None:
            animal.status = str(payload["status"]).strip().lower()
        
        if "animalTypeId" in payload and payload["animalTypeId"] is not None:
            animal_type_id = int(payload["animalTypeId"])
            animal.animal_type_id = animal_type_id
            # Get animal type name
            from ..models import AnimalType
            animal_type = AnimalType.query.get(animal_type_id)
            if animal_type:
                animal.animal_type_name = animal_type.type_name
        
        if "chronicCondition" in payload and payload["chronicCondition"] is not None:
            animal.chronic_condition = str(payload["chronicCondition"]).strip()
        
        if "notes" in payload and payload["notes"] is not None:
            animal.notes = str(payload["notes"]).strip()
        
        if "location" in payload and payload["location"] is not None:
            animal.location = str(payload["location"]).strip()
        
        if "spayedOrNeutered" in payload:
            animal.spayed_or_neutered = bool(payload["spayedOrNeutered"])
        
        if "flag" in payload:
            animal.flag = bool(payload["flag"])
        
        if "flagReason" in payload and payload["flagReason"] is not None:
            animal.flag_reason = str(payload["flagReason"]).strip()
        
        if "currentResident" in payload:
            animal.current_resident = bool(payload["currentResident"])
        
        if "pcoId" in payload and payload["pcoId"] is not None:
            animal.pco_id = int(payload["pcoId"])
        
        if "lastMilestone" in payload and payload["lastMilestone"] is not None:
            animal.last_milestone = str(payload["lastMilestone"]).strip()
        
        if "lastMilestoneDate" in payload and payload["lastMilestoneDate"]:
            try:
                animal.last_milestone_date = datetime.fromisoformat(payload["lastMilestoneDate"].replace("Z", "+00:00"))
            except (ValueError, TypeError):
                pass  # Keep existing value if parsing fails
        
        # Update modified tracking
        animal.modified_by = username
        animal.date_modified = datetime.utcnow()
        
        # Save changes
        db.session.commit()
        
        # Get birth and intake milestones for response
        birth_milestone = _get_milestone_by_animal_and_type(animal.id, "Birth")
        intake_milestone = _get_milestone_by_animal_and_type(animal.id, "Intake")
        
        # Build response matching old C# structure
        animal_dict = {
            "id": animal.id,
            "animalId": animal.animal_id or animal.id,
            "animalName": animal.animal_name,
            "animalTypeId": animal.animal_type_id,
            "currentResident": animal.current_resident,
            "breed": animal.breed or "",
            "color": animal.color or "",
            "notes": animal.notes or "",
            "flag": animal.flag,
            "flagReason": animal.flag_reason or "",
            "isDeleted": animal.is_deleted,
            "location": animal.location or "",
            "pcoId": animal.pco_id,
            "sex": animal.sex or "",
            "spayedOrNeutered": animal.spayed_or_neutered,
            "lastMilestone": animal.last_milestone or "",
            "lastMilestoneDate": animal.last_milestone_date.isoformat() if animal.last_milestone_date else None,
            "tenantId": animal.tenant_id,
            "animalType": animal.animal_type_name or "",
            "chronicCondition": animal.chronic_condition or "",
            "status": animal.status or "",
            "birthMilestone": _milestone_to_dict(birth_milestone),
            "intakeMilestone": _milestone_to_dict(intake_milestone),
        }
        
        return jsonify(
            {
                "success": True,
                "statusCode": 200,
                "message": "Animal updated successfully",
                "data": {
                    "id": animal.id,
                    "animal": animal_dict,
                },
            }
        )
    
    except Exception as ex:
        db.session.rollback()
        error_msg = str(ex)
        inner_error = str(ex.__cause__) if ex.__cause__ else None
        
        errors = ["Oops! something went wrong while animal update", error_msg]
        if inner_error:
            errors.append(inner_error)
        
        return jsonify(
            {
                "success": False,
                "statusCode": 200,
                "errors": errors,
            }
        )


@animals_bp.get("/get-animals-by-animalIds")
@jwt_required(optional=True)
def get_animals_by_animal_ids():
    """Port of the old GET api/animal/get-animals-by-animalIds endpoint.
    
    Query params:
      - ids: comma-separated string of animal IDs (e.g., "1,2,3")
    
    Returns a list of animals with their milestones, attachments, and counts.
    """
    ids_param = request.args.get("ids", "", type=str)
    
    if not ids_param or not ids_param.strip():
        return jsonify(
            {
                "success": False,
                "statusCode": 400,
                "errors": ["Animal identifiers required"],
            }
        ), 400
    
    # Parse comma-separated IDs to list of integers
    try:
        id_strings = [s.strip() for s in ids_param.split(",") if s.strip()]
        animal_ids = [int(animal_id) for animal_id in id_strings]
    except (ValueError, TypeError) as e:
        return jsonify(
            {
                "success": False,
                "statusCode": 400,
                "errors": [f"Invalid animal identifiers: {str(e)}"],
            }
        ), 400
    
    if not animal_ids:
        return jsonify(
            {
                "success": False,
                "statusCode": 400,
                "errors": ["Animal identifiers required"],
            }
        ), 400
    
    try:
        # Query animals by IDs, filtering out deleted ones
        animals = Animal.query.filter(
            Animal.id.in_(animal_ids),
            Animal.is_deleted.is_(False)
        ).all()
        
        if not animals:
            return jsonify(
                {
                    "success": True,
                    "statusCode": 200,
                    "message": "Animals retrieved successfully",
                    "data": {
                        "animalList": []
                    }
                }
            )
        
        # Build response matching old C# ListAnimalResponse structure
        animals_list = []
        for animal in animals:
            animal_id = animal.id
            
            # Get milestones
            birth_milestone = _get_milestone_by_animal_and_type(animal_id, "Birth")
            intake_milestone = _get_milestone_by_animal_and_type(animal_id, "Intake")
            
            # Get milestone count
            milestone_count_data = _get_milestone_count_by_animal(animal_id)
            
            # Get photo attachment
            artifact_attachment = _get_photo_attachment_by_animal(animal_id)
            
            # Get attachment count
            attachment_count_data = _get_attachment_count_by_animal(animal_id)
            
            animal_dict = {
                "id": animal.id,
                "animalId": animal.animal_id or animal.id,
                "animalName": animal.animal_name,
                "animalTypeId": animal.animal_type_id,
                "currentResident": animal.current_resident,
                "breed": animal.breed or "",
                "color": animal.color or "",
                "notes": animal.notes or "",
                "flag": animal.flag,
                "flagReason": animal.flag_reason or "",
                "isDeleted": animal.is_deleted,
                "location": animal.location or "",
                "pcoId": animal.pco_id,
                "sex": animal.sex or "",
                "spayedOrNeutered": animal.spayed_or_neutered,
                "lastMilestone": animal.last_milestone or "",
                "lastMilestoneDate": animal.last_milestone_date.isoformat() if animal.last_milestone_date else None,
                "tenantId": animal.tenant_id,
                "animalType": animal.animal_type_name or "",
                "chronicCondition": animal.chronic_condition or "",
                "status": animal.status or "",
                "birthMilestone": _milestone_to_dict(birth_milestone),
                "intakeMilestone": _milestone_to_dict(intake_milestone),
                "artifactAttachment": artifact_attachment,
                "attachmentCountData": attachment_count_data,
                "animalMilestoneCountData": milestone_count_data,
            }
            animals_list.append(animal_dict)
        
        return jsonify(
            {
                "success": True,
                "statusCode": 200,
                "message": "Animal retrieved successfully",
                "data": {
                    "animalList": animals_list
                }
            }
        )
    
    except Exception as ex:
        error_msg = str(ex)
        inner_error = str(ex.__cause__) if ex.__cause__ else None
        
        errors = ["Oops! something went wrong while getting animals", error_msg]
        if inner_error:
            errors.append(inner_error)
        
        return jsonify(
            {
                "success": False,
                "statusCode": 200,
                "errors": errors,
            }
        )