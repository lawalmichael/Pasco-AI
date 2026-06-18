from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import auth, questions, ai, progress

app = FastAPI(title="PascoPrep API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(questions.router, prefix="/questions", tags=["Questions"])
app.include_router(ai.router, prefix="/ai", tags=["AI"])
app.include_router(progress.router, prefix="/progress", tags=["Progress"])

@app.get("/test-supabase")
def test_supabase():
    from supabase import create_client
    from config import SUPABASE_URL, SUPABASE_KEY
    sb = create_client(SUPABASE_URL, SUPABASE_KEY)
    response = sb.table("questions").select("*").limit(1).execute()
    return {"data": response.data}

@app.get("/")
def root():
    return {"message": "PascoPrep API is running"}