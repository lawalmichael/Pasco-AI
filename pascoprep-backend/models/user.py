# This lets us describe exactly what information a "user" (student) must contain
from pydantic import BaseModel, EmailStr

# EmailStr automatically double-checks that an email address is actually written in a valid email format

# This lets certain pieces of information be left empty, and lets a piece of information be a list of items
from typing import Optional, List

# This is a special type of ID format our database uses to give each student a unique identity
from uuid import UUID

# This lets us work with dates and times, like recording when a student signed up
from datetime import datetime

# This describes a COMPLETE student, exactly as stored in our database
class User(BaseModel):
    id: Optional[UUID] = None                      # the student's unique ID - the database fills this in automatically
    name: str                                      # the student's full name - must always be filled in
    email: EmailStr                                # the student's email - must always be filled in, and must look like a real email
    country: str                                   # the student's country - must always be filled in
    plan: Optional[str] = "free"                   # which subscription plan they're on - if not given, we assume "free"
    subjects_selected: Optional[List[str]] = []   # the list of subjects they picked - if not given, we start with an empty list
    created_at: Optional[datetime] = None         # when the account was created - the database fills this in automatically

# This describes what information someone must give us when a NEW student signs up
class UserCreate(BaseModel):
    name: str                                      # must always be filled in
    email: EmailStr                                # must always be filled in
    country: str                                   # must always be filled in
    subjects_selected: Optional[List[str]] = []   # if not given, we start with an empty list