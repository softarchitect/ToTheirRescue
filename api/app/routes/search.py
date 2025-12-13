from datetime import datetime
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from sqlalchemy import and_, or_

from ..extensions import db
from ..models import (
    Animal, PCO, User, AnimalMilestone, Med, Medicine, Donation,
    AnimalVaccination, AnimalProcedure, HealthNote, SOAP
)


search_bp = Blueprint("search", __name__)


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


@search_bp.get("/animals")
@jwt_required()
def search_animals():
    """Search animals with various filters.
    
    Query params:
        - name: Animal name (partial match)
        - animalType: Animal type name
        - currentResident: 'current' or 'former'
        - breed: Breed (partial match)
        - color: Color (partial match)
        - sex: 'male', 'female', or 'unknown'
        - location: Location (partial match)
        - notes: Notes (partial match)
        - chronicCondition: 'Yes' or 'No'
        - flagged: 'Yes' or 'No'
        - dietPresent: 'Yes' or 'No'
        - status: 'Adoptable', 'Permanent Resident', 'Quarantine Hold', 'Outdoor Feral'
        - spayedNeutered: 'yes' or 'no'
    """
    tenant_id = _get_tenant_id_from_jwt()
    
    if not tenant_id:
        return jsonify({
            "success": False,
            "statusCode": 401,
            "errors": ["Unauthorized: Tenant ID not found in token"]
        }), 401
    
    try:
        query = Animal.query.filter(
            Animal.tenant_id == tenant_id,
            Animal.is_deleted.is_(False)
        )
        
        # Apply filters
        name = request.args.get("name", "").strip()
        if name:
            query = query.filter(Animal.animal_name.ilike(f"%{name}%"))
        
        animal_type = request.args.get("animalType", "").strip()
        if animal_type:
            query = query.filter(Animal.animal_type_name.ilike(animal_type))
        
        current_resident = request.args.get("currentResident", "").strip().lower()
        if current_resident == "current":
            query = query.filter(Animal.current_resident.is_(True))
        elif current_resident == "former":
            query = query.filter(Animal.current_resident.is_(False))
        
        breed = request.args.get("breed", "").strip()
        if breed:
            query = query.filter(Animal.breed.ilike(f"%{breed}%"))
        
        color = request.args.get("color", "").strip()
        if color:
            query = query.filter(Animal.color.ilike(f"%{color}%"))
        
        sex = request.args.get("sex", "").strip().lower()
        if sex:
            query = query.filter(Animal.sex.ilike(sex))
        
        location = request.args.get("location", "").strip()
        if location:
            query = query.filter(Animal.location.ilike(f"%{location}%"))
        
        notes = request.args.get("notes", "").strip()
        if notes:
            query = query.filter(Animal.notes.ilike(f"%{notes}%"))
        
        chronic_condition = request.args.get("chronicCondition", "").strip()
        if chronic_condition == "Yes":
            query = query.filter(Animal.chronic_condition.isnot(None), Animal.chronic_condition != "")
        elif chronic_condition == "No":
            query = query.filter(or_(Animal.chronic_condition.is_(None), Animal.chronic_condition == ""))
        
        flagged = request.args.get("flagged", "").strip()
        if flagged == "Yes":
            query = query.filter(Animal.flag.is_(True))
        elif flagged == "No":
            query = query.filter(Animal.flag.is_(False))
        
        diet_present = request.args.get("dietPresent", "").strip()
        if diet_present == "Yes":
            query = query.filter(Animal.diet.isnot(None), Animal.diet != "")
        elif diet_present == "No":
            query = query.filter(or_(Animal.diet.is_(None), Animal.diet == ""))
        
        status = request.args.get("status", "").strip()
        if status:
            query = query.filter(Animal.status.ilike(status))
        
        spayed_neutered = request.args.get("spayedNeutered", "").strip().lower()
        if spayed_neutered == "yes":
            query = query.filter(Animal.spayed_or_neutered.is_(True))
        elif spayed_neutered == "no":
            query = query.filter(Animal.spayed_or_neutered.is_(False))
        
        results = query.order_by(Animal.animal_name.asc()).all()
        
        animals_data = []
        for animal in results:
            animals_data.append({
                "id": animal.id,
                "animalType": animal.animal_type_name or "",
                "name": animal.animal_name or "",
                "color": animal.color or "",
                "spayedNeutered": "Yes" if animal.spayed_or_neutered else "No",
                "notes": animal.notes or "",
                "flagged": "Yes" if animal.flag else "No",
                "status": animal.status or "",
                "currentResident": "Current" if animal.current_resident else "Former",
                "breed": animal.breed or "",
                "sex": animal.sex or "",
                "location": animal.location or "",
                "chronicCondition": animal.chronic_condition or "",
                "dietPresent": "Yes" if animal.diet and animal.diet != "" else "No",
            })
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Animals search retrieved successfully",
            "data": {
                "animals": animals_data,
                "count": len(animals_data)
            }
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong searching animals: {str(e)}"]
        }), 400


