from fastapi import Request
from fastapi.responses import JSONResponse

from app.core.exceptions import NotFoundException


async def not_found_exception_handler(request: Request, exc: NotFoundException):
    return JSONResponse(
        status_code=404,
        content={
            "status": 404,
            "message": exc.message
        }
    )