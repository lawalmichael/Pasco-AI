# HTTPException lets us send back a clear error. Depends lets us share this check across many routes.
from fastapi import HTTPException, Depends

# This is FastAPI's built-in tool for reading a token out of a request's Authorization header
from fastapi.security import OAuth2PasswordBearer

# This brings in our function for checking if a token is valid and getting the user_id out of it
from services.auth_service import decode_access_token

# This tells FastAPI where students would normally go to get a token (used for the /docs page's "Authorize" button)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Any route that includes this function as a dependency will require a valid token
# It automatically pulls the token out of the request, checks it, and returns the real user_id it belongs to
def get_current_user_id(token: str = Depends(oauth2_scheme)):
    user_id = decode_access_token(token)

    # If the token was missing, invalid, or expired, decode_access_token returns nothing (None)
    if user_id is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token - please log in again",
            headers={"WWW-Authenticate": "Bearer"}
        )

    return user_id
