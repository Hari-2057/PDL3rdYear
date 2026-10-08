import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database.session import engine, Base
from app.database.seed import seed_database
from app.api import (
    auth, invoices, reviews, purchase_orders, vendors,
    policies, analytics, audit_logs, notifications, demo
)

# Initialize database schemas
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="AI-Powered Multi-Agent Invoice & Expense Exception Handling Platform"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow local React frontend dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static Uploads directory mount
uploads_dir = "/tmp/uploads" if os.environ.get("VERCEL") else "./uploads"
os.makedirs(os.path.join(uploads_dir, "invoices"), exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# Mount API Routers
app.include_router(auth.router)
app.include_router(invoices.router)
app.include_router(reviews.router)
app.include_router(purchase_orders.router)
app.include_router(vendors.router)
app.include_router(policies.router)
app.include_router(analytics.router)
app.include_router(audit_logs.router)
app.include_router(notifications.router)
app.include_router(demo.router)

@app.on_event("startup")
def on_startup():
    # Automatically seed database if empty
    try:
        from app.database.session import SessionLocal
        from app.database.models import User
        db = SessionLocal()
        if not db.query(User).first():
            print("Database empty on startup. Running auto-seed...")
            seed_database()
        db.close()
    except Exception as e:
        print(f"Startup seed check error: {e}")

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "llm_provider": settings.LLM_PROVIDER,
        "database": "online"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=settings.DEBUG)
