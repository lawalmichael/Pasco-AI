# This connects us to our database
from supabase import create_client, Client

# This brings in our saved database address and secret key from config.py
from config import SUPABASE_URL, SUPABASE_KEY

# This creates one single connection to our database that every function below will reuse
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# This creates a brand new practice session, starting at zero
def start_session(user_id: str, subject: str, topic_filter: str = None):
    response = supabase.table("sessions").insert({
        "user_id": user_id,
        "subject": subject,
        "topic_filter": topic_filter,
        "score": 0,
        "total_questions": 0,
        "completed": False
    }).execute()
    return response.data[0] if response.data else None

# This looks up one session by its ID
def get_session_by_id(session_id: str):
    response = supabase.table("sessions").select("*").eq("id", session_id).execute()
    return response.data[0] if response.data else None

# This is called every time a student answers a question that belongs to a session
# It bumps total_questions up by one, and bumps score up by one only if the answer was correct
def update_session_progress(session_id: str, was_correct: bool):
    session = get_session_by_id(session_id)
    if not session:
        return None

    new_total = session["total_questions"] + 1
    new_score = session["score"] + (1 if was_correct else 0)

    response = supabase.table("sessions").update({
        "total_questions": new_total,
        "score": new_score
    }).eq("id", session_id).execute()

    return response.data[0] if response.data else None

# This marks a session as finished, optionally saving how long it took
def finish_session(session_id: str, time_taken: int = None):
    updates = {"completed": True}
    if time_taken is not None:
        updates["time_taken"] = time_taken

    response = supabase.table("sessions").update(updates).eq("id", session_id).execute()
    return response.data[0] if response.data else None