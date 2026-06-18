from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool
from services.user_service import get_user_by_id, get_user_by_email, create_user
from models.user import UserCreate

router = APIRouter()

@router.post("/signup")
async def signup(user: UserCreate):
    existing = await run_in_threadpool(get_user_by_email, user.email)
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists")
    new_user = await run_in_threadpool(create_user, user.dict())
    return new_user

@router.get("/{user_id}")
async def get_profile(user_id: str):
    user = await run_in_threadpool(get_user_by_id, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
