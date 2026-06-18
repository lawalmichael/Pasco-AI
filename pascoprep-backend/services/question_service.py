from supabase import create_client, Client
from config import SUPABASE_URL, SUPABASE_KEY

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_questions(subject: str = None, topic: str = None, country: str = None):
    query = supabase.table("questions").select("*")
    if subject:
        query = query.eq("subject", subject)
    if topic:
        query = query.eq("topic", topic)
    if country:
        query = query.eq("country", country)
    response = query.execute()
    return response.data

def get_question_by_id(question_id: str):
    response = supabase.table("questions").select("*").eq("id", question_id).execute()
    return response.data[0] if response.data else None

def create_question(question_data: dict):
    response = supabase.table("questions").insert(question_data).execute()
    return response.data[0] if response.data else None