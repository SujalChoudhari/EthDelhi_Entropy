from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from cogs.api_router import router as agent_router

app = FastAPI(
    title="Fetch.ai Agent Runner API",
    description="Create, run, stop, and log Python agents",
    version="2.1.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust as needed for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agent_router, prefix="/agents", tags=["Agents"])


@app.get("/", tags=["Root"])
async def root():
    return {"message": "Welcome to the Agent Runner API. Use /agents/* endpoints."}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
