from fastapi import FastAPI
from app.routers.route_assignments import router as router_assignments_router

app = FastAPI()

app.include_router(router_assignments_router)


@app.get("/")
def read_root():
    return {"name": "RouteIQ API", "version": "1.0", "status": "running"}


@app.get("/health")
def read_health():
    return {"status": "healthy"}
