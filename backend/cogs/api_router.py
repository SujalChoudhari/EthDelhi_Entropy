from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from cogs.strategy_manager import StrategyManager
from fastapi.responses import JSONResponse

router = APIRouter()
manager = StrategyManager()

class AgentCode(BaseModel):
    code: str


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_agent(payload: AgentCode):
    agent_id = manager.create_agent(payload.code)
    return {"agent_id": agent_id, "message": "Agent created"}


@router.get("/")
async def list_agents():
    return {"agents": manager.list_agents()}


@router.get("/{agent_id}")
async def get_agent(agent_id: str):
    details = manager.get_agent(agent_id)
    if not details:
        raise HTTPException(status_code=404, detail="Agent not found")
    return details


@router.put("/{agent_id}")
async def update_agent(agent_id: str, payload: AgentCode):
    if not manager.update_agent_code(agent_id, payload.code):
        raise HTTPException(status_code=404, detail="Agent not found")
    return {"agent_id": agent_id, "message": "Agent updated (stopped if running)"}


@router.delete("/{agent_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_agent(agent_id: str):
    if not manager.delete_agent(agent_id):
        raise HTTPException(status_code=404, detail="Agent not found")


@router.post("/{agent_id}/start")
async def start_agent(agent_id: str):
    if not manager.start_agent(agent_id):
        raise HTTPException(status_code=409, detail="Agent not found or already running")
    return {"agent_id": agent_id, "message": "Agent started"}


@router.post("/{agent_id}/stop")
async def stop_agent(agent_id: str):
    if not manager.stop_agent(agent_id):
        raise HTTPException(status_code=409, detail="Agent not found or already stopped")
    return {"agent_id": agent_id, "message": "Agent stopped"}


@router.get("/{agent_id}/logs")
async def get_logs(agent_id: str):
    logs = manager.get_logs(agent_id)
    if logs is None:
        raise HTTPException(status_code=404, detail="Agent not found or not running")
    return {"agent_id": agent_id, "logs": logs}

@router.post("/deploy")
async def deploy_agent(agent_id: str):
    if not manager.deploy_agent(agent_id):
        raise HTTPException(status_code=404, detail="Agent Not Found")

    return JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"agent_id": agent_id, "status": "deployed"}
    )
