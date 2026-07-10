from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.logging_config import logger
from app.routers.route_assignments import router as router_assignments_router
from app.routers.users import router as users_router

from app.core.exceptions import (
    NotFoundException,
    BadRequestException,
)

from app.core.exception_handlers import (
    not_found_exception_handler,
    bad_request_exception_handler,
)

app = FastAPI(
    title="RouteIQ API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(NotFoundException, not_found_exception_handler)
app.add_exception_handler(BadRequestException, bad_request_exception_handler)

app.include_router(router_assignments_router)
app.include_router(users_router)


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
