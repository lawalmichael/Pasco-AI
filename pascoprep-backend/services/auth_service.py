# jwt lets us create and check signed tokens - a token is like a sealed, tamper-proof note
import jwt

# datetime lets us set an expiry time on tokens, so they don't work forever
from datetime import datetime, timedelta, timezone

# This brings in our secret signing key from config.py
from config import JWT_SECRET

# This is the scrambling method used to sign tokens - a standard, well-tested choice
ALGORITHM = "HS256"

# This creates a brand new signed token for a student who just logged in successfully
def create_access_token(user_id: str):
    # The token will stop working after 30 days, so a student doesn't stay logged in forever
    expire_time = datetime.now(timezone.utc) + timedelta(days=30)

    payload = {
        "sub": user_id,        # "sub" is short for "subject" - this is who the token belongs to
        "exp": expire_time      # "exp" is short for "expires" - when this token stops being valid
    }

    token = jwt.encode(payload, JWT_SECRET, algorithm=ALGORITHM)
    return token

# This checks a token, and if it's valid and not expired, gives back the user_id it belongs to
def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        return payload["sub"]
    except jwt.PyJWTError:
        # If the token is invalid, tampered with, or expired, this safely returns nothing
        return None