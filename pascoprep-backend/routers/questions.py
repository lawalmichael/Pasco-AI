# APIRouter lets us group related addresses together. HTTPException lets us send back a clear error message when something goes wrong
from fastapi import APIRouter, HTTPException

# JSONResponse lets us carefully build our own response and make sure it's sent correctly
# We added this specifically to fix a bug where answers were getting stuck and never arriving
from fastapi.responses import JSONResponse

# This safely lets our simple database functions work together with the faster style the rest of the app uses
from fastapi.concurrency import run_in_threadpool

# Optional lets a piece of information be skipped if nobody provides it
from typing import Optional

# This brings in the actual functions that talk to our database about questions
from services.question_service import get_questions, get_question_by_id, create_question, get_questions_for_user

# This brings in the rules for what information a brand new question must include
from models.question import QuestionCreate

# This creates a group of related addresses - main.py will attach the word /questions in front of everything here
router = APIRouter()

# This gets a list of questions, at the address /questions/
# It can optionally be narrowed down using a subject, topic, and/or country
@router.get("/")
async def list_questions(subject: Optional[str] = None, topic: Optional[str] = None, country: Optional[str] = None):
    questions = await run_in_threadpool(get_questions, subject=subject, topic=topic, country=country)

    # The "created_at" date comes back in a format we need to convert into plain text before sending it onward
    for q in questions:
        if "created_at" in q:
            q["created_at"] = str(q["created_at"])

    # Send back how many questions were found, plus the list of questions themselves
    return JSONResponse(content={"count": len(questions), "questions": questions})

# This gets all the questions that match ONE specific student's own country automatically
# at the address /questions/for-user/ followed by their ID
# IMPORTANT: this must be written ABOVE the next one below, otherwise our app would get confused
# and think the word "for-user" is actually meant to be a question's ID
@router.get("/for-user/{user_id}")
async def list_questions_for_user(user_id: str, subject: Optional[str] = None, topic: Optional[str] = None):
    questions = await run_in_threadpool(get_questions_for_user, user_id, subject=subject, topic=topic)

    # If no student was found with that ID, send back a clear "not found" message
    if questions is None:
        raise HTTPException(status_code=404, detail="User not found")

    # Convert the "created_at" date into plain text for every question found
    for q in questions:
        if "created_at" in q:
            q["created_at"] = str(q["created_at"])

    return JSONResponse(content={"count": len(questions), "questions": questions})

# This gets ONE specific question, at the address /questions/ followed by that question's ID
@router.get("/{question_id}")
async def get_question(question_id: str):
    question = await run_in_threadpool(get_question_by_id, question_id)

    # If no question was found with that ID, send back a clear "not found" message
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    if "created_at" in question:
        question["created_at"] = str(question["created_at"])

    return JSONResponse(content=question)

# This adds a brand new question into the database, at the address /questions/
@router.post("/")
async def add_question(question: QuestionCreate):
    # .dict() turns the question's information into a simple format the database understands
    new_question = await run_in_threadpool(create_question, question.dict())

    if "created_at" in new_question:
        new_question["created_at"] = str(new_question["created_at"])

    return JSONResponse(content=new_question)