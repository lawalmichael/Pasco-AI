# APIRouter lets us group related addresses together
from fastapi import APIRouter, Depends

# This safely lets our database calls work together with the faster style the rest of the app uses
from fastapi.concurrency import run_in_threadpool

# This brings in the rules for what each progress response looks like
from models.progress import ProgressSummary, MonthlyProgress

# This brings in the actual functions that calculate progress from saved sessions
from services.progress_service import get_progress_summary, get_monthly_progress

# datetime lets us default the monthly view to the current year/month if none is given
from datetime import date

# This brings in our reusable "who is this, really?" check
from dependencies import get_current_user_id

# This creates a group of related addresses - main.py will attach the word /progress in front of everything here
router = APIRouter()

# This is the small, default view - called automatically every time the home screen opens
# Notice there's no {user_id} in the address anymore - we always look up the CURRENT logged-in student,
# never whatever ID happens to be typed into the address bar
@router.get("/me")
async def get_progress(current_user_id: str = Depends(get_current_user_id)):
    summary = await run_in_threadpool(get_progress_summary, current_user_id)
    return summary

# This is the full monthly view - only called if the student explicitly asks to see it
@router.get("/me/monthly")
async def get_monthly(year: int = None, month: int = None, current_user_id: str = Depends(get_current_user_id)):
    today = date.today()
    target_year = year if year else today.year
    target_month = month if month else today.month

    monthly = await run_in_threadpool(get_monthly_progress, current_user_id, target_year, target_month)
    return monthly