from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from config import settings

from urllib.parse import quote_plus

db_url = settings.DATABASE_URL

# Auto-escape password if it contains special characters
parts = db_url.rsplit('@', 1)
if len(parts) == 2:
    creds, host_part = parts
    proto_split = creds.split('://', 1)
    if len(proto_split) == 2:
        proto, user_pass = proto_split
        up_split = user_pass.split(':', 1)
        if len(up_split) == 2:
            user, pwd = up_split
            from urllib.parse import unquote_plus
            # Only quote if not already quoted
            if quote_plus(unquote_plus(pwd)) != pwd:
                pwd = quote_plus(unquote_plus(pwd))
                db_url = f"{proto}://{user}:{pwd}@{host_part}"

# Modify the URL to use psycopg2 if it's just 'postgresql://' or 'postgres://'
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql+psycopg2://", 1)
elif db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+psycopg2://", 1)

engine = create_engine(db_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
