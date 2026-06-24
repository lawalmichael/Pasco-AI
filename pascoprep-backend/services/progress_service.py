# This connects us to our database
from supabase import create_client, Client

# This brings in our saved database address and secret key from config.py
from config import SUPABASE_URL, SUPABASE_SERVICE_KEY

# date and timedelta let us calculate "today", "7 days ago", and step through days one at a time
from datetime import date, timedelta, datetime, timezone

# This is a fixed +1 hour offset, matching West Africa Time (Nigeria, Ghana, Sierra Leone, Liberia, The Gambia)
WEST_AFRICA_OFFSET = timezone(timedelta(hours=1))

# This gives us "today" as it currently is in West Africa, regardless of what time zone the server itself is running in
def get_west_africa_today():
    return datetime.now(WEST_AFRICA_OFFSET).date()

# This creates one single connection to our database that every function below will reuse
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# This adds up every session's score and total_questions that happened on one specific day
def get_day_summary(user_id: str, target_date: date):
    # Supabase stores "date" as a full timestamp, so we search for anything starting with this day
    start_of_day = f"{target_date}T00:00:00"
    end_of_day = f"{target_date}T23:59:59"

    response = supabase.table("sessions") \
        .select("score, total_questions") \
        .eq("user_id", user_id) \
        .gte("date", start_of_day) \
        .lte("date", end_of_day) \
        .execute()

    sessions = response.data or []

    # Add up every session's numbers for that day - a student might practice more than once per day
    total_score = sum(s["score"] for s in sessions)
    total_questions = sum(s["total_questions"] for s in sessions)

    return {
        "date": str(target_date),
        "score": total_score,
        "total_questions": total_questions
    }

# This works out how many days in a row (counting backward from today) had at least one question answered
def calculate_streak(user_id: str):
    streak = 0
    current_day = get_west_africa_today()

    # Keep checking one day earlier at a time, as long as that day had activity
    while True:
        day_summary = get_day_summary(user_id, current_day)
        if day_summary["total_questions"] == 0:
            break
        streak += 1
        current_day = current_day - timedelta(days=1)

    return streak

# This builds the small, default progress view: today plus the last 7 days plus the current streak
def get_progress_summary(user_id: str):
    today = get_day_summary(user_id, get_west_africa_today())

    last_7_days = []
    for i in range(6, -1, -1):  # 6 days ago up to today, so the list reads oldest-to-newest
        day = get_west_africa_today() - timedelta(days=i)
        last_7_days.append(get_day_summary(user_id, day))

    streak = calculate_streak(user_id)

    return {
        "today": today,
        "last_7_days": last_7_days,
        "current_streak": streak
    }

# This builds the full monthly view - only called if the student explicitly asks for it
def get_monthly_progress(user_id: str, year: int, month: int):
    # Work out how many days are in the requested month
    if month == 12:
        next_month_first_day = date(year + 1, 1, 1)
    else:
        next_month_first_day = date(year, month + 1, 1)
    days_in_month = (next_month_first_day - date(year, month, 1)).days

    days = []
    total_score = 0
    total_questions = 0

    for day_number in range(1, days_in_month + 1):
        current_day = date(year, month, day_number)
        day_summary = get_day_summary(user_id, current_day)
        days.append(day_summary)
        total_score += day_summary["score"]
        total_questions += day_summary["total_questions"]

    return {
        "days": days,
        "total_score": total_score,
        "total_questions": total_questions
    }