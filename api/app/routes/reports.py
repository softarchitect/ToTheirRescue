from datetime import datetime, date
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

from ..extensions import db
from ..models import (
    Animal,
    AnimalMilestone,
    AnimalProcedure,
    AnimalVaccination,
    ArtifactAttachment,
    HealthNote,
    HealthProcedure,
    Med,
    Medicine,
    PCO,
    SOAP,
    Tenant,
    User,
    VaccinationType,
)


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


def _iso_date(value):
    if not value:
        return None
    return value.isoformat()


def _clinic_name(pco):
    if not pco:
        return ""
    return pco.last_name if pco.hospital else ""


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


@reports_bp.get("/get-animal-health-report")
@jwt_required()
def get_animal_health_report():
    """Get the data needed for an animal health report.

    Mirrors the old system report: tenant header, animal summary, chronic
    condition, diet, reminders, past vaccinations, and health chronology.
    """
    tenant_id = _get_tenant_id_from_jwt()
    animal_id = request.args.get("animalId", type=int)

    if not tenant_id:
        return jsonify({
            "success": False,
            "statusCode": 401,
            "errors": ["Unauthorized: Tenant ID not found in token"]
        }), 401

    if not animal_id:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": ["animalId is required"]
        }), 400

    try:
        animal = Animal.query.filter(
            Animal.id == animal_id,
            Animal.tenant_id == tenant_id,
            Animal.is_deleted.is_(False),
        ).first()

        if not animal:
            return jsonify({
                "success": False,
                "statusCode": 404,
                "errors": ["Animal not found"]
            }), 404

        tenant = Tenant.query.filter(
            Tenant.id == tenant_id,
            Tenant.is_deleted.is_(False),
        ).first()

        birth_milestone = (
            AnimalMilestone.query.filter(
                AnimalMilestone.animal_id == animal.id,
                AnimalMilestone.tenant_id == tenant_id,
                AnimalMilestone.is_deleted.is_(False),
                db.func.lower(db.func.trim(AnimalMilestone.milestone_type)) == "birth",
            )
            .order_by(AnimalMilestone.milestone_date.asc())
            .first()
        )

        primary_photo = (
            ArtifactAttachment.query.filter(
                ArtifactAttachment.animal_id == animal.id,
                ArtifactAttachment.tenant_id == tenant_id,
                ArtifactAttachment.is_deleted.is_(False),
                db.func.lower(ArtifactAttachment.attachment_type) == "photo",
                db.or_(
                    ArtifactAttachment.thumbnail_blob_url.isnot(None),
                    ArtifactAttachment.blob_url.isnot(None),
                ),
            )
            .order_by(
                db.case((ArtifactAttachment.publicity_rank == 1, 0), else_=1),
                ArtifactAttachment.publicity_rank.asc(),
                ArtifactAttachment.attachment_date.desc(),
            )
            .first()
        )

        reminder_reports = []
        vaccination_reminders = (
            db.session.query(AnimalVaccination, VaccinationType)
            .outerjoin(VaccinationType, AnimalVaccination.kind_id == VaccinationType.id)
            .filter(
                AnimalVaccination.animal_id == animal.id,
                AnimalVaccination.tenant_id == tenant_id,
                AnimalVaccination.is_deleted.is_(False),
                AnimalVaccination.reminder.is_(True),
            )
            .order_by(AnimalVaccination.due_date.asc())
            .all()
        )
        for vaccination, vaccination_type in vaccination_reminders:
            reminder_reports.append({
                "reminderId": vaccination.id,
                "animalId": animal.id,
                "tenantId": tenant_id,
                "reminder": vaccination.reminder,
                "dueDate": _iso_date(vaccination.due_date),
                "kind": vaccination_type.kind if vaccination_type else "",
            })

        procedure_reminders = (
            db.session.query(AnimalProcedure, HealthProcedure)
            .outerjoin(HealthProcedure, AnimalProcedure.kind_id == HealthProcedure.id)
            .filter(
                AnimalProcedure.animal_id == animal.id,
                AnimalProcedure.tenant_id == tenant_id,
                AnimalProcedure.is_deleted.is_(False),
                AnimalProcedure.reminder.is_(True),
            )
            .order_by(AnimalProcedure.due_date.asc())
            .all()
        )
        for procedure, health_procedure in procedure_reminders:
            reminder_reports.append({
                "reminderId": procedure.id,
                "animalId": animal.id,
                "tenantId": tenant_id,
                "reminder": procedure.reminder,
                "dueDate": _iso_date(procedure.due_date),
                "kind": health_procedure.kind if health_procedure else "",
            })
        reminder_reports.sort(key=lambda item: item["dueDate"] or "")

        vaccination_reports = []
        vaccinations = (
            db.session.query(AnimalVaccination, VaccinationType, PCO)
            .outerjoin(VaccinationType, AnimalVaccination.kind_id == VaccinationType.id)
            .outerjoin(PCO, AnimalVaccination.hospital_clinic_id == PCO.id)
            .filter(
                AnimalVaccination.animal_id == animal.id,
                AnimalVaccination.tenant_id == tenant_id,
                AnimalVaccination.is_deleted.is_(False),
                AnimalVaccination.reminder.is_(False),
            )
            .order_by(AnimalVaccination.action_date.asc())
            .all()
        )
        for vaccination, vaccination_type, clinic in vaccinations:
            if clinic and not clinic.hospital:
                continue
            vaccination_reports.append({
                "vaccinationId": vaccination.id,
                "animalId": animal.id,
                "tenantId": tenant_id,
                "vaccinationKind": vaccination_type.kind if vaccination_type else "",
                "actionDate": _iso_date(vaccination.action_date),
                "clinic": _clinic_name(clinic),
                "practitioner": vaccination.administerer or "",
                "tagNumber": vaccination.tag_number or "",
                "manufacturer": vaccination.vaccine_manufacturer or "",
                "serialNo": vaccination.vaccine_serial_no or "",
                "notes": vaccination.notes or "",
                "reminder": vaccination.reminder,
            })

        health_chronology_reports = []
        procedures = (
            db.session.query(AnimalProcedure, HealthProcedure, PCO)
            .outerjoin(HealthProcedure, AnimalProcedure.kind_id == HealthProcedure.id)
            .outerjoin(PCO, AnimalProcedure.hospital_clinic_id == PCO.id)
            .filter(
                AnimalProcedure.animal_id == animal.id,
                AnimalProcedure.tenant_id == tenant_id,
                AnimalProcedure.is_deleted.is_(False),
                AnimalProcedure.reminder.is_(False),
            )
            .order_by(AnimalProcedure.action_date.asc())
            .all()
        )
        for procedure, health_procedure, clinic in procedures:
            health_chronology_reports.append({
                "id": procedure.id,
                "animalId": animal.id,
                "tenantId": tenant_id,
                "actionDate": _iso_date(procedure.action_date),
                "kind": health_procedure.kind if health_procedure else "",
                "tableName": "Animal Procedure",
                "clinic": _clinic_name(clinic),
                "practitioner": procedure.administerer or "",
                "weight": procedure.weight or "",
                "results": procedure.results or "",
                "microchipNumber": procedure.microchip_number or "",
                "notes": procedure.notes or "",
                "subjective": "",
                "objective": "",
                "assessment": "",
                "soapPlan": "",
            })

        health_notes = (
            HealthNote.query.filter(
                HealthNote.animal_id == animal.id,
                HealthNote.tenant_id == tenant_id,
                HealthNote.is_deleted.is_(False),
            )
            .order_by(HealthNote.action_date.asc())
            .all()
        )
        for note in health_notes:
            health_chronology_reports.append({
                "id": note.id,
                "animalId": animal.id,
                "tenantId": tenant_id,
                "actionDate": _iso_date(note.action_date),
                "kind": "",
                "tableName": "Health Note",
                "clinic": "",
                "practitioner": "",
                "weight": "",
                "results": "",
                "microchipNumber": "",
                "notes": note.note or "",
                "subjective": "",
                "objective": "",
                "assessment": "",
                "soapPlan": "",
            })

        soaps = (
            db.session.query(SOAP, PCO)
            .outerjoin(PCO, SOAP.hospital_clinic_id == PCO.id)
            .filter(
                SOAP.animal_id == animal.id,
                SOAP.tenant_id == tenant_id,
                SOAP.is_deleted.is_(False),
            )
            .order_by(SOAP.action_date.asc())
            .all()
        )
        for soap, clinic in soaps:
            health_chronology_reports.append({
                "id": soap.id,
                "animalId": animal.id,
                "tenantId": tenant_id,
                "actionDate": _iso_date(soap.action_date),
                "kind": "",
                "tableName": "SOAP",
                "clinic": _clinic_name(clinic),
                "practitioner": soap.veterinarian or "",
                "weight": "",
                "results": "",
                "microchipNumber": "",
                "notes": "",
                "subjective": soap.subjective or "",
                "objective": soap.objective or "",
                "assessment": soap.assessment or "",
                "soapPlan": soap.soap_plan or "",
            })
        health_chronology_reports.sort(key=lambda item: item["actionDate"] or "")

        return jsonify({
            "success": True,
            "statusCode": 200,
            "message": "Animal health report data has collected.",
            "data": {
                "tenantReport": {
                    "id": tenant.id if tenant else tenant_id,
                    "name": tenant.name if tenant else "",
                    "street": tenant.street if tenant else "",
                    "city": tenant.city if tenant else "",
                    "state": tenant.state if tenant else "",
                    "zip": tenant.zip if tenant else "",
                    "phone": tenant.phone if tenant else "",
                },
                "animalReport": {
                    "id": animal.id,
                    "tenantId": tenant_id,
                    "animalMilestoneId": birth_milestone.id if birth_milestone else None,
                    "animalName": animal.animal_name or "",
                    "animalId": animal.animal_id,
                    "animalTypeName": animal.animal_type_name or "",
                    "sex": animal.sex or "",
                    "breed": animal.breed or "",
                    "color": animal.color or "",
                    "birthDate": _iso_date(birth_milestone.milestone_date) if birth_milestone else None,
                    "isApproxDOB": birth_milestone.is_approx_dob if birth_milestone else False,
                    "milestoneType": birth_milestone.milestone_type if birth_milestone else "",
                    "artifactAttachment": (
                        primary_photo.thumbnail_blob_url or primary_photo.blob_url
                    ) if primary_photo else None,
                },
                "chronicConditionReport": {
                    "id": animal.id,
                    "tenantId": tenant_id,
                    "chronicCondition": animal.chronic_condition or "None",
                },
                "dietReport": {
                    "id": animal.id,
                    "tenantId": tenant_id,
                    "diet": animal.diet or "None",
                },
                "reminderReports": reminder_reports,
                "vaccinationReports": vaccination_reports,
                "healthChronologyReports": health_chronology_reports,
            },
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "statusCode": 400,
            "errors": [f"Oops! Error occurred for animal health report: {str(e)}"]
        }), 400

