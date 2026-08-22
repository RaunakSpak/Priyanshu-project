import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import settings
import logging

logger = logging.getLogger(__name__)

def send_reset_password_email(to_email: str, reset_link: str):
    """
    Sends a password reset email using the configured SMTP server.
    """
    # If SMTP is not configured, fall back to mock printing
    if not settings.SMTP_SERVER or not settings.SMTP_USERNAME:
        logger.warning("SMTP settings not configured. Mocking email.")
        print("\n" + "="*50)
        print("MOCK EMAIL SENT")
        print(f"To: {to_email}")
        print(f"Subject: Reset Your FitVision Password")
        print(f"Body: Click the link below to reset your password:\n{reset_link}")
        print("="*50 + "\n")
        return

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Reset Your FitVision Password"
    msg["From"] = settings.SMTP_SENDER_EMAIL or settings.SMTP_USERNAME
    msg["To"] = to_email

    # Create the body of the message
    text = f"""\
    Hi,
    
    You requested to reset your FitVision password.
    Please click the link below to reset it:
    
    {reset_link}
    
    If you did not request this, please ignore this email.
    """
    
    html = f"""\
    <html>
      <body>
        <p>Hi,</p>
        <p>You requested to reset your FitVision password.</p>
        <p><a href="{reset_link}">Click here to reset your password</a></p>
        <p>If you did not request this, please ignore this email.</p>
      </body>
    </html>
    """
    
    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")
    
    msg.attach(part1)
    msg.attach(part2)

    try:
        server = smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT)
        server.starttls()
        server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        server.sendmail(
            settings.SMTP_SENDER_EMAIL or settings.SMTP_USERNAME,
            to_email,
            msg.as_string()
        )
        server.quit()
        logger.info(f"Password reset email sent to {to_email}")
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}. Error: {e}")
        print(f"Failed to send email: {e}")
        print(f"Reset link was: {reset_link}")
