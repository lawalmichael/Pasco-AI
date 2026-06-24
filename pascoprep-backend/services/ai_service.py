# This connects us to our database
from supabase import create_client, Client

# This brings in our saved database address, secret key, and Claude's API key from config.py
from config import SUPABASE_URL, SUPABASE_SERVICE_KEY, ANTHROPIC_API_KEY

# This brings in the official tool for talking to Claude
import anthropic

# This brings in our existing function for looking up one question by its ID
from services.question_service import get_question_by_id

# This creates one single connection to our database that every function below will reuse
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# This creates one single connection to Claude that every function below will reuse
client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

# This checks our cache table to see if we already have a saved general explanation for this question
def get_cached_explanation(question_id: str):
    response = supabase.table("ai_explanations").select("*").eq("question_id", question_id).execute()
    # If we found a saved explanation, send it back - otherwise send back nothing (None)
    return response.data[0] if response.data else None

# This saves a brand new explanation into our cache table, so we never have to ask Claude the exact same thing twice
def save_explanation_to_cache(question_id: str, explanation: str):
    response = supabase.table("ai_explanations").insert({
        "question_id": question_id,
        "explanation_text": explanation   # the real column in Supabase is called "explanation_text", not "explanation"
    }).execute()
    return response.data[0] if response.data else None

# This builds the instructions we send to Claude, telling it exactly how to act as a WAEC tutor
def build_system_prompt():
    return (
        "You are a friendly, patient tutor helping a West African secondary school student "
        "prepare for the WAEC exam. Explain concepts clearly and simply, using plain language "
        "and short sentences. Avoid unnecessary jargon. When explaining why an answer is correct "
        "or incorrect, walk through the reasoning step by step."
    )

# This is the main function our router will call - it figures out whether to use the cache or ask Claude fresh
def get_ai_explanation(question_id: str, student_answer: str = None, user_message: str = None):
    # First, look up the actual question this is about
    question = get_question_by_id(question_id)
    if not question:
        return None, False  # None means "no question found", False means "not from cache"

    # If the student is asking a follow-up message, we always go fresh to Claude - no caching here,
    # since follow-up questions are different every time and there's nothing reusable to save
    if user_message:
        explanation = ask_claude_followup(question, student_answer, user_message)
        return explanation, False

    # Otherwise, this is a request for the general explanation - check our cache first
    cached = get_cached_explanation(question_id)
    if cached:
        # We already have this saved - reuse it, skip calling Claude entirely
        return cached["explanation_text"], True

    # No cached explanation yet - ask Claude for the first time
    explanation = ask_claude_general(question)

    # Save this new explanation so the next student who gets this same question wrong doesn't cost us another API call
    save_explanation_to_cache(question_id, explanation)

    return explanation, False

# This asks Claude for a general explanation of why the correct answer is correct
def ask_claude_general(question: dict):
    prompt = (
        f"Question: {question['question_text']}\n"
        f"A) {question['option_a']}\n"
        f"B) {question['option_b']}\n"
        f"C) {question['option_c']}\n"
        f"D) {question['option_d']}\n"
        f"The correct answer is {question['correct_answer']}.\n"
        f"Explain why this is the correct answer, in simple terms."
    )

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=500,
        system=build_system_prompt(),
        messages=[{"role": "user", "content": prompt}]
    )

    # Claude's actual reply text lives inside this structure - this line pulls it out
    return response.content[0].text

# This asks Claude a specific follow-up question from the student, with the original question as context
def ask_claude_followup(question: dict, student_answer: str, user_message: str):
    prompt = (
        f"Question: {question['question_text']}\n"
        f"A) {question['option_a']}\n"
        f"B) {question['option_b']}\n"
        f"C) {question['option_c']}\n"
        f"D) {question['option_d']}\n"
        f"The correct answer is {question['correct_answer']}.\n"
    )

    if student_answer:
        prompt += f"The student answered {student_answer}.\n"

    prompt += f"The student is now asking: {user_message}"

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=500,
        system=build_system_prompt(),
        messages=[{"role": "user", "content": prompt}]
    )

    return response.content[0].text