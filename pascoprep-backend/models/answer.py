# This lets us describe exactly what information must be sent when a student submits an answer
from pydantic import BaseModel

# Optional lets a piece of information be left empty if it's not needed
from typing import Optional

# This describes what a student must send us when they answer a practice question
# Notice there's no user_id here anymore - that now comes securely from their login token instead
class SubmitAnswerRequest(BaseModel):
    question_id: str                    # which question they're answering - must always be filled in
    selected_answer: str                # which option they picked, e.g. "B" - must always be filled in
    session_id: Optional[str] = None    # which practice session this belongs to - optional for now

# This describes what we send back after checking the student's answer
class SubmitAnswerResponse(BaseModel):
    question_id: str        # which question was answered
    selected_answer: str    # what the student picked
    correct_answer: str     # what the actually correct answer is
    is_correct: bool        # whether the student got it right