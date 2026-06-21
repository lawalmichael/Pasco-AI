# This lets us describe exactly what information a request to the AI tutor must contain
from pydantic import BaseModel

# Optional lets a piece of information be left empty if the student doesn't provide it
from typing import Optional

# This describes what a student must send us when asking the AI tutor for help
class AskAIRequest(BaseModel):
    question_id: str                       # which exam question they need help with - must always be filled in
    student_answer: Optional[str] = None   # the answer the student picked, e.g. "B" - optional, since they might just be asking a follow-up
    user_message: Optional[str] = None     # a free-text question from the student, e.g. "why is option B wrong?" - optional

# This describes what we send back to the student after the AI tutor responds
class AskAIResponse(BaseModel):
    question_id: str       # which question this explanation is about
    explanation: str       # the AI's explanation/answer, in plain text
    cached: bool           # true if this came from our saved cache, false if we just asked Claude fresh