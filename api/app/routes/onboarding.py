from datetime import datetime

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

from ..extensions import db
from ..models import (
    User,
    Tenant,
    AnimalType,
    Behavior,
    HealthProcedure,
    VaccinationType,
    SAAnimalType,
    SABehavior,
    SAHealthProcedure,
    SAVaccinationType,
    PCO,
)


onboarding_bp = Blueprint("onboarding", __name__)


@onboarding_bp.post("/add-onboarding")
@jwt_required(optional=True)
def add_onboarding():
  """Port of the old api/onboarding/add-onboarding endpoint.

  Expected JSON shape from the new onboarding UI:
  {
    "animalTypes": ["Dogs", "Cats"],
    "otherRescues": ["Rescue A", "Rescue B"],
    "clinics": ["Clinic X", "Clinic Y"]
  }
  """
  payload = request.get_json(silent=True) or {}

  raw_animal_types = payload.get("animalTypes") or []
  raw_other_rescues = payload.get("otherRescues") or []
  raw_clinics = payload.get("clinics") or []

  # Basic validation – require at least one animal type, like the new UI
  animal_types = [str(a).strip() for a in raw_animal_types if str(a).strip()]
  other_rescues = [str(r).strip() for r in raw_other_rescues if str(r).strip()]
  clinics = [str(c).strip() for c in raw_clinics if str(c).strip()]

  if not animal_types:
      return (
          jsonify(
              {
                  "success": False,
                  "statusCode": 400,
                  "message": "Animal Type(s) required.",
              }
          ),
          400,
      )

  jwt_data = get_jwt()
  user_id = get_jwt_identity()          
  username = jwt_data.get("username")    

  if not user_id:
      return (
          jsonify(
              {
                  "success": False,
                  "statusCode": 401,
                  "message": "Unauthorized.",
              }
          ),
          401,
      )

  user: User | None = User.query.get(user_id)
  if not user or not user.tenant_id:
      return (
          jsonify(
              {
                  "success": False,
                  "statusCode": 400,
                  "message": "User or tenant not found for onboarding.",
              }
          ),
          400,
      )

  tenant_id = user.tenant_id
  tenant: Tenant | None = Tenant.query.get(tenant_id)

  try:
      # --- Animal types + default behaviors / vaccinations / procedures ---
      for type_name in animal_types:
          # Check if this animal type already exists for the tenant
          existing = (
              AnimalType.query.filter(
                  db.func.lower(AnimalType.type_name) == type_name.lower(),
                  AnimalType.tenant_id == tenant_id,
                  AnimalType.is_deleted.is_(False),
              )
              .order_by(AnimalType.id.desc())
              .first()
          )

          if existing:
              animal_type = existing
          else:
              animal_type = AnimalType(
                  type_name=type_name,
                  tenant_id=tenant_id,
                  role_name="Administrator",
                  entered_by=username,
                  date_entered=datetime.utcnow(),
              )
              db.session.add(animal_type)
              db.session.flush()  # ensure animal_type.id is populated

          # Seed tenant-level behaviors / vaccinations / procedures from SA tables
          sa_animal_type = (
              SAAnimalType.query.filter(
                  db.func.lower(SAAnimalType.type_name) == type_name.lower(),
                  SAAnimalType.is_deleted.is_(False),
              )
              .order_by(SAAnimalType.id.desc())
              .first()
          )

          if sa_animal_type:
              # Behaviors
              sa_behaviors = SABehavior.query.filter(
                  SABehavior.sa_animal_type_id == sa_animal_type.id,
                  SABehavior.is_deleted.is_(False),
              ).all()
              for sa_behavior in sa_behaviors:
                  exists = Behavior.query.filter(
                      db.func.lower(Behavior.behavior_name)
                      == sa_behavior.behavior_name.lower(),
                      Behavior.animal_type_id == animal_type.id,
                      Behavior.tenant_id == tenant_id,
                      Behavior.is_deleted.is_(False),
                  ).first()
                  if not exists:
                      db.session.add(
                          Behavior(
                              animal_type_id=animal_type.id,
                              behavior_name=sa_behavior.behavior_name,
                              tenant_id=tenant_id,
                              entered_by=username,
                              date_entered=datetime.utcnow(),
                          )
                      )

              # Vaccination types
              sa_vacc_types = SAVaccinationType.query.filter(
                  SAVaccinationType.sa_animal_type_id == sa_animal_type.id,
                  SAVaccinationType.is_deleted.is_(False),
              ).all()
              for sa_vacc in sa_vacc_types:
                  exists = VaccinationType.query.filter(
                      db.func.lower(VaccinationType.kind) == sa_vacc.kind.lower(),
                      VaccinationType.animal_type_id == animal_type.id,
                      VaccinationType.tenant_id == tenant_id,
                      VaccinationType.is_deleted.is_(False),
                  ).first()
                  if not exists:
                      db.session.add(
                          VaccinationType(
                              animal_type_id=animal_type.id,
                              tenant_id=tenant_id,
                              kind=sa_vacc.kind,
                              entered_by=username,
                              date_entered=datetime.utcnow(),
                          )
                      )

              # Health procedures
              sa_procs = SAHealthProcedure.query.filter(
                  SAHealthProcedure.sa_animal_type_id == sa_animal_type.id,
                  SAHealthProcedure.is_deleted.is_(False),
              ).all()
              for sa_proc in sa_procs:
                  exists = HealthProcedure.query.filter(
                      db.func.lower(HealthProcedure.kind) == sa_proc.kind.lower(),
                      HealthProcedure.animal_type_id == animal_type.id,
                      HealthProcedure.tenant_id == tenant_id,
                      HealthProcedure.is_deleted.is_(False),
                  ).first()
                  if not exists:
                      db.session.add(
                          HealthProcedure(
                              animal_type_id=animal_type.id,
                              tenant_id=tenant_id,
                              kind=sa_proc.kind,
                              entered_by=username,
                              date_entered=datetime.utcnow(),
                          )
                      )

      # --- Other rescues (PCOs marked as Rescue) ---
      for name in other_rescues:
          if not name:
              continue

          pco = PCO(
              first_name="",
              last_name=name,
              street="",
              city="",
              state="",
              zip="",
              phone="",
              other_phone="",
              email="",
              website="",
              rescue=True,
              hospital=False,
              mail_list=True,
              notes="",
              entity_type="Company_Organisation",
              flag=False,
              flag_reason="",
              country_id=tenant.country_id if tenant else 0,
              tenant_id=tenant_id,
              entered_by=username,
              date_entered=datetime.utcnow(),
          )
          db.session.add(pco)

      # --- Clinics / hospitals (PCOs marked as Hospital) ---
      for name in clinics:
          if not name:
              continue

          pco = PCO(
              first_name="",
              last_name=name,
              street="",
              city="",
              state="",
              zip="",
              phone="",
              other_phone="",
              email="",
              website="",
              rescue=False,
              hospital=True,
              mail_list=True,
              notes="",
              entity_type="Company_Organisation",
              flag=False,
              flag_reason="",
              country_id=tenant.country_id if tenant else 0,
              tenant_id=tenant_id,
              entered_by=username,
              date_entered=datetime.utcnow(),
          )
          db.session.add(pco)

      db.session.commit()

  except Exception as exc:  # pragma: no cover - defensive
      db.session.rollback()
      return (
          jsonify(
              {
                  "success": False,
                  "statusCode": 500,
                  "message": f"Failed to save onboarding data: {exc}",
              }
          ),
          500,
      )

  return jsonify(
      {
          "success": True,
          "statusCode": 200,
          "message": "Onboarding added",
      }
  )


