# APIRouter lets us group related addresses together. HTTPException lets us send back a clear error message
from fastapi import APIRouter, HTTPException

# This safely lets our database calls work together with the faster style the rest of the app uses
from fastapi.concurrency import run_in_threadpool

# This brings in the rules for what a student's submitted answer must look like, and what we send back
from models.answer import SubmitAnswerRequest, SubmitAnswerResponse

# This brings in the actual function that checks the answer and saves it
from services.answer_service import submit_answer

# This creates a group of related addresses - main.py will attach the word /answers in front of everything here
router = APIRouter()

# This handles a student submitting an answer, at the address /answers/submit
@router.post("/submit", response_model=SubmitAnswerResponse)
async def submit(request: SubmitAnswerRequest):
    result = await run_in_threadpool(
        submit_answer,
        request.user_id,
        request.question_id,
        request.selected_answer,
        request.session_id
    )

    # If no question was found with that ID, send back a clear "not found" message
    if result is None:
        raise HTTPException(status_code=404, detail="Question not found")

    return result