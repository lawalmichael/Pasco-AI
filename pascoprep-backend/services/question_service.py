# create_client is the tool that connects us to our database. Client is just the "type" of that connection
from supabase import create_client, Client

# This brings in our saved database address and secret key from config.py
from config import SUPABASE_URL, SUPABASE_SERVICE_KEY

# This creates one single connection to our database that every function below will reuse
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# This gets a list of questions, and can optionally narrow the list down by subject, topic, or country
# Writing subject: str = None means "if nobody tells us a subject, just skip that filter"
def get_questions(subject: str = None, topic: str = None, country: str = None):
    # Start by asking for everything in the "questions" table
    query = supabase.table("questions").select("*")

    # Only add a filter if that piece of information was actually provided
    if subject:
        query = query.eq("subject", subject)
    if topic:
        query = query.eq("topic", topic)
    if country:
        query = query.eq("country", country)

    # Now actually send the request to the database and wait for the answer
    response = query.execute()

    # .data is where the actual list of matching questions lives
    return response.data

# This gets ONE specific question, found using its unique ID
def get_question_by_id(question_id: str):
    response = supabase.table("questions").select("*").eq("id", question_id).execute()
    # If we found a match, send back that one question - otherwise send back nothing (None)
    return response.data[0] if response.data else None

# This adds a brand new question into the database
def create_question(question_data: dict):
    response = supabase.table("questions").insert(question_data).execute()
    # Send back the new question, now including the ID the database just generated for it
    return response.data[0] if response.data else None

# This gets questions for ONE SPECIFIC STUDENT, automatically matching their own country
# This is what makes sure a Nigerian student only ever sees Nigerian WAEC questions, and so on
def get_questions_for_user(user_id: str, subject: str = None, topic: str = None):
    # We bring this in here, instead of at the very top of the file, to avoid a mix-up where
    # this file and user_service.py end up needing each other at the exact same time
    from services.user_service import get_user_by_id

    # First, look up this student's profile to find out which country they're in
    user = get_user_by_id(user_id)

    # If no such student exists at all, clearly signal that by sending back nothing (None)
    if not user:
        return None

    # Now get questions, but force it to only show questions matching this student's own country
    return get_questions(subject=subject, topic=topic, country=user["country"])