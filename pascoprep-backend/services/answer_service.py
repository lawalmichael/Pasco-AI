# This connects us to our database
from supabase import create_client, Client

# This brings in our saved database address and secret key from config.py
from config import SUPABASE_URL, SUPABASE_SERVICE_KEY

# This brings in our existing function for looking up one question by its ID
from services.question_service import get_question_by_id

# This brings in our new function for updating a session's running score
from services.session_service import update_session_progress

# This creates one single connection to our database that every function below will reuse
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# This is the main function our router will call - it checks the student's answer and saves the result
def submit_answer(user_id: str, question_id: str, selected_answer: str, session_id: str = None):
    # First, look up the real question to find out what the correct answer actually is
    question = get_question_by_id(question_id)

    # If no question was found with that ID, signal that clearly by returning nothing (None)
    if not question:
        return None

    # Compare the student's pick against the real correct answer
    # .upper() makes sure "b" and "B" are both treated the same way
    is_correct = selected_answer.upper() == question["correct_answer"].upper()

    # Save this attempt into the answers table, so it can be used later for progress tracking
    supabase.table("answers").insert({
        "session_id": session_id,
        "user_id": user_id,
        "question_id": question_id,
        "selected_answer": selected_answer,
        "is_correct": is_correct,
        "explanation_viewed": False   # starts as False - becomes True later if the student asks the AI tutor about it
    }).execute()

    # If this answer belongs to a session, update that session's running score and question count
    if session_id:
        update_session_progress(session_id, is_correct)

    # Send back everything the student needs to see: what they picked, what was correct, and whether they got it right
    return {
        "question_id": question_id,
        "selected_answer": selected_answer,
        "correct_answer": question["correct_answer"],
        "is_correct": is_correct
    }