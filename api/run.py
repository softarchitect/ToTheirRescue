import os

from app import create_app

app = create_app()

if __name__ == "__main__":
    # Local development convenience runner.
    # Never run the Werkzeug debugger on a public interface.
    debug = os.getenv("FLASK_DEBUG", "0") == "1"
    host = os.getenv("FLASK_RUN_HOST", "127.0.0.1")
    port = int(os.getenv("FLASK_RUN_PORT", "5000"))
    app.run(host=host, port=port, debug=debug)


