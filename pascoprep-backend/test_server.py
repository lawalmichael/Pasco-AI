from fastapi import FastAPI
import httpx

app = FastAPI()

@app.get("/ping")
async def ping():
    async with httpx.AsyncClient() as client:
        r = await client.get("https://api.github.com")
    return {"status": r.status_code}
