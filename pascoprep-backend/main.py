# This brings in the tool that lets us build a website that answers questions automatically (a "server")
from fastapi import FastAPI

# This brings in a tool that allows other apps and websites to be allowed to talk to our server
from fastapi.middleware.cors import CORSMiddleware

# This brings in our other files, where we wrote the actual instructions for signing up, getting questions, etc
from routers import auth, questions, ai, progress, answers, sessions

# This creates our actual server - think of this as turning on the engine
app = FastAPI(title="PascoPrep API", version="1.0.0")

# This turns on permission for other websites/apps to be allowed to send requests to our server
# Without this, a website trying to use our server from a browser would get blocked automatically
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # "*" means "allow every website" - okay for now while we're building and testing
    allow_credentials=True,    # allow login information to be sent along with requests
    allow_methods=["*"],       # allow every type of request (asking for info, sending new info, etc)
    allow_headers=["*"],       # allow any extra details to be sent along with a request
)

# Each line below connects one of our files to its own starting address
# For example: anything written inside auth.py will now start with the word /auth in its address
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(questions.router, prefix="/questions", tags=["Questions"])
app.include_router(ai.router, prefix="/ai", tags=["AI"])
app.include_router(progress.router, prefix="/progress", tags=["Progress"])
app.include_router(answers.router, prefix="/answers", tags=["Answers"])
app.include_router(sessions.router, prefix="/sessions", tags=["Sessions"])

# This is a simple test page - if you visit the homepage and see this message, your server is on and working
@app.get("/")
def root():
    return {"message": "PascoPrep API is running"}