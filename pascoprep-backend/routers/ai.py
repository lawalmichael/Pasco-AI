# APIRouter lets us group related addresses together. HTTPException lets us send back a clear error message
from fastapi import APIRouter, HTTPException

# This safely lets our database/Claude calls work together with the faster style the rest of the app uses
from fastapi.concurrency import run_in_threadpool

# This brings in the rules for what a request to the AI tutor must look like, and what we send back
from models.ai import AskAIRequest, AskAIResponse

# This brings in the actual function that decides whether to use the cache or ask Claude fresh
from services.ai_service import get_ai_explanation

# This creates a group of related addresses - main.py will attach the word /ai in front of everything here
router = APIRouter()

# This handles a student asking the AI tutor for help, at the address /ai/ask
@router.post("/ask", response_model=AskAIResponse)
async def ask_ai(request: AskAIRequest):
    # Hand this off to our service function, and wait here for the answer,
    # without freezing the server for other students in the meantime
    explanation, was_cached = await run_in_threadpool(
        get_ai_explanation,
        request.question_id,
        request.student_answer,
        request.user_message
    )

    # If no question was found with that ID, send back a clear "not found" message
    if explanation is None:
        raise HTTPException(status_code=404, detail="Question not found")

    return AskAIResponse(
        question_id=request.question_id,
        explanation=explanation,
        cached=was_cached
    )