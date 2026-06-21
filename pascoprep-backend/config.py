# This brings in a tool that reads our secret information from a hidden file called .env
from dotenv import load_dotenv

# This lets Python read information that's stored outside of our code, for safety
import os

# This actually runs the process of reading our hidden .env file
load_dotenv()

# Each line below grabs one secret value out of the .env file and saves it so the rest of our code can use it
# If any of these come back empty later, it usually means something is missing or misspelled in the .env file
SUPABASE_URL = os.getenv("SUPABASE_URL")              # the web address of our database
SUPABASE_KEY = os.getenv("SUPABASE_KEY")              # the password-like key that lets us connect to our database
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")    # the key that lets us use Claude, our AI tutor
PAYSTACK_SECRET_KEY = os.getenv("PAYSTACK_SECRET_KEY")  # the key for accepting payments (not set up yet)
JWT_SECRET = os.getenv("JWT_SECRET")                  # a secret code used later for keeping student logins secure