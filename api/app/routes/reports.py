from datetime import datetime, date
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from sqlalchemy import and_, or_

from ..extensions import db
from ..models import Animal, PCO, User, AnimalMilestone, Med, Medicine


reports_bp = Blueprint("reports", __name__)


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
    return claims.get("username", "")


@reports_bp.get("/current-fosters")
@jwt_required()
def get_current_fosters():
    """Get animals currently in foster care.
    
    Returns animals with a 'Foster' milestone that don't have a 'Foster Return' milestone.
    """
    tenant_id = _get_tenant_id_from_jwt()
    
    if not tenant_id:
        return jsonify({
            "success": False,
            "statusCode": 401,
            "errors": ["Unauthorized: Tenant ID not found in token"]
        }), 401
    
    try:
        # Get all foster milestones for the tenant
        foster_milestones = (
            AnimalMilestone.query.filter(
                AnimalMilestone.tenant_id == tenant_id,
                AnimalMilestone.milestone_type == "Foster",
                AnimalMilestone.is_deleted.is_(False)
            )
            .order_by(AnimalMilestone.milestone_date.desc())
            .all()
        )
        
        fosters_data = []
        for foster_milestone in foster_milestones:
            animal_id = foster_milestone.animal_id
            
            # Check if there's a Foster Return milestone for this animal after the foster date
            foster_return = (
                AnimalMilestone.query.filter(
                    AnimalMilestone.animal_id == animal_id,
                    AnimalMilestone.milestone_type == "Foster Return",
                    AnimalMilestone.milestone_date >= foster_milestone.milestone_date,
                    AnimalMilestone.is_deleted.is_(False)
                )
                .first()
            )
            
            # Only include if there's no foster return (still in foster)
            if not foster_return:
                animal = Animal.query.get(animal_id)
                if animal and not animal.is_deleted:
                    # Get PCO (fosterer) information
                    pco = PCO.query.get(foster_milestone.pco_id) if foster_milestone.pco_id else None
                    
                    fosters_data.append({
                        "id": animal.id,
                        "name": animal.animal_name or "",
                        "animalType": animal.animal_type_name or "",
                        "breed": animal.breed or "",
                        "fosterersName": f"{pco.first_name} {pco.last_name}".strip() if pco else "N/A",
                        "fosterBeginDate": foster_milestone.milestone_date.date().isoformat() if foster_milestone.milestone_date else None,
                        "email": pco.email if pco else "",
                        "phone": pco.phone if pco else "",
                        "pcoId": foster_milestone.pco_id,
                    })
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Current fosters retrieved successfully",
            "data": {
                "fosters": fosters_data,
                "count": len(fosters_data)
            }
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong getting current fosters: {str(e)}"]
        }), 400


@reports_bp.get("/todays-meds")
@jwt_required()
def get_todays_meds():
    """Get medications due today.
    
    Returns all med records where due_date is today and not yet administered.
    """
    tenant_id = _get_tenant_id_from_jwt()
    
    if not tenant_id:
        return jsonify({
            "success": False,
            "statusCode": 401,
            "errors": ["Unauthorized: Tenant ID not found in token"]
        }), 401
    
    try:
        today = date.today()
        today_start = datetime.combine(today, datetime.min.time())
        today_end = datetime.combine(today, datetime.max.time())
        
        # Get all meds due today that haven't been administered
        meds = (
            Med.query.filter(
                Med.tenant_id == tenant_id,
                Med.is_deleted.is_(False),
                Med.due_date >= today_start,
                Med.due_date <= today_end,
                Med.administered_date.is_(None)  # Not yet administered
            )
            .order_by(Med.due_date.asc())
            .all()
        )
        
        meds_data = []
        for med in meds:
            animal = Animal.query.get(med.animal_id)
            medicine = Medicine.query.get(med.medicine_id)
            
            if animal and not animal.is_deleted:
                meds_data.append({
                    "id": med.id,
                    "animalId": animal.id,
                    "animalName": animal.animal_name or "",
                    "animalType": animal.animal_type_name or "",
                    "medicineName": medicine.medicine_name if medicine else "Unknown",
                    "dosage": med.dosage or "",
                    "dueDate": med.due_date.isoformat() if med.due_date else None,
                    "administeredDate": med.administered_date.isoformat() if med.administered_date else None,
                    "administeredBy": med.administered_by or "",
                    "notes": med.notes or "",
                    "clinic": med.clinic or "",
                    "veterinarian": med.veterinarian or "",
                    "reminder": med.reminder,
                })
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Today's meds retrieved successfully",
            "data": {
                "meds": meds_data,
                "count": len(meds_data)
            }
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong getting today's meds: {str(e)}"]
        }), 400


