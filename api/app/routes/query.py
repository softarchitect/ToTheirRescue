from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from sqlalchemy import and_, or_

from ..extensions import db
from ..models import (
    Animal, PCO, User, AnimalMilestone, Med, Medicine, Donation,
    AnimalVaccination, AnimalProcedure, HealthNote, SOAP
)


query_bp = Blueprint("query", __name__)


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


@query_bp.get("/animal-milestone-query")
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


@query_bp.get("/animal-health-query")
@jwt_required()
def get_animal_health_query():
    """Get animal health records based on query filters.
    
    Query params:
        - kind: The kind of health record (vaccinations, procedures, prescriptions, soaps, diet, notes, all)
        - animalTypeName: The animal type name to filter by (optional, empty for "All")
        - startDate: Start date for date range filter (optional, ISO format)
        - endDate: End date for date range filter (optional, ISO format)
    
    Returns animal health records matching the criteria.
    """
    tenant_id = _get_tenant_id_from_jwt()
    
    if not tenant_id:
        return jsonify({
            "success": False,
            "statusCode": 401,
            "errors": ["Unauthorized: Tenant ID not found in token"]
        }), 401
    
    try:
        kind = request.args.get("kind", "").strip().lower()
        animal_type_name = request.args.get("animalTypeName", "").strip()
        start_date_str = request.args.get("startDate", "")
        end_date_str = request.args.get("endDate", "")
        
        if not kind:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "errors": ["Kind is required."]
            }), 400
        
        # Parse dates if provided
        start_date = None
        end_date = None
        
        if start_date_str:
            try:
                start_date = datetime.fromisoformat(start_date_str.replace('Z', '+00:00'))
            except:
                pass
        
        if end_date_str:
            try:
                end_date = datetime.fromisoformat(end_date_str.replace('Z', '+00:00'))
                end_date = end_date.replace(hour=23, minute=59, second=59)
            except:
                pass
        
        health_data = []
        
        # Query based on kind
        if kind == "vaccinations" or kind == "all":
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
            
            if start_date:
                query = query.filter(AnimalVaccination.vaccination_date >= start_date)
            if end_date:
                query = query.filter(AnimalVaccination.vaccination_date <= end_date)
            
            results = query.order_by(AnimalVaccination.vaccination_date.desc()).all()
            
            for vaccination, animal in results:
                health_data.append({
                    "id": vaccination.id,
                    "animalId": animal.id,
                    "animalName": animal.animal_name or "",
                    "animalType": animal.animal_type_name or "",
                    "breedSpecies": animal.breed or "",
                    "date": vaccination.vaccination_date.isoformat() if vaccination.vaccination_date else None,
                    "type": "Vaccination",
                    "kind": vaccination.vaccination_type_name or "",
                    "tagNumber": animal.tag_number or "",
                    "microchipNo": animal.microchip_number or "",
                    "notes": vaccination.notes or "",
                })
        
        if kind == "procedures" or kind == "all":
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
            
            if start_date:
                query = query.filter(AnimalProcedure.procedure_date >= start_date)
            if end_date:
                query = query.filter(AnimalProcedure.procedure_date <= end_date)
            
            results = query.order_by(AnimalProcedure.procedure_date.desc()).all()
            
            for procedure, animal in results:
                health_data.append({
                    "id": procedure.id,
                    "animalId": animal.id,
                    "animalName": animal.animal_name or "",
                    "animalType": animal.animal_type_name or "",
                    "breedSpecies": animal.breed or "",
                    "date": procedure.procedure_date.isoformat() if procedure.procedure_date else None,
                    "type": "Procedure",
                    "kind": procedure.procedure_name or "",
                    "tagNumber": animal.tag_number or "",
                    "microchipNo": animal.microchip_number or "",
                    "notes": procedure.notes or "",
                })
        
        if kind == "prescriptions" or kind == "all":
            query = (
                db.session.query(Med, Animal, Medicine)
                .join(Animal, Med.animal_id == Animal.id)
                .join(Medicine, Med.medicine_id == Medicine.id)
                .filter(
                    Med.tenant_id == tenant_id,
                    Med.is_deleted.is_(False),
                    Animal.is_deleted.is_(False)
                )
            )
            
            if animal_type_name:
                query = query.filter(Animal.animal_type_name.ilike(animal_type_name))
            
            if start_date:
                query = query.filter(Med.date_entered >= start_date)
            if end_date:
                query = query.filter(Med.date_entered <= end_date)
            
            results = query.order_by(Med.date_entered.desc()).all()
            
            for med, animal, medicine in results:
                health_data.append({
                    "id": med.id,
                    "animalId": animal.id,
                    "animalName": animal.animal_name or "",
                    "animalType": animal.animal_type_name or "",
                    "breedSpecies": animal.breed or "",
                    "date": med.date_entered.isoformat() if med.date_entered else None,
                    "type": "Prescription",
                    "kind": medicine.medicine_name if medicine else "",
                    "tagNumber": animal.tag_number or "",
                    "microchipNo": animal.microchip_number or "",
                    "notes": med.notes or "",
                })
        
        if kind == "soaps" or kind == "all":
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
            
            if start_date:
                query = query.filter(SOAP.soap_date >= start_date)
            if end_date:
                query = query.filter(SOAP.soap_date <= end_date)
            
            results = query.order_by(SOAP.soap_date.desc()).all()
            
            for soap, animal in results:
                health_data.append({
                    "id": soap.id,
                    "animalId": animal.id,
                    "animalName": animal.animal_name or "",
                    "animalType": animal.animal_type_name or "",
                    "breedSpecies": animal.breed or "",
                    "date": soap.soap_date.isoformat() if soap.soap_date else None,
                    "type": "SOAP",
                    "kind": "SOAP",
                    "tagNumber": animal.tag_number or "",
                    "microchipNo": animal.microchip_number or "",
                    "notes": soap.notes or "",
                })
        
        if kind == "diet" or kind == "all":
            query = Animal.query.filter(
                Animal.tenant_id == tenant_id,
                Animal.is_deleted.is_(False),
                Animal.diet.isnot(None),
                Animal.diet != ""
            )
            
            if animal_type_name:
                query = query.filter(Animal.animal_type_name.ilike(animal_type_name))
            
            if start_date:
                query = query.filter(Animal.date_entered >= start_date)
            if end_date:
                query = query.filter(Animal.date_entered <= end_date)
            
            results = query.order_by(Animal.date_entered.desc()).all()
            
            for animal in results:
                health_data.append({
                    "id": animal.id,
                    "animalId": animal.id,
                    "animalName": animal.animal_name or "",
                    "animalType": animal.animal_type_name or "",
                    "breedSpecies": animal.breed or "",
                    "date": animal.date_entered.isoformat() if animal.date_entered else None,
                    "type": "Diet",
                    "kind": "Diet",
                    "tagNumber": animal.tag_number or "",
                    "microchipNo": animal.microchip_number or "",
                    "notes": animal.diet or "",
                })
        
        if kind == "notes" or kind == "all":
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
            
            if start_date:
                query = query.filter(HealthNote.note_date >= start_date)
            if end_date:
                query = query.filter(HealthNote.note_date <= end_date)
            
            results = query.order_by(HealthNote.note_date.desc()).all()
            
            for note, animal in results:
                health_data.append({
                    "id": note.id,
                    "animalId": animal.id,
                    "animalName": animal.animal_name or "",
                    "animalType": animal.animal_type_name or "",
                    "breedSpecies": animal.breed or "",
                    "date": note.note_date.isoformat() if note.note_date else None,
                    "type": "Note",
                    "kind": "Health Note",
                    "tagNumber": animal.tag_number or "",
                    "microchipNo": animal.microchip_number or "",
                    "notes": note.notes or "",
                })
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Animal health query retrieved successfully",
            "data": {
                "healthRecords": health_data,
                "count": len(health_data)
            }
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong getting animal health query: {str(e)}"]
        }), 400


