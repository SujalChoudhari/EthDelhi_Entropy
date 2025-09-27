import sys
import uuid
import re
import time
from multiprocessing import Process, Queue
from multiprocessing.queues import Queue as QueueType
import logging
import subprocess
import os

from .database import AgentDatabase  # <-- Add this import

def agent_runner(code: str, queue: QueueType):
    """Runs agent code and redirects stdout/stderr + logging output into a queue."""

    class QueueWriter:
        def __init__(self, q: QueueType):
            self.q = q

        def write(self, data):
            if data:
                self.q.put(str(data))

        def flush(self):
            pass

        def isatty(self):
            return False

    # Redirect stdout and stderr
    sys.stdout = QueueWriter(queue)
    sys.stderr = QueueWriter(queue)

    # Redirect logging too
    logging.basicConfig(stream=sys.stdout, level=logging.INFO)

    try:
        if not code.strip():
            raise ValueError("Agent code is empty")
        exec(code, {"__name__": "__main__"})
    except Exception as e:
        queue.put(f"Error executing agent code: {e}")
    finally:
        queue.put("__END__")


class StrategyManager:
    """Manages lifecycle of agents."""

    def __init__(self):
        self.agents = {}
        self.db = AgentDatabase()
        # Load agents from DB at startup
        for row in self.db.list_agents():
            agent_id = row["agent_id"]
            self.agents[agent_id] = {
                "code": row["code"],
                "process": None,
                "queue": None,
                "status": "stopped",
                "agentverse_id": row.get("agentverse_id"),
                # New strategy parameters
                "risk": row.get("risk"),
                "assetClass": row.get("assetClass"),
                "time": row.get("time"),
                "currentStateOfMarket": row.get("currentStateOfMarket"),
                "interest": row.get("interest"),
                "perf": row.get("perf", 0),
                "isNew": row.get("isNew", False),
                "reputation": row.get("reputation", 0),
                # Old parameters (kept as requested)
                "name": row.get("name"),
                "creator": row.get("creator"),
                "title": row.get("title"),
                "summary": row.get("summary"),
                "description": row.get("description"),
                "type": row.get("type"),
            }
        
        self.running_agents = {}

    def create_agent(
        self,
        code: str,
        agentverse_id: str = None,
        # New strategy recommendation parameters (primary)
        risk: str = None,
        assetClass: str = None,
        time: str = None,
        currentStateOfMarket: str = None,
        interest: str = None,
        perf: float = 0,
        isNew: bool = False,
        reputation: float = 0,
        # Old parameters (kept for compatibility - will become redundant)
        name: str = None,
        creator: str = None,
        title: str = None,
        summary: str = None,
        description: str = None,
        type: str = None,
    ) -> str:
        agent_id = str(uuid.uuid4())
        self.agents[agent_id] = {
            "code": code,
            "process": None,
            "queue": None,
            "status": "stopped",
            "agentverse_id": agentverse_id,
            # New strategy parameters
            "risk": risk,
            "assetClass": assetClass,
            "time": time,
            "currentStateOfMarket": currentStateOfMarket,
            "interest": interest,
            "perf": perf,
            "isNew": isNew,
            "reputation": reputation,
            # Old parameters (kept as requested)
            "name": name,
            "creator": creator,
            "title": title,
            "summary": summary,
            "description": description,
            "type": type,
        }
        self.db.add_agent(
            agent_id, code, agentverse_id, risk, assetClass, time, currentStateOfMarket, interest, perf, isNew, reputation,
            name, creator, title, summary, description, type
        )
        return agent_id

    def start_agent(self, agent_id: str) -> bool:
        agent = self.agents.get(agent_id)
        if not agent or agent["status"] == "running":
            return False

        queue = Queue()
        process = Process(target=agent_runner, args=(agent["code"], queue))
        process.start()

        agent["process"] = process
        agent["queue"] = queue
        agent["status"] = "running"
        return True

    def stop_agent(self, agent_id: str) -> bool:
        agent = self.agents.get(agent_id)
        if not agent or agent["status"] == "stopped":
            return False

        if agent["process"] and agent["process"].is_alive():
            agent["process"].terminate()
            agent["process"].join()

        agent["process"] = None
        if agent["queue"]:
            agent["queue"].close()
            agent["queue"] = None
        agent["status"] = "stopped"
        return True

    def delete_agent(self, agent_id: str) -> bool:
        if agent_id not in self.agents:
            return False
        if self.agents[agent_id]["status"] == "running":
            self.stop_agent(agent_id)
        del self.agents[agent_id]
        self.db.delete_agent(agent_id)  # <-- Remove from DB
        return True

    def update_agent_code(self, agent_id: str, code: str) -> bool:
        agent = self.agents.get(agent_id)
        if not agent:
            return False
        if agent["status"] == "running":
            self.stop_agent(agent_id)
        agent["code"] = code
        self.db.update_agent(agent_id, code=code)  # <-- Update in DB
        return True

    def get_agent(self, agent_id: str) -> dict | None:
        agent = self.agents.get(agent_id)
        if not agent:
            return None
        if agent["status"] == "running" and (
            not agent["process"] or not agent["process"].is_alive()
        ):
            agent["status"] = "stopped"
        return {
            "agent_id": agent_id,
            "status": agent["status"],
            "code": agent["code"],
            "agentverse_id": agent.get("agentverse_id"),
        }

    def list_agents(self, search: str = None, type: str = None) -> list:
        # Use DB for search and listing with type filter
        agents = self.db.list_agents(search=search, type=type)
        return agents
    def update_happiness(self, agent_id: str, happiness: int) -> bool:
        agent = self.agents.get(agent_id)
        if not agent:
            return False
        agent["happiness"] = happiness
        self.db.update_happiness(agent_id, happiness)
        return True

    def get_logs(self, agent_id: str) -> str | None:
        agent = self.agents.get(agent_id)
        if not agent or agent["status"] != "running" or not agent["queue"]:
            return None

        logs = []
        q = agent["queue"]
        while not q.empty():
            chunk = q.get()
            if chunk == "__END__":
                break
            logs.append(chunk)
        return "".join(logs) if logs else ""
    

    
    def get_agent_address(self, agent_id: str, timeout: float = 10.0) -> str | None:
        """
        Deploys the agent, captures its address from logs, then stops the agent.
        The agent must print its address (agent1q...) to stdout on startup.
        If no address is found, returns the logs instead.
        """
        agent = self.agents.get(agent_id)
        if not agent:
            return None

        # Start agent if not running
        if agent["status"] != "running":
            self.start_agent(agent_id)
            started_here = True
        else:
            started_here = False

        address = None
        logs = ""
        pattern = re.compile(r"\b(agent1q\w+)\b")
        start_time = time.time()

        # Poll logs for address
        while time.time() - start_time < timeout:
            logs = self.get_logs(agent_id) or ""
            match = pattern.search(logs)
            if match:
                address = match.group(1)
                break
            time.sleep(0.2)

        # Stop agent if we started it
        if started_here:
            self.stop_agent(agent_id)

        print("logs: ",logs)
        if address:
            return address
        else:
            return logs  # Return logs if no address found

    
    def deploy_agent(self, agent_id: str):
        agent = self.get_agent(agent_id)
        python_code = agent['code']

        script_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "scripts", "run_python.sh")

        subprocess.run([script_path, f"{agent_id}.py", python_code], cwd=os.path.dirname(os.path.dirname(__file__)))

        process = subprocess.Popen(
            [sys.executable, f"{agent_id}.py"],
            cwd=os.path.dirname(os.path.dirname(__file__)),
            start_new_session=True       
        )

        self.running_agents[agent_id] = process

        return True

    def stop_agent(self, agent_id: str):
        process = self.running_agents.get(agent_id)
        if process:
            process.terminate()  
            process.wait()      
            del self.running_agents[agent_id]
            return True
        return False

    def is_running(self, agent_id: str):
        process = self.running_agents.get(agent_id)
        return process and process.poll() is None
