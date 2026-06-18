from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool
from typing import Optional
from services.question_service import get_questions, get_question_by_id, create_question
from models.question import QuestionCreate

router = APIRouter()

@router.get("/")
async def list_questions(subject: Optional[str] = None, topic: Optional[str] = None, country: Optional[str] = None):
    questions = await run_in_threadpool(get_questions, subject=subject, topic=topic, country=country)
    return {"count": len(questions), "questions": questions}

@router.get("/{question_id}")
async def get_question(question_id: str):
    question = await run_in_threadpool(get_question_by_id, question_id)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question

@router.post("/")
async def add_question(question: QuestionCreate):
    new_question = await run_in_threadpool(create_question, question.dict())
    return new_question