@query_bp.get("/donations-query")
@jwt_required()
def get_donations_query():
    """Get donations based on query filters.
    
    Query params:
        - donationType: The donation type (money, other, all)
        - topDonors: How to sort top donors (byTotalAmount, byNumberOfDonations) - optional
        - startDate: Start date for date range filter (optional, ISO format)
        - endDate: End date for date range filter (optional, ISO format)
    
    Returns donations matching the criteria.
    """
    tenant_id = _get_tenant_id_from_jwt()
    
    if not tenant_id:
        return jsonify({
            "success": False,
            "statusCode": 401,
            "errors": ["Unauthorized: Tenant ID not found in token"]
        }), 401
    
    try:
        donation_type = request.args.get("donationType", "all").strip().lower()
        top_donors = request.args.get("topDonors", "").strip()
        start_date_str = request.args.get("startDate", "")
        end_date_str = request.args.get("endDate", "")
        
        # Parse dates if provided
        start_date = None
        end_date = None
        
        if start_date_str:
            try:
                start_date = datetime.fromisoformat(start_date_str.replace('Z', '+00:00'))
            except:
                pass
        
        if end_date_str:
            try:
                end_date = datetime.fromisoformat(end_date_str.replace('Z', '+00:00'))
                end_date = end_date.replace(hour=23, minute=59, second=59)
            except:
                pass
        
        # Build base query
        query = (
            db.session.query(Donation, PCO)
            .outerjoin(PCO, Donation.pco_id == PCO.id)
            .filter(
                Donation.tenant_id == tenant_id,
                Donation.is_deleted.is_(False)
            )
        )
        
        # Filter by donation type
        if donation_type == "money":
            query = query.filter(Donation.donation_type.ilike("money"))
        elif donation_type == "other":
            query = query.filter(~Donation.donation_type.ilike("money"))
        # "all" doesn't filter by type
        
        # Filter by date range
        if start_date:
            query = query.filter(Donation.donation_date >= start_date)
        if end_date:
            query = query.filter(Donation.donation_date <= end_date)
        
        results = query.order_by(Donation.donation_date.desc()).all()
        
        # Group by donor if topDonors is specified
        if top_donors:
            donor_stats = {}
            for donation, pco in results:
                pco_id = donation.pco_id or 0
                if pco_id not in donor_stats:
                    donor_stats[pco_id] = {
                        "pco": pco,
                        "donations": [],
                        "totalAmount": 0.0,
                        "count": 0
                    }
                donor_stats[pco_id]["donations"].append(donation)
                donor_stats[pco_id]["totalAmount"] += float(donation.amount or 0.0)
                donor_stats[pco_id]["count"] += 1
            
            # Sort by topDonors criteria
            if top_donors == "byTotalAmount":
                sorted_donors = sorted(donor_stats.items(), key=lambda x: x[1]["totalAmount"], reverse=True)
            else:  # byNumberOfDonations
                sorted_donors = sorted(donor_stats.items(), key=lambda x: x[1]["count"], reverse=True)
            
            donations_data = []
            for pco_id, stats in sorted_donors:
                pco = stats["pco"]
                donations_data.append({
                    "id": pco_id,
                    "lastName": pco.last_name if pco else "",
                    "firstName": pco.first_name if pco else "",
                    "numberOfDonations": stats["count"],
                    "totalAmount": f"${stats['totalAmount']:.2f}",
                    "mailList": "Yes" if pco and pco.mail_list else "No",
                    "note": stats["donations"][0].notes if stats["donations"] and stats["donations"][0].notes else "",
                })
        else:
            # Return individual donations
            donations_data = []
            for donation, pco in results:
                donations_data.append({
                    "id": donation.id,
                    "lastName": pco.last_name if pco else "",
                    "firstName": pco.first_name if pco else "",
                    "numberOfDonations": 1,
                    "totalAmount": f"${float(donation.amount or 0.0):.2f}",
                    "mailList": "Yes" if pco and pco.mail_list else "No",
                    "note": donation.notes or "",
                })
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Donations query retrieved successfully",
            "data": {
                "donations": donations_data,
                "count": len(donations_data)
            }
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong getting donations query: {str(e)}"]
        }), 400


