# APIRouter lets us group related addresses together. HTTPException lets us send back a clear error message
from fastapi import APIRouter, HTTPException, Depends

# This safely lets our database calls work together with the faster style the rest of the app uses
from fastapi.concurrency import run_in_threadpool

# This brings in the rules for starting and finishing a session
from models.session import StartSessionRequest, SessionResponse, FinishSessionRequest

# This brings in the actual functions that create and update sessions
from services.session_service import start_session, get_session_by_id, finish_session

# This brings in our reusable "who is this, really?" check
from dependencies import get_current_user_id

# This creates a group of related addresses - main.py will attach the word /sessions in front of everything here
router = APIRouter()

# This handles starting a new session, at the address /sessions/start
# current_user_id comes from the student's verified token, never from anything typed in the request
@router.post("/start", response_model=SessionResponse)
async def start(request: StartSessionRequest, current_user_id: str = Depends(get_current_user_id)):
    session = await run_in_threadpool(
        start_session, current_user_id, request.subject, request.topic_filter
    )
    return session

# This looks up one session, at the address /sessions/ followed by its ID
@router.get("/{session_id}", response_model=SessionResponse)
async def get_session(session_id: str, current_user_id: str = Depends(get_current_user_id)):
    session = await run_in_threadpool(get_session_by_id, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Make sure this session actually belongs to the student asking for it
    if session["user_id"] != current_user_id:
        raise HTTPException(status_code=403, detail="This session does not belong to you")

    return session

# This marks a session as finished, at the address /sessions/ followed by its ID, then /finish
@router.post("/{session_id}/finish", response_model=SessionResponse)
async def finish(session_id: str, request: FinishSessionRequest, current_user_id: str = Depends(get_current_user_id)):
    session = await run_in_threadpool(get_session_by_id, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if session["user_id"] != current_user_id:
        raise HTTPException(status_code=403, detail="This session does not belong to you")

    updated = await run_in_threadpool(finish_session, session_id, request.time_taken)
    return updated