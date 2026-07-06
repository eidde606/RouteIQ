from fastapi import FastAPI

from app.core.logging_config import logger
from app.routers.route_assignments import router as router_assignments_router
from app.core.exceptions import NotFoundException
from app.core.exception_handlers import not_found_exception_handler

app = FastAPI(
    title="RouteIQ API",
    version="1.0.0"
)

app.add_exception_handler(NotFoundException, not_found_exception_handler)

app.include_router(router_assignments_router)


@app.on_event("startup")
def startup_event():
    logger.info("RouteIQ API started successfully")


@app.get("/")
def read_root():
    logger.info("Root endpoint called")

    return {
        "name": "RouteIQ API",
        "version": "1.0",
        "status": "running"
    }


@app.get("/health")
def read_health():
    logger.info("Health endpoint called")

    return {
        "status": "healthy"
    }
