from app import create_app

# WSGI entrypoint for production (gunicorn).
app = create_app()