@reports_bp.get("/animal-milestone-query")
@jwt_required()
def get_animal_milestone_query():
    """Get animal milestones based on query filters.
    
    Query params:
        - milestoneType: The milestone type to filter by (required)
        - animalTypeName: The animal type name to filter by (optional, empty for "All")
        - milestoneStartDate: Start date for date range filter (optional, ISO format)
        - milestoneEndDate: End date for date range filter (optional, ISO format)
    
    Returns animal milestones matching the criteria.
    """
    tenant_id = _get_tenant_id_from_jwt()
    
    if not tenant_id:
        return jsonify({
            "success": False,
            "statusCode": 401,
            "errors": ["Unauthorized: Tenant ID not found in token"]
        }), 401
    
    try:
        milestone_type = request.args.get("milestoneType", "").strip()
        animal_type_name = request.args.get("animalTypeName", "").strip()
        milestone_start_date_str = request.args.get("milestoneStartDate", "")
        milestone_end_date_str = request.args.get("milestoneEndDate", "")
        
        if not milestone_type:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "errors": ["Milestone type is required."]
            }), 400
        
        # Parse dates if provided
        milestone_start_date = None
        milestone_end_date = None
        
        if milestone_start_date_str:
            try:
                milestone_start_date = datetime.fromisoformat(milestone_start_date_str.replace('Z', '+00:00'))
            except:
                pass
        
        if milestone_end_date_str:
            try:
                milestone_end_date = datetime.fromisoformat(milestone_end_date_str.replace('Z', '+00:00'))
                # Set to end of day
                milestone_end_date = milestone_end_date.replace(hour=23, minute=59, second=59)
            except:
                pass
        
        # Build query with joins (left join for PCO in case pco_id is null)
        query = (
            db.session.query(AnimalMilestone, Animal, PCO)
            .join(Animal, AnimalMilestone.animal_id == Animal.id)
            .outerjoin(PCO, AnimalMilestone.pco_id == PCO.id)
            .filter(
                AnimalMilestone.tenant_id == tenant_id,
                AnimalMilestone.is_deleted.is_(False),
                Animal.is_deleted.is_(False),
                AnimalMilestone.milestone_type.ilike(milestone_type)
            )
        )
        
        # Apply animal type filter if provided
        if animal_type_name:
            query = query.filter(Animal.animal_type_name.ilike(animal_type_name))
        
        # Apply date range filters if provided
        if milestone_start_date:
            query = query.filter(AnimalMilestone.milestone_date >= milestone_start_date)
        
        if milestone_end_date:
            query = query.filter(AnimalMilestone.milestone_date <= milestone_end_date)
        
        # Order by milestone date descending
        results = query.order_by(AnimalMilestone.milestone_date.desc()).all()
        
        # Get other rescue PCO if applicable
        milestone_data = []
        for milestone, animal, pco in results:
            other_rescue = ""
            if milestone.other_rescue_shelter_id:
                other_rescue_pco = (
                    PCO.query.filter(
                        PCO.id == milestone.other_rescue_shelter_id,
                        PCO.rescue.is_(True),
                        PCO.entity_type == "Company_Organisation",
                        PCO.is_deleted.is_(False),
                        PCO.tenant_id == tenant_id
                    )
                    .first()
                )
                if other_rescue_pco:
                    other_rescue = other_rescue_pco.last_name or ""
            
            milestone_data.append({
                "id": milestone.id,
                "animalId": animal.id,
                "pcoId": pco.id if pco else None,
                "tenantId": tenant_id,
                "milestoneDate": milestone.milestone_date.isoformat() if milestone.milestone_date else None,
                "animalName": animal.animal_name or "",
                "animalTypeName": animal.animal_type_name or "",
                "milestoneType": milestone.milestone_type or "",
                "otherRescue": other_rescue,
                "howAcquired": milestone.acquisition_way_name or "",
                "lastName": pco.last_name if pco else "",
                "firstName": pco.first_name if pco else "",
                "notes": milestone.notes or "",
                "animalMilestoneDeleted": milestone.is_deleted,
                "animalDeleted": animal.is_deleted,
                "pcoDeleted": pco.is_deleted if pco else False,
            })
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Animal milestone query retrieved successfully",
            "data": {
                "animalMilestoneQueries": milestone_data,
                "count": len(milestone_data)
            }
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong getting animal milestone query: {str(e)}"]
        }), 400