@search_bp.get("/donations")
@jwt_required()
def search_donations():
    """Search donations with filters.
    
    Query params:
        - firstName: Donor first name (partial match)
        - lastName: Donor last name (partial match)
        - donationType: 'money', 'other', or 'all'
        - notes: Notes (partial match)
    """
    tenant_id = _get_tenant_id_from_jwt()
    
    if not tenant_id:
        return jsonify({
            "success": False,
            "statusCode": 401,
            "errors": ["Unauthorized: Tenant ID not found in token"]
        }), 401
    
    try:
        query = (
            db.session.query(Donation, PCO)
            .outerjoin(PCO, Donation.pco_id == PCO.id)
            .filter(
                Donation.tenant_id == tenant_id,
                Donation.is_deleted.is_(False)
            )
        )
        
        # Apply filters
        first_name = request.args.get("firstName", "").strip()
        if first_name:
            query = query.filter(PCO.first_name.ilike(f"%{first_name}%"))
        
        last_name = request.args.get("lastName", "").strip()
        if last_name:
            query = query.filter(PCO.last_name.ilike(f"%{last_name}%"))
        
        donation_type = request.args.get("donationType", "all").strip().lower()
        if donation_type == "money":
            query = query.filter(Donation.donation_type.ilike("money"))
        elif donation_type == "other":
            query = query.filter(~Donation.donation_type.ilike("money"))
        # "all" doesn't filter by type
        
        notes = request.args.get("notes", "").strip()
        if notes:
            query = query.filter(Donation.notes.ilike(f"%{notes}%"))
        
        results = query.order_by(Donation.donation_date.desc()).all()
        
        donations_data = []
        for donation, pco in results:
            donations_data.append({
                "id": donation.id,
                "donationDate": donation.donation_date.isoformat() if donation.donation_date else None,
                "firstName": pco.first_name if pco else "",
                "lastName": pco.last_name if pco else "",
                "donationType": donation.donation_type or "",
                "amount": f"${float(donation.amount or 0.0):.2f}",
                "notes": donation.notes or "",
            })
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Donations search retrieved successfully",
            "data": {
                "donations": donations_data,
                "count": len(donations_data)
            }
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong searching donations: {str(e)}"]
        }), 400


