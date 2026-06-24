# This lets us describe exactly what information a "user" (student) must contain
from pydantic import BaseModel, EmailStr

# EmailStr automatically checks that an email looks like a real email address

# Optional means a field can be empty/missing, List means it's a list of items
from typing import Optional, List

# UUID is the special ID format Supabase uses
from uuid import UUID

# datetime lets us work with dates/times
from datetime import datetime

# This describes a FULL user, exactly as it exists in the database
class User(BaseModel):
    id: Optional[UUID] = None                          # unique ID - filled in automatically by Supabase
    name: str                                          # student's name - required
    email: EmailStr                                    # student's email - required, must be valid format
    country: str                                       # student's country - required
    plan: Optional[str] = "free"                       # subscription plan - defaults to "free"
    subjects_selected: Optional[List[str]] = []        # list of subjects the student picked - defaults to empty list
    created_at: Optional[datetime] = None              # when account was created - filled in automatically
    # Note: password is NEVER included here - this model is what we send BACK to people,
    # and a password hash should never be sent back to anyone, ever

# This describes what's needed when SOMEONE IS SIGNING UP
class UserCreate(BaseModel):
    name: str                                          # required
    email: EmailStr                                    # required
    password: str                                      # required - the student's chosen password, in plain text for now
    country: str                                       # required
    subjects_selected: Optional[List[str]] = []        # optional, defaults to empty list

# This describes what's needed when an existing student logs in
class UserLogin(BaseModel):
    email: EmailStr                                    # required
    password: str                                      # required