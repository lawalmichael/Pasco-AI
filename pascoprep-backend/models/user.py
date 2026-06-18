from pydantic import BaseModel, EmailStr
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class User(BaseModel):
    id: Optional[UUID] = None
    name: str
    email: EmailStr
    country: Optional[str] = None
    plan: Optional[str] = "free"
    subjects_selected: Optional[List[str]] = []
    created_at: Optional[datetime] = None

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    country: str
    subjects_selected: Optional[List[str]] = []