# APIRouter lets us group related addresses together. HTTPException lets us send back a clear error message
from fastapi import APIRouter, HTTPException

# run_in_threadpool lets us safely call our regular (non-async) Supabase functions from inside async routes
from fastapi.concurrency import run_in_threadpool

# This brings in the functions that actually talk to the database and check passwords
from services.user_service import get_user_by_id, get_user_by_email, create_user, authenticate_user

# This brings in our new function for creating a signed login token
from services.auth_service import create_access_token

# This brings in the shape/rules for what a new signup and a login attempt must look like
from models.user import UserCreate, UserLogin

# Create a router - main.py will attach this to the /auth address
router = APIRouter()

# Handles POST requests to /auth/signup - creates a new student account, then logs them in immediately
@router.post("/signup")
async def signup(user: UserCreate):
    # First check if someone already signed up with this email
    existing = await run_in_threadpool(get_user_by_email, user.email)

    # If they did, stop and send back a clear error instead of creating a duplicate
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists")

    # Otherwise, create the new user record in Supabase (password gets scrambled inside create_user)
    new_user = await run_in_threadpool(create_user, user.dict())

    # Immediately create a login token for this brand new student, so they don't have to log in separately
    token = create_access_token(new_user["id"])

    # Send back the new student's info, plus their token
    return {"user": new_user, "access_token": token, "token_type": "bearer"}

# Handles POST requests to /auth/login - checks email and password, hands back a token if correct
@router.post("/login")
async def login(credentials: UserLogin):
    user = await run_in_threadpool(authenticate_user, credentials.email, credentials.password)

    # If no match was found (wrong email or wrong password), send back a clear, generic error
    # We say "incorrect email or password" rather than specifying which one was wrong, so we
    # don't accidentally help someone guess which emails are registered
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    token = create_access_token(user["id"])

    return {"user": user, "access_token": token, "token_type": "bearer"}

# Handles GET requests to /auth/{user_id} - this looks up one student's profile
@router.get("/{user_id}")
async def get_profile(user_id: str):
    user = await run_in_threadpool(get_user_by_id, user_id)

    # If no user was found with that ID, send back a clear 404 error
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user