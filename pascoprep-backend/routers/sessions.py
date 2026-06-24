# APIRouter lets us group related addresses together. HTTPException lets us send back a clear error message
from fastapi import APIRouter, HTTPException

# This safely lets our database calls work together with the faster style the rest of the app uses
from fastapi.concurrency import run_in_threadpool

# This brings in the rules for starting and finishing a session
from models.session import StartSessionRequest, SessionResponse, FinishSessionRequest

# This brings in the actual functions that create and update sessions
from services.session_service import start_session, get_session_by_id, finish_session

# This creates a group of related addresses - main.py will attach the word /sessions in front of everything here
router = APIRouter()

# This handles starting a new session, at the address /sessions/start
@router.post("/start", response_model=SessionResponse)
async def start(request: StartSessionRequest):
    session = await run_in_threadpool(
        start_session, request.user_id, request.subject, request.topic_filter
    )
    return session

# This looks up one session, at the address /sessions/ followed by its ID
@router.get("/{session_id}", response_model=SessionResponse)
async def get_session(session_id: str):
    session = await run_in_threadpool(get_session_by_id, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

# This marks a session as finished, at the address /sessions/ followed by its ID, then /finish
@router.post("/{session_id}/finish", response_model=SessionResponse)
async def finish(session_id: str, request: FinishSessionRequest):
    session = await run_in_threadpool(finish_session, session_id, request.time_taken)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session