from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from cogs.strategy_manager import StrategyManager

router = APIRouter()
manager = StrategyManager()



# Model for agent creation (all fields)
from typing import Optional
class AgentCode(BaseModel):
    code: str
    agentverse_id: Optional[str] = None
    creator: Optional[str] = None
    title: Optional[str] = None
    summary: Optional[str] = None
    description: Optional[str] = None
    happiness: Optional[int] = 0
    users: Optional[int] = 0
    profitUsers: Optional[int] = 0
    avgStopLoss: Optional[float] = 0
    avgGains: Optional[float] = 0
    successRate: Optional[float] = 0
    monthlyFee: Optional[float] = 0

class HappinessUpdate(BaseModel):
    happiness: int


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_agent(payload: AgentCode):
    agent_id = manager.create_agent(
        code=payload.code,
        agentverse_id=payload.agentverse_id or 0,
        creator=payload.creator,
        title=payload.title,
        summary=payload.summary,
        description=payload.description,
        happiness= 0,
        users=0,
        profitUsers=0,
        avgStopLoss=0,
        avgGains=0,
        successRate=0,
        monthlyFee=payload.monthlyFee
    )
    return {"agent_id": agent_id, "message": "Agent created"}


@router.get("/")
async def list_agents(search: str = None):
    agents = manager.list_agents(search=search)
    return {"agents": agents}
# Add search endpoint (alias for list with search param)
@router.get("/search")
async def search_agents(q: str):
    agents = manager.list_agents(search=q)
    return {"agents": agents}
# Add endpoint to update happiness/reactions
@router.post("/{agent_id}/happiness")
async def update_happiness(agent_id: str, payload: HappinessUpdate):
    if not manager.update_happiness(agent_id, payload.happiness):
        raise HTTPException(status_code=404, detail="Agent not found")
    return {"agent_id": agent_id, "happiness": payload.happiness, "message": "Happiness updated"}


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

@router.get("/{agent_id}/address")
async def get_agent_address(agent_id: str):
    address = manager.get_agent_address(agent_id)
    if not address:
        raise HTTPException(status_code=404, detail="Agent address not found in logs")
    return {"agent_id": agent_id, "address": address}
