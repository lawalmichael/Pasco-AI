# This connects us to our database
from supabase import create_client, Client

# This brings in our saved database address and secret key from config.py
from config import SUPABASE_URL, SUPABASE_SERVICE_KEY

# CryptContext is the tool that scrambles passwords into something unreadable, and checks them later
from passlib.context import CryptContext

# This creates one single connection to our database that every function below will reuse
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# This sets up our password-scrambling tool, using a well-tested scrambling method called bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# This turns a plain, readable password into a scrambled version that's safe to store
def hash_password(plain_password: str):
    return pwd_context.hash(plain_password)

# This checks whether a plain password matches a previously-scrambled one, without ever un-scrambling it
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

# Find a user by their unique ID
def get_user_by_id(user_id: str):
    response = supabase.table("users").select("*").eq("id", user_id).execute()
    return response.data[0] if response.data else None

# Find a user by their email address (used to check for duplicate signups, and for login)
def get_user_by_email(email: str):
    response = supabase.table("users").select("*").eq("email", email).execute()
    return response.data[0] if response.data else None

# Create a brand new user/student account - scrambles the password before saving it
def create_user(user_data: dict):
    # Take the plain password out, scramble it, and put the scrambled version back in under a new name
    plain_password = user_data.pop("password")
    user_data["password_hash"] = hash_password(plain_password)

    response = supabase.table("users").insert(user_data).execute()
    return response.data[0] if response.data else None

# Update an existing user's info (e.g. changing their plan or subjects)
def update_user(user_id: str, updates: dict):
    response = supabase.table("users").update(updates).eq("id", user_id).execute()
    return response.data[0] if response.data else None

# This checks a login attempt: looks up the email, then checks if the password matches
def authenticate_user(email: str, password: str):
    user = get_user_by_email(email)
    if not user:
        return None
    if not verify_password(password, user["password_hash"]):
        return None
    return user