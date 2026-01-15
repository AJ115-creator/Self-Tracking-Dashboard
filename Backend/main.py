from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import get_settings
from routes import auth, tracking, analytics

settings = get_settings()

app = FastAPI(
    title="Self Action Analytics Dashboard API",
    description="Backend API for product analytics dashboard",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
