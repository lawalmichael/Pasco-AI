# This lets us describe exactly what information a "question" must contain
from pydantic import BaseModel

# This lets certain pieces of information be allowed to be left empty
from typing import Optional

# This is a special type of ID format that our database uses to give each question a unique identity
from uuid import UUID

# This lets us work with dates and times, like recording when a question was added
from datetime import datetime

# This describes what a COMPLETE question looks like, exactly as it's stored in our database
class Question(BaseModel):
    id: Optional[UUID] = None              # the question's unique ID - left empty here because the database creates this automatically
    subject: str                           # example: "Mathematics" - must always be filled in
    topic: str                             # example: "Quadratic Equations" - must always be filled in
    question_text: str                     # the actual question being asked - must always be filled in
    option_a: str                          # the first multiple choice answer - must always be filled in
    option_b: str                          # the second multiple choice answer - must always be filled in
    option_c: str                          # the third multiple choice answer - must always be filled in
    option_d: str                          # the fourth multiple choice answer - must always be filled in
    correct_answer: str                    # which option is correct, written as "A", "B", "C" or "D"
    difficulty: Optional[str] = "Medium"   # how hard the question is - if not given, we assume "Medium"
    exam_type: Optional[str] = "WAEC"      # which exam this came from - if not given, we assume "WAEC"
    country: Optional[str] = "Nigeria"     # which country this question belongs to
    created_at: Optional[datetime] = None  # when this question was added - the database fills this in automatically

# This describes what information someone must give us when ADDING a brand new question
# Notice there's no "id" or "created_at" here - those two get created automatically by the database, we never type them ourselves
class QuestionCreate(BaseModel):
    subject: str                           # must always be filled in
    topic: str                             # must always be filled in
    question_text: str                     # must always be filled in
    option_a: str                          # must always be filled in
    option_b: str                          # must always be filled in
    option_c: str                          # must always be filled in
    option_d: str                          # must always be filled in
    correct_answer: str                    # must always be filled in
    difficulty: Optional[str] = "Medium"   # if not given, we assume "Medium"
    exam_type: Optional[str] = "WAEC"      # if not given, we assume "WAEC"
    country: str                           # must always be filled in - we never want a question with no country attached