@query_bp.get("/mail-list-query")
@jwt_required()
def get_mail_list_query():
    """Get PCOs for mail list based on query filters.
    
    Query params:
        - queryType: The query type (query1, query2, query3, query4, query6)
        - addedYears: Years since added to database (optional)
        - adoptedYears: Years since adopted an animal (optional)
        - donatedYears: Years since made a donation (optional)
    
    Returns PCOs matching the criteria.
    """
    tenant_id = _get_tenant_id_from_jwt()
    
    if not tenant_id:
        return jsonify({
            "success": False,
            "statusCode": 401,
            "errors": ["Unauthorized: Tenant ID not found in token"]
        }), 401
    
    try:
        query_type = request.args.get("queryType", "").strip()
        added_years = request.args.get("addedYears", "")
        adopted_years = request.args.get("adoptedYears", "")
        donated_years = request.args.get("donatedYears", "")
        
        if not query_type:
            return jsonify({
                "success": False,
                "statusCode": 400,
                "errors": ["Query type is required."]
            }), 400
        
        # Build base query
        query = PCO.query.filter(
            PCO.tenant_id == tenant_id,
            PCO.is_deleted.is_(False)
        )
        
        # Apply query type filters
        if query_type == "query1":  # PCOs on the mail list with complete addresses
            query = query.filter(
                PCO.mail_list.is_(True),
                PCO.street.isnot(None),
                PCO.street != "",
                PCO.city.isnot(None),
                PCO.city != "",
                PCO.state.isnot(None),
                PCO.state != "",
                PCO.zip.isnot(None),
                PCO.zip != ""
            )
        elif query_type == "query2":  # PCOs on mail list with email addresses
            query = query.filter(
                PCO.mail_list.is_(True),
                PCO.email.isnot(None),
                PCO.email != ""
            )
        elif query_type == "query3":  # PCOs on mail list without email addresses
            query = query.filter(
                PCO.mail_list.is_(True),
                or_(PCO.email.is_(None), PCO.email == "")
            )
        elif query_type == "query4":  # PCOs not on the mail list
            query = query.filter(PCO.mail_list.is_(False))
        elif query_type == "query6":  # PCOs on the mail list with incomplete addresses
            query = query.filter(
                PCO.mail_list.is_(True),
                or_(
                    PCO.street.is_(None),
                    PCO.street == "",
                    PCO.city.is_(None),
                    PCO.city == "",
                    PCO.state.is_(None),
                    PCO.state == "",
                    PCO.zip.is_(None),
                    PCO.zip == ""
                )
            )
        
        # Apply additional filters
        if added_years:
            try:
                years = int(added_years)
                cutoff_date = datetime.utcnow() - timedelta(days=years * 365)
                query = query.filter(PCO.date_entered >= cutoff_date)
            except:
                pass
        
        if adopted_years:
            try:
                years = int(adopted_years)
                cutoff_date = datetime.utcnow() - timedelta(days=years * 365)
                # Join with AnimalMilestone to find adoptions
                query = query.join(AnimalMilestone, PCO.id == AnimalMilestone.pco_id).filter(
                    AnimalMilestone.milestone_type == "Adoption",
                    AnimalMilestone.milestone_date >= cutoff_date,
                    AnimalMilestone.is_deleted.is_(False)
                ).distinct()
            except:
                pass
        
        if donated_years:
            try:
                years = int(donated_years)
                cutoff_date = datetime.utcnow() - timedelta(days=years * 365)
                # Join with Donation
                query = query.join(Donation, PCO.id == Donation.pco_id).filter(
                    Donation.donation_date >= cutoff_date,
                    Donation.is_deleted.is_(False)
                ).distinct()
            except:
                pass
        
        results = query.all()
        
        mail_list_data = []
        for pco in results:
            mail_list_data.append({
                "id": pco.id,
                "lastName": pco.last_name or "",
                "firstName": pco.first_name or "",
                "street": pco.street or "",
                "street2": pco.street2 or "",
                "city": pco.city or "",
                "state": pco.state or "",
                "zip": pco.zip or "",
                "phone": pco.phone or "",
                "email": pco.email or "",
                "mailList": "Yes" if pco.mail_list else "No",
                "notes": pco.notes or "",
            })
        
        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Mail list query retrieved successfully",
            "data": {
                "pcos": mail_list_data,
                "count": len(mail_list_data)
            }
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Something went wrong getting mail list query: {str(e)}"]
        }), 400

