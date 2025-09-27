import sqlite3
import os

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../_data"))
os.makedirs(DATA_DIR, exist_ok=True)
DB_PATH = os.path.join(DATA_DIR, "agents.db")


class AgentDatabase:
    def __init__(self, db_path=DB_PATH):
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            c.execute(
                """
                CREATE TABLE IF NOT EXISTS agents (
                    agent_id TEXT PRIMARY KEY,
                    code TEXT NOT NULL,
                    agentverse_id TEXT
                )
                """
            )
            conn.commit()

    def add_agent(self, agent_id: str, code: str, agentverse_id: str = None):
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            c.execute(
                "INSERT INTO agents (agent_id, code, agentverse_id) VALUES (?, ?, ?)",
                (agent_id, code, agentverse_id),
            )
            conn.commit()

    def update_agent(self, agent_id: str, code: str = None, agentverse_id: str = None):
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            if code is not None and agentverse_id is not None:
                c.execute(
                    "UPDATE agents SET code = ?, agentverse_id = ? WHERE agent_id = ?",
                    (code, agentverse_id, agent_id),
                )
            elif code is not None:
                c.execute(
                    "UPDATE agents SET code = ? WHERE agent_id = ?",
                    (code, agent_id),
                )
            elif agentverse_id is not None:
                c.execute(
                    "UPDATE agents SET agentverse_id = ? WHERE agent_id = ?",
                    (agentverse_id, agent_id),
                )
            conn.commit()

    def delete_agent(self, agent_id: str):
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            c.execute("DELETE FROM agents WHERE agent_id = ?", (agent_id,))
            conn.commit()

    def get_agent(self, agent_id: str):
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            c.execute(
                "SELECT agent_id, code, agentverse_id FROM agents WHERE agent_id = ?",
                (agent_id,),
            )
            row = c.fetchone()
            if row:
                return {"agent_id": row[0], "code": row[1], "agentverse_id": row[2]}
            return None

    def list_agents(self):
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            c.execute("SELECT agent_id, code, agentverse_id FROM agents")
            rows = c.fetchall()
            return [
                {"agent_id": row[0], "code": row[1], "agentverse_id": row[2]}
                for row in rows
            ]