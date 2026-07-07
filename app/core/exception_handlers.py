from fastapi import Request
from fastapi.responses import JSONResponse

from app.core.exceptions import (
    NotFoundException, BadRequestException
)


async def not_found_exception_handler(request: Request, exc: NotFoundException):
    return JSONResponse(
        status_code=404,
        content={
            "status": 404,
            "message": exc.message
        }
    )

async def bad_request_exception_handler(request: Request, exc: BadRequestException):
    return JSONResponse(
        status_code=400,
        content={
            "status": 400,
            "message": exc.message
        }
    )