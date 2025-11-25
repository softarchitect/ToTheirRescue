import logging
import os

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail


logger = logging.getLogger(__name__)


def send_verification_email(first_name: str | None, email: str, code: str) -> bool:
    """Send an email verification code using SendGrid.

    Configuration via environment variables:
      - SENDGRID_API_KEY: required
      - EMAIL_FROM: sender email (default: no-reply@example.com)
      - EMAIL_FROM_NAME: sender name (default: "To Their Rescue")
    """
    api_key = os.getenv("SENDGRID_API_KEY")
    if not api_key:
        logger.warning("SENDGRID_API_KEY not set; skipping email send for %s", email)
        return False

    from_email = os.getenv("EMAIL_FROM", "no-reply@example.com")
    from_name = os.getenv("EMAIL_FROM_NAME", "To Their Rescue")

    subject = "Your To Their Rescue verification code"
    greeting = f"Hi {first_name}," if first_name else "Hi,"
    text = (
        f"{greeting}\n\n"
        f"Your verification code is: {code}\n\n"
        "Enter this code in the To Their Rescue signup form to verify your email address.\n\n"
        "If you did not request this, you can safely ignore this email."
    )

    message = Mail(
        from_email=(from_email, from_name),
        to_emails=email,
        subject=subject,
        plain_text_content=text,
    )

    try:
        sg = SendGridAPIClient(api_key)
        response = sg.send(message)
        logger.info("Sent verification email to %s (status %s)", email, response.status_code)
        return 200 <= response.status_code < 300
    except Exception as exc:  # noqa: BLE001
        logger.exception("Failed to send verification email to %s: %s", email, exc)
        return False


