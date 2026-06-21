# APIRouter lets us group related addresses together. HTTPException lets us send back a clear error message when something goes wrong
from fastapi import APIRouter, HTTPException

# Our database functions (the ones that actually talk to Supabase) run in the regular, simple way Python normally works
# run_in_threadpool is the translator that safely lets these two styles work together without causing problems
from fastapi.concurrency import run_in_threadpool

# This brings in the actual functions that talk to our database about students
from services.user_service import get_user_by_id, get_user_by_email, create_user

# This brings in the rules for what information a new student signup must include
from models.user import UserCreate

# This creates a group of related addresses - main.py will attach the word /auth in front of everything here
router = APIRouter()

# This handles a new student signing up, at the address /auth/signup
@router.post("/signup")
async def signup(user: UserCreate):
    # "user" is the new student's info (name, email, country) - it already arrived checked and valid,
    # because UserCreate's rules (from models/user.py) were already applied automatically before this code even runs

    # Ask Supabase: "does anyone already have this email?" - and wait for the answer here,
    # without blocking other students whose requests might be happening at the very same moment
    existing = await run_in_threadpool(get_user_by_email, user.email)

    # existing will be a real student's info if found, or nothing (None) if no one has this email yet
    if existing:
        # Stop here and immediately send back a clear error - we never want two accounts sharing one email
        raise HTTPException(status_code=400, detail="An account with this email already exists")

    # No duplicate found, so create the new account
    # user.dict() turns the student's info into the plain format Supabase expects
    # again, wait here for Supabase to finish, without freezing anyone else's request
    new_user = await run_in_threadpool(create_user, user.dict())

    # Send the new student's saved info back to whoever asked (the signup page)
    return new_user

# This looks up one student's profile, at the address /auth/ followed by their ID
@router.get("/{user_id}")
async def get_profile(user_id: str):
    user = await run_in_threadpool(get_user_by_id, user_id)

    # If no student was found with that ID, send back a clear "not found" message
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user