from flask import Flask

from .animals import animals_bp
from .animal_milestones import animal_milestones_bp
from .animal_behaviors import animal_behaviors_bp
from .diary import diary_bp
from .artifact_attachments import artifact_attachments_bp
from .animal_vaccinations import animal_vaccinations_bp
from .animal_procedures import animal_procedures_bp
from .meds import meds_bp
from .soaps import soaps_bp
from .health_notes import health_notes_bp
from .health_history import health_history_bp
from .pcos import pcos_bp
from .donations import donations_bp
from .auth import auth_bp
from .otp import otp_bp
from .countries import countries_bp
from .onboarding import onboarding_bp
from .animal_types import animal_types_bp
from .acquisition_way import acquisition_way_bp
from .behaviors import behaviors_bp
from .health_procedures import health_procedures_bp
from .tenant import tenant_bp


def register_blueprints(app: Flask) -> None:
    app.register_blueprint(auth_bp, url_prefix="/api/authenticate")
    app.register_blueprint(otp_bp, url_prefix="/api/otp")
    app.register_blueprint(animals_bp, url_prefix="/api/animal")
    app.register_blueprint(animal_milestones_bp, url_prefix="/api/animal-milestone")
    app.register_blueprint(animal_behaviors_bp, url_prefix="/api/animal-behavior")
    app.register_blueprint(diary_bp, url_prefix="/api/diary")
    app.register_blueprint(artifact_attachments_bp, url_prefix="/api/artifact-attachment")
    app.register_blueprint(animal_vaccinations_bp, url_prefix="/api/animal-vaccination")
    app.register_blueprint(animal_procedures_bp, url_prefix="/api/animal-procedure")
    app.register_blueprint(meds_bp, url_prefix="/api/med")
    app.register_blueprint(soaps_bp, url_prefix="/api/soap")
    app.register_blueprint(health_notes_bp, url_prefix="/api/health-note")
    app.register_blueprint(health_history_bp, url_prefix="/api/health-history")
    app.register_blueprint(pcos_bp, url_prefix="/api/pco")
    app.register_blueprint(donations_bp, url_prefix="/api/donation")
    app.register_blueprint(countries_bp, url_prefix="/api/country")
    app.register_blueprint(onboarding_bp, url_prefix="/api/onboarding")
    app.register_blueprint(animal_types_bp, url_prefix="/api/animaltype")
    app.register_blueprint(acquisition_way_bp, url_prefix="/api/acquisition-way")
    app.register_blueprint(behaviors_bp, url_prefix="/api/animal-behavior")
    app.register_blueprint(health_procedures_bp, url_prefix="/api/health-procedure")
    app.register_blueprint(tenant_bp, url_prefix="/api/tenant")


