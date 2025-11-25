import os
from flask import Flask
from flask_cors import CORS

from .config import Config
from .extensions import db, migrate, jwt
from .routes import register_blueprints


def create_app(config_class: type[Config] | None = None) -> Flask:
    app = Flask(__name__)

    # Configuration
    config_obj = config_class or Config()
    app.config.from_object(config_obj)

    # Extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Blueprints
    register_blueprints(app)

    @app.get("/health")
    def health_check():
        return {"status": "ok"}, 200

    return app


