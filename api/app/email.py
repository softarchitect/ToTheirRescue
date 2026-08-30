import logging
import os

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail


logger = logging.getLogger(__name__)


def _send(email: str, subject: str, text: str, purpose: str) -> bool:
    """Send a plain-text email via SendGrid.

    Configuration via environment variables:
      - SENDGRID_API_KEY: required
      - EMAIL_FROM: sender email (default: no-reply@example.com)
      - EMAIL_FROM_NAME: sender name (default: "To Their Rescue")
    """
    api_key = os.getenv("SENDGRID_API_KEY")
    if not api_key:
        logger.warning("SENDGRID_API_KEY not set; skipping %s email for %s", purpose, email)
        return False

    from_email = os.getenv("EMAIL_FROM", "no-reply@example.com")
    from_name = os.getenv("EMAIL_FROM_NAME", "To Their Rescue")

    message = Mail(
        from_email=(from_email, from_name),
        to_emails=email,
        subject=subject,
        plain_text_content=text,
    )

    try:
        sg = SendGridAPIClient(api_key)
        response = sg.send(message)
        logger.info("Sent %s email to %s (status %s)", purpose, email, response.status_code)
        return 200 <= response.status_code < 300
    except Exception as exc:  # noqa: BLE001
        logger.exception("Failed to send %s email to %s: %s", purpose, email, exc)
        return False


def _greeting(first_name: str | None) -> str:
    return f"Hi {first_name}," if first_name else "Hi,"


def send_verification_email(first_name: str | None, email: str, code: str) -> bool:
    """Send an email verification code using SendGrid."""
    text = (
        f"{_greeting(first_name)}\n\n"
        f"Your verification code is: {code}\n\n"
        "Enter this code in the To Their Rescue signup form to verify your email address.\n\n"
        "If you did not request this, you can safely ignore this email."
    )
    return _send(email, "Your To Their Rescue verification code", text, "verification")


def send_username_reminder_email(first_name: str | None, email: str, user_names: list[str]) -> bool:
    """Send the User ID(s) registered to an email address."""
    if len(user_names) == 1:
        body = f"Your User ID is: {user_names[0]}\n"
    else:
        listed = "\n".join(f"  - {name}" for name in user_names)
        body = f"These User IDs are registered to this email address:\n\n{listed}\n"

    text = (
        f"{_greeting(first_name)}\n\n"
        f"{body}\n"
        "You can sign in at any time using the link on the To Their Rescue login page.\n\n"
        "If you did not request this, you can safely ignore this email."
    )
    return _send(email, "Your To Their Rescue User ID", text, "username reminder")


def send_password_reset_email(
    first_name: str | None, email: str, reset_url: str, expiry_minutes: int
) -> bool:
    """Send a time-limited password reset link."""
    text = (
        f"{_greeting(first_name)}\n\n"
        "We received a request to reset your To Their Rescue password.\n\n"
        f"Use this link to choose a new password:\n{reset_url}\n\n"
        f"The link expires in {expiry_minutes} minutes and can only be used once.\n\n"
        "If you did not request this, you can safely ignore this email - "
        "your password will not change."
    )
    return _send(email, "Reset your To Their Rescue password", text, "password reset")


