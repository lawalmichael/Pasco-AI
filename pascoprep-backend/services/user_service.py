from supabase import create_client, Client
from config import SUPABASE_URL, SUPABASE_KEY

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_user_by_id(user_id: str):
    response = supabase.table("users").select("*").eq("id", user_id).execute()
    return response.data[0] if response.data else None

def get_user_by_email(email: str):
    response = supabase.table("users").select("*").eq("email", email).execute()
    return response.data[0] if response.data else None

def create_user(user_data: dict):
    response = supabase.table("users").insert(user_data).execute()
    return response.data[0] if response.data else None

def update_user(user_id: str, updates: dict):
    response = supabase.table("users").update(updates).eq("id", user_id).execute()
    return response.data[0] if response.data else None
