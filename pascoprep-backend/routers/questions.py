from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from fastapi.concurrency import run_in_threadpool
from typing import Optional
from services.question_service import get_questions, get_question_by_id, create_question, get_questions_for_user
from models.question import QuestionCreate

router = APIRouter()

@router.get("/")
async def list_questions(subject: Optional[str] = None, topic: Optional[str] = None, country: Optional[str] = None):
    questions = await run_in_threadpool(get_questions, subject=subject, topic=topic, country=country)
    for q in questions:
        if "created_at" in q:
            q["created_at"] = str(q["created_at"])
    return JSONResponse(content={"count": len(questions), "questions": questions})

@router.get("/for-user/{user_id}")
async def list_questions_for_user(user_id: str, subject: Optional[str] = None, topic: Optional[str] = None):
    questions = await run_in_threadpool(get_questions_for_user, user_id, subject=subject, topic=topic)
    if questions is None:
        raise HTTPException(status_code=404, detail="User not found")
    for q in questions:
        if "created_at" in q:
            q["created_at"] = str(q["created_at"])
    return JSONResponse(content={"count": len(questions), "questions": questions})

@router.get("/{question_id}")
async def get_question(question_id: str):
    question = await run_in_threadpool(get_question_by_id, question_id)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    if "created_at" in question:
        question["created_at"] = str(question["created_at"])
    return JSONResponse(content=question)

@router.post("/")
async def add_question(question: QuestionCreate):
    new_question = await run_in_threadpool(create_question, question.dict())
    if "created_at" in new_question:
        new_question["created_at"] = str(new_question["created_at"])
    return JSONResponse(content=new_question)