# This lets us describe exactly what information is involved in a practice session
from pydantic import BaseModel

# Optional lets a piece of information be left empty if it's not needed
from typing import Optional

# This describes what a student must send us when starting a new practice session
class StartSessionRequest(BaseModel):
    subject: str                       # which subject they're practicing, e.g. "Mathematics" - must always be filled in
    topic_filter: Optional[str] = None # optionally narrow to one topic, e.g. "Quadratic Equations"

# This describes what we send back right after a session starts
class SessionResponse(BaseModel):
    id: str                             # the new session's unique ID
    user_id: str                        # which student this belongs to
    subject: str                        # which subject this session covers
    topic_filter: Optional[str] = None  # which topic, if one was chosen
    score: int                          # how many questions answered correctly so far
    total_questions: int                # how many questions answered so far in total
    completed: bool                     # whether this session has been marked finished

# This describes what a student can send when finishing a session
class FinishSessionRequest(BaseModel):
    time_taken: Optional[int] = None    # how many seconds the session took, if the app is tracking that