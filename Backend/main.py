from fastapi import FastAPI, Request
from fastapi.responses import Response
from config import get_settings
from routes import auth, tracking, analytics
import re

settings = get_settings()

app = FastAPI(
    title="Self Action Analytics Dashboard API",
    description="Backend API for product analytics dashboard",
    version="1.0.0"
)

ALLOWED_ORIGIN_REGEX = re.compile(r"https://.*\.vercel\.app|http://localhost:5173")

@app.middleware("http")
async def cors_handler(request: Request, call_next):
    origin = request.headers.get("origin", "")

    if request.method == "OPTIONS":
        if ALLOWED_ORIGIN_REGEX.fullmatch(origin):
            return Response(
                status_code=200,
                headers={
                    "Access-Control-Allow-Origin": origin,
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
                    "Access-Control-Allow-Credentials": "true",
                    "Access-Control-Max-Age": "600",
                }
            )

    response = await call_next(request)

    if ALLOWED_ORIGIN_REGEX.fullmatch(origin):
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"

    return response

app.include_router(auth.router)
app.include_router(tracking.router)
app.include_router(analytics.router)


@app.get("/")
async def root():
    return {"message": "Self Action Tracking Analytics Dashboard API", "status": "running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
