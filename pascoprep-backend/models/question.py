from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class Question(BaseModel):
    id: Optional[UUID] = None
    subject: str
    topic: str
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_answer: str
    difficulty: Optional[str] = "Medium"
    exam_type: Optional[str] = "WAEC"
    country: Optional[str] = "Nigeria"
    created_at: Optional[datetime] = None

class QuestionCreate(BaseModel):
    subject: str
    topic: str
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_answer: str
    difficulty: Optional[str] = "Medium"
    exam_type: Optional[str] = "WAEC"
    country: str