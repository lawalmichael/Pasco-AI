# create_client is the tool that connects us to our database. Client is just the "type" of that connection
from supabase import create_client, Client

# This brings in our saved database address and secret key from config.py
from config import SUPABASE_URL, SUPABASE_KEY

# This creates one single connection to our database that every function below will reuse
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# This looks up one student using their unique ID
def get_user_by_id(user_id: str):
    response = supabase.table("users").select("*").eq("id", user_id).execute()
    # If we found a matching student, send back their info - otherwise send back nothing (None)
    return response.data[0] if response.data else None

# This looks up one student using their email address - useful for checking if someone already has an account
def get_user_by_email(email: str):
    response = supabase.table("users").select("*").eq("email", email).execute()
    return response.data[0] if response.data else None

# This creates a brand new student account in the database
def create_user(user_data: dict):
    response = supabase.table("users").insert(user_data).execute()
    # Send back the new student's info, now including the ID the database just generated for them
    return response.data[0] if response.data else None

# This changes some information about an existing student, like updating their plan or chosen subjects
def update_user(user_id: str, updates: dict):
    response = supabase.table("users").update(updates).eq("id", user_id).execute()
    return response.data[0] if response.data else None