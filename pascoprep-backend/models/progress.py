# This lets us describe exactly what a progress response looks like
from pydantic import BaseModel

# List lets a field hold multiple items
from typing import List

# This describes one single day's worth of practice
class DaySummary(BaseModel):
    date: str               # the day, e.g. "2026-06-23"
    score: int               # how many questions answered correctly that day
    total_questions: int     # how many questions answered in total that day

# This describes the small, default progress view - today plus the last 7 days
class ProgressSummary(BaseModel):
    today: DaySummary                    # today's score so far
    last_7_days: List[DaySummary]        # one entry per day, oldest to newest
    current_streak: int                  # how many days in a row with at least one question answered

# This describes the full monthly view - only fetched if the student asks for it
class MonthlyProgress(BaseModel):
    days: List[DaySummary]               # one entry per day in the requested month
    total_score: int                     # total correct answers across the whole month
    total_questions: int                 # total questions answered across the whole month