# APIRouter lets us group related addresses together
from fastapi import APIRouter

# This safely lets our database calls work together with the faster style the rest of the app uses
from fastapi.concurrency import run_in_threadpool

# This brings in the rules for what each progress response looks like
from models.progress import ProgressSummary, MonthlyProgress

# This brings in the actual functions that calculate progress from saved sessions
from services.progress_service import get_progress_summary, get_monthly_progress

# datetime lets us default the monthly view to the current year/month if none is given
from datetime import date

# This creates a group of related addresses - main.py will attach the word /progress in front of everything here
router = APIRouter()

# This is the small, default view - called automatically every time the home screen opens
@router.get("/{user_id}", response_model=ProgressSummary)
async def get_progress(user_id: str):
    summary = await run_in_threadpool(get_progress_summary, user_id)
    return summary

# This is the full monthly view - only called if the student explicitly asks to see it
# year and month are optional - if not given, defaults to the current month
@router.get("/{user_id}/monthly", response_model=MonthlyProgress)
async def get_monthly(user_id: str, year: int = None, month: int = None):
    today = date.today()
    target_year = year if year else today.year
    target_month = month if month else today.month

    monthly = await run_in_threadpool(get_monthly_progress, user_id, target_year, target_month)
    return monthly