@search_bp.get("/animal-milestones")
@jwt_required()
def search_animal_milestones():
    """Search animal milestones with filters.
    
    Query params:
        - milestoneType: Milestone type
        - animalTypeName: Animal type name
        - howAcquired: Acquisition way name
        - otherRescueShelterId: Other rescue shelter PCO ID
        - otherRescueIdNo: Other rescue ID number
        - notes: Notes (partial match)
    """
    tenant_id = _get_tenant_id_from_jwt()
    
    if not tenant_id:
        return jsonify({
            "success": False,
            "statusCode": 401,
            "errors": ["Unauthorized: Tenant ID not found in token"]
        }), 401
    
    try:
        query = (
            db.session.query(AnimalMilestone, Animal, PCO)
            .join(Animal, AnimalMilestone.animal_id == Animal.id)
            .outerjoin(PCO, AnimalMilestone.pco_id == PCO.id)
            .filter(
                AnimalMilestone.tenant_id == tenant_id,
                AnimalMilestone.is_deleted.is_(False),
                Animal.is_deleted.is_(False)
            )
        )
        
        # Apply filters
        milestone_type = request.args.get("milestoneType", "").strip()
        if milestone_type:
            query = query.filter(AnimalMilestone.milestone_type.ilike(milestone_type))
        
        animal_type_name = request.args.get("animalTypeName", "").strip()
        if animal_type_name:
            query = query.filter(Animal.animal_type_name.ilike(animal_type_name))
        
        how_acquired = request.args.get("howAcquired", "").strip()
        if how_acquired:
            query = query.filter(AnimalMilestone.acquisition_way_name.ilike(how_acquired))
        
        other_rescue_shelter_id = request.args.get("otherRescueShelterId", "")
        if other_rescue_shelter_id:
            try:
                shelter_id = int(other_rescue_shelter_id)
                query = query.filter(AnimalMilestone.other_rescue_shelter_id == shelter_id)
            except:
                pass
        
        other_rescue_id_no = request.args.get("otherRescueIdNo", "").strip()
        if other_rescue_id_no:
            query = query.filter(AnimalMilestone.other_rescue_id_no.ilike(f"%{other_rescue_id_no}%"))
        
        notes = request.args.get("notes", "").strip()
        if notes:
            query = query.filter(AnimalMilestone.notes.ilike(f"%{notes}%"))
        
        results = query.order_by(AnimalMilestone.milestone_date.desc()).all()
        
        milestones_data = []
        for milestone, animal, pco in results:
            other_rescue = ""
            if milestone.other_rescue_shelter_id:
                other_rescue_pco = (
                    PCO.query.filter(
                        PCO.id == milestone.other_rescue_shelter_id,
                        PCO.rescue.is_(True),
                        PCO.entity_type == "CorO",
                        PCO.is_deleted.is_(False),
                        PCO.tenant_id == tenant_id
                    )
                    .first()
                )
                if other_rescue_pco:
                    other_rescue = other_rescue_pco.last_name or ""
            
            milestones_data.append({
                "id": milestone.id,
                "date": milestone.milestone_date.isoformat() if milestone.milestone_date else None,
                "milestone": milestone.milestone_type or "",
                "name": animal.animal_name or "",
                "animalType": animal.animal_type_name or "",
                "howAcquired": milestone.acquisition_way_name or "",
                "otherRescue": other_rescue,
                "otherRescueId": milestone.other_rescue_id_no or "",
                "notes": milestone.notes or "",
            })
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Animal milestones search retrieved successfully",
            "data": {
                "milestones": milestones_data,
                "count": len(milestones_data)
            }
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong searching animal milestones: {str(e)}"]
        }), 400


