from flask import Flask

from .animals import animals_bp
from .pcos import pcos_bp
from .donations import donations_bp
from .auth import auth_bp
from .otp import otp_bp


def register_blueprints(app: Flask) -> None:
    app.register_blueprint(auth_bp, url_prefix="/api/authenticate")
    app.register_blueprint(otp_bp, url_prefix="/api/otp")
    app.register_blueprint(animals_bp, url_prefix="/api/animal")
    app.register_blueprint(pcos_bp, url_prefix="/api/pco")
    app.register_blueprint(donations_bp, url_prefix="/api/donation")


