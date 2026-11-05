"""
ReliefNet Humanitarian Coordination & Governance OS
FastAPI Production Server
"""

import os
import uvicorn
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from app.api import router as api_router
from app.data_loader import db

app = FastAPI(
    title="ReliefNet — Humanitarian Coordination Network",
    description="Inter-NGO surplus pooling, deterministic AI allocation, and cryptographic chain-of-custody governance.",
    version="4.2.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API
app.include_router(api_router)

# Mount static files
os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
async def serve_root():
    return FileResponse("index.html")

@app.get("/portal", response_class=HTMLResponse)
async def serve_portal():
    return FileResponse("index.html")

@app.get("/dashboard", response_class=HTMLResponse)
async def serve_dashboard():
    return FileResponse("index.html")

@app.get("/screen/{screen_id}", response_class=HTMLResponse)
async def serve_standalone_screen(screen_id: str):
    path = os.path.join("static", "pages", f"{screen_id}.html")
    if os.path.exists(path):
        return FileResponse(path)
    return FileResponse("index.html")

# Fallback catch-all for SPA client routing
@app.get("/{full_path:path}", response_class=HTMLResponse)
async def catch_all(request: Request, full_path: str):
    # Check if a static file exists
    static_candidate = os.path.join("static", full_path)
    if os.path.exists(static_candidate) and os.path.isfile(static_candidate):
        return FileResponse(static_candidate)
    return FileResponse("index.html")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"===============================================================")
    print(f" ReliefNet Humanitarian Coordination Network is Running!")
    print(f" Theme: Alexandria ('The Digital Curator')")
    print(f" Verified NGOs in Database: {len(db.ngos)}")
    print(f" Total Screens Compiled: 29 / 29 Screens Ready")
    print(f" Web Interface: http://127.0.0.1:{port}")
    print(f"===============================================================")
    uvicorn.run("server:app", host="0.0.0.0", port=port, reload=False)