@search_bp.get("/animal-health")
@jwt_required()
def search_animal_health():
    """Search animal health records with filters.
    
    Query params:
        - type: 'vaccination', 'ptt', 'prescription', 'soaps', 'notes'
        - animalTypeName: Animal type name
        - clinic: Clinic name (PCO last name)
        - vaccinationType: Vaccination type name (for vaccinations)
        - administerer: Administerer name
        - serialNumber: Serial number (for vaccinations)
        - vaccineManufacturer: Vaccine manufacturer (for vaccinations)
        - rabiesTagNo: Rabies tag number
        - veterinarian: Veterinarian name
        - personEntered: Person entered name (for notes)
        - microchipNo: Microchip number
        - subjective: Subjective (for SOAPs)
        - objective: Objective (for SOAPs)
        - assessment: Assessment (for SOAPs)
        - plan: Plan (for SOAPs)
        - notes: Notes (partial match)
    """
    tenant_id = _get_tenant_id_from_jwt()
    
    if not tenant_id:
        return jsonify({
            "success": False,
            "statusCode": 401,
            "errors": ["Unauthorized: Tenant ID not found in token"]
        }), 401
    
    try:
        health_type = request.args.get("type", "").strip().lower()
        animal_type_name = request.args.get("animalTypeName", "").strip()
        clinic = request.args.get("clinic", "").strip()
        notes = request.args.get("notes", "").strip()
        
        health_data = []
        
        # Search vaccinations
        if health_type == "vaccination" or health_type == "":
            query = (
                db.session.query(AnimalVaccination, Animal)
                .join(Animal, AnimalVaccination.animal_id == Animal.id)
                .filter(
                    AnimalVaccination.tenant_id == tenant_id,
                    AnimalVaccination.is_deleted.is_(False),
                    Animal.is_deleted.is_(False)
                )
            )
            
            if animal_type_name:
                query = query.filter(Animal.animal_type_name.ilike(animal_type_name))
            
            vaccination_type = request.args.get("vaccinationType", "").strip()
            if vaccination_type:
                query = query.filter(AnimalVaccination.vaccination_type_name.ilike(vaccination_type))
            
            administerer = request.args.get("administerer", "").strip()
            if administerer:
                query = query.filter(AnimalVaccination.administerer.ilike(f"%{administerer}%"))
            
            serial_number = request.args.get("serialNumber", "").strip()
            if serial_number:
                query = query.filter(AnimalVaccination.serial_number.ilike(f"%{serial_number}%"))
            
            vaccine_manufacturer = request.args.get("vaccineManufacturer", "").strip()
            if vaccine_manufacturer:
                query = query.filter(AnimalVaccination.vaccine_manufacturer.ilike(f"%{vaccine_manufacturer}%"))
            
            rabies_tag_no = request.args.get("rabiesTagNo", "").strip()
            if rabies_tag_no:
                query = query.filter(Animal.rabies_tag_number.ilike(f"%{rabies_tag_no}%"))
            
            if notes:
                query = query.filter(AnimalVaccination.notes.ilike(f"%{notes}%"))
            
            results = query.order_by(AnimalVaccination.vaccination_date.desc()).all()
            
            for vaccination, animal in results:
                # Get clinic if specified
                clinic_name = ""
                if clinic:
                    # This would need to be joined with PCO if clinic is stored there
                    pass
                
                health_data.append({
                    "id": vaccination.id,
                    "name": animal.animal_name or "",
                    "animalType": animal.animal_type_name or "",
                    "breedSpecies": animal.breed or "",
                    "clinic": clinic_name,
                    "type": "Vaccination",
                    "kind": vaccination.vaccination_type_name or "",
                    "rabiesTag": animal.rabies_tag_number or "",
                    "microchipNo": animal.microchip_number or "",
                    "notes": vaccination.notes or "",
                })
        
        # Search procedures
        if health_type == "ptt" or health_type == "":
            query = (
                db.session.query(AnimalProcedure, Animal)
                .join(Animal, AnimalProcedure.animal_id == Animal.id)
                .filter(
                    AnimalProcedure.tenant_id == tenant_id,
                    AnimalProcedure.is_deleted.is_(False),
                    Animal.is_deleted.is_(False)
                )
            )
            
            if animal_type_name:
                query = query.filter(Animal.animal_type_name.ilike(animal_type_name))
            
            administerer = request.args.get("administerer", "").strip()
            if administerer:
                query = query.filter(AnimalProcedure.administerer.ilike(f"%{administerer}%"))
            
            rabies_tag_no = request.args.get("rabiesTagNo", "").strip()
            if rabies_tag_no:
                query = query.filter(Animal.rabies_tag_number.ilike(f"%{rabies_tag_no}%"))
            
            microchip_no = request.args.get("microchipNo", "").strip()
            if microchip_no:
                query = query.filter(Animal.microchip_number.ilike(f"%{microchip_no}%"))
            
            if notes:
                query = query.filter(AnimalProcedure.notes.ilike(f"%{notes}%"))
            
            results = query.order_by(AnimalProcedure.procedure_date.desc()).all()
            
            for procedure, animal in results:
                health_data.append({
                    "id": procedure.id,
                    "name": animal.animal_name or "",
                    "animalType": animal.animal_type_name or "",
                    "breedSpecies": animal.breed or "",
                    "clinic": "",
                    "type": "Procedure",
                    "kind": procedure.procedure_name or "",
                    "rabiesTag": animal.rabies_tag_number or "",
                    "microchipNo": animal.microchip_number or "",
                    "notes": procedure.notes or "",
                })
        
        # Search SOAPs
        if health_type == "soaps" or health_type == "":
            query = (
                db.session.query(SOAP, Animal)
                .join(Animal, SOAP.animal_id == Animal.id)
                .filter(
                    SOAP.tenant_id == tenant_id,
                    SOAP.is_deleted.is_(False),
                    Animal.is_deleted.is_(False)
                )
            )
            
            if animal_type_name:
                query = query.filter(Animal.animal_type_name.ilike(animal_type_name))
            
            veterinarian = request.args.get("veterinarian", "").strip()
            if veterinarian:
                query = query.filter(SOAP.veterinarian.ilike(f"%{veterinarian}%"))
            
            subjective = request.args.get("subjective", "").strip()
            if subjective:
                query = query.filter(SOAP.subjective.ilike(f"%{subjective}%"))
            
            objective = request.args.get("objective", "").strip()
            if objective:
                query = query.filter(SOAP.objective.ilike(f"%{objective}%"))
            
            assessment = request.args.get("assessment", "").strip()
            if assessment:
                query = query.filter(SOAP.assessment.ilike(f"%{assessment}%"))
            
            plan = request.args.get("plan", "").strip()
            if plan:
                query = query.filter(SOAP.plan.ilike(f"%{plan}%"))
            
            if notes:
                query = query.filter(SOAP.notes.ilike(f"%{notes}%"))
            
            results = query.order_by(SOAP.soap_date.desc()).all()
            
            for soap, animal in results:
                health_data.append({
                    "id": soap.id,
                    "name": animal.animal_name or "",
                    "animalType": animal.animal_type_name or "",
                    "breedSpecies": animal.breed or "",
                    "clinic": "",
                    "type": "SOAP",
                    "kind": "SOAP",
                    "rabiesTag": animal.rabies_tag_number or "",
                    "microchipNo": animal.microchip_number or "",
                    "notes": soap.notes or "",
                })
        
        # Search notes
        if health_type == "notes" or health_type == "":
            query = (
                db.session.query(HealthNote, Animal)
                .join(Animal, HealthNote.animal_id == Animal.id)
                .filter(
                    HealthNote.tenant_id == tenant_id,
                    HealthNote.is_deleted.is_(False),
                    Animal.is_deleted.is_(False)
                )
            )
            
            if animal_type_name:
                query = query.filter(Animal.animal_type_name.ilike(animal_type_name))
            
            person_entered = request.args.get("personEntered", "").strip()
            if person_entered:
                query = query.filter(HealthNote.entered_by.ilike(f"%{person_entered}%"))
            
            if notes:
                query = query.filter(HealthNote.notes.ilike(f"%{notes}%"))
            
            results = query.order_by(HealthNote.note_date.desc()).all()
            
            for note, animal in results:
                health_data.append({
                    "id": note.id,
                    "name": animal.animal_name or "",
                    "animalType": animal.animal_type_name or "",
                    "breedSpecies": animal.breed or "",
                    "clinic": "",
                    "type": "Note",
                    "kind": "Health Note",
                    "rabiesTag": animal.rabies_tag_number or "",
                    "microchipNo": animal.microchip_number or "",
                    "notes": note.notes or "",
                })
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Animal health search retrieved successfully",
            "data": {
                "healthRecords": health_data,
                "count": len(health_data)
            }
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong searching animal health: {str(e)}"]
        }), 400

