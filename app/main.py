from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return {"name": "RouteIQ API", "version": "1.0", "status": "running"}


@app.get("/health")
def read_health():
    return {"status": "healthy"}
