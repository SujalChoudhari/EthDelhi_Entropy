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
                    agentverse_id TEXT,
                    creator TEXT,
                    title TEXT,
                    summary TEXT,
                    description TEXT,
                    happiness INTEGER DEFAULT 0,
                    users INTEGER DEFAULT 0,
                    profitUsers INTEGER DEFAULT 0,
                    avgStopLoss REAL DEFAULT 0,
                    avgGains REAL DEFAULT 0,
                    successRate REAL DEFAULT 0,
                    monthlyFee REAL DEFAULT 0
                )
                """
            )
            conn.commit()

    def add_agent(self, agent_id: str, code: str, agentverse_id: str = None, creator: str = None, title: str = None, summary: str = None, description: str = None, happiness: int = 0, users: int = 0, profitUsers: int = 0, avgStopLoss: float = 0, avgGains: float = 0, successRate: float = 0, monthlyFee: float = 0):
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            c.execute(
                """
                INSERT INTO agents (agent_id, code, agentverse_id, creator, title, summary, description, happiness, users, profitUsers, avgStopLoss, avgGains, successRate, monthlyFee)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (agent_id, code, agentverse_id, creator, title, summary, description, happiness, users, profitUsers, avgStopLoss, avgGains, successRate, monthlyFee),
            )
            conn.commit()

    def update_agent(self, agent_id: str, **kwargs):
        # kwargs can include any column
        if not kwargs:
            return
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            fields = []
            values = []
            for k, v in kwargs.items():
                fields.append(f"{k} = ?")
                values.append(v)
            values.append(agent_id)
            sql = f"UPDATE agents SET {', '.join(fields)} WHERE agent_id = ?"
            c.execute(sql, values)
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
                "SELECT * FROM agents WHERE agent_id = ?",
                (agent_id,),
            )
            row = c.fetchone()
            if row:
                columns = [desc[0] for desc in c.description]
                return dict(zip(columns, row))
            return None

    def list_agents(self, search: str = None):
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            columns = [
                "agent_id", "code", "agentverse_id", "creator", "title", "summary", "description",
                "happiness", "users", "profitUsers", "avgStopLoss", "avgGains", "successRate", "monthlyFee"
            ]
            if search:
                like = f"%{search.lower()}%"
                where_clause = " OR ".join([f"LOWER({col}) LIKE ?" for col in columns if col not in ["happiness", "users", "profitUsers", "avgStopLoss", "avgGains", "successRate", "monthlyFee"]])
                params = [like] * where_clause.count("?")
                c.execute(
                    f"""
                    SELECT * FROM agents
                    WHERE {where_clause}
                    ORDER BY avgGains DESC
                    """,
                    params
                )
            else:
                c.execute("SELECT * FROM agents ORDER BY avgGains DESC")
            rows = c.fetchall()
            col_names = [desc[0] for desc in c.description]
            return [dict(zip(col_names, row)) for row in rows]

    def update_happiness(self, agent_id: str, happiness: int):
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            c.execute("UPDATE agents SET happiness = ? WHERE agent_id = ?", (happiness, agent_id))
            conn.commit()