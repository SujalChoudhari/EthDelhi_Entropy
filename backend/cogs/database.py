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
                    risk TEXT,
                    assetClass TEXT,
                    time TEXT,
                    currentStateOfMarket TEXT,
                    interest TEXT,
                    perf REAL DEFAULT 0,
                    isNew BOOL DEFAULT 0,
                    reputation REAL DEFAULT 0,
                    name TEXT,
                    creator TEXT,
                    title TEXT,
                    summary TEXT,
                    description TEXT,
                    type TEXT
                )
                """
            )
            conn.commit()

    def add_agent(self, 
                  agent_id: str, 
                  code: str, 
                  agentverse_id: str = None,
                  # New strategy parameters (primary)
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
                  type:str = None ):
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            c.execute(
                """
                INSERT INTO agents (
                    agent_id, code, agentverse_id, 
                    risk, assetClass, time, currentStateOfMarket, interest, perf, isNew, reputation,
                    name, creator, title, summary, description, type
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (agent_id, code, agentverse_id, 
                 risk, assetClass, time, currentStateOfMarket, interest, perf, isNew, reputation,
                 name, creator, title, summary, description, type),
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

    def list_agents(self, search: str = None, type: str = None):
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            # Updated columns to focus on strategy recommendation parameters
            searchable_columns = [
                "agent_id", "code", "agentverse_id", "risk", "assetClass", "time", 
                "currentStateOfMarket", "interest", "name", "creator", "title", "summary", "description"
            ]

            where_conditions = []
            params = []
            
            if search:
                like = f"%{search.lower()}%"
                search_clause = " OR ".join([f"LOWER({col}) LIKE ?" for col in searchable_columns])
                where_conditions.append(f"({search_clause})")
                params.extend([like] * len(searchable_columns))
            
            if type:
                where_conditions.append("type = ?")
                params.append(type)
            
            where_clause = " AND ".join(where_conditions) if where_conditions else "1=1"
            
            c.execute(
                f"""
                SELECT * FROM agents
                WHERE {where_clause}
                ORDER BY reputation DESC, perf DESC
                """,
                params
            )
            
            rows = c.fetchall()
            col_names = [desc[0] for desc in c.description]
            return [dict(zip(col_names, row)) for row in rows]

    def update_happiness(self, agent_id: str, happiness: int):
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            c.execute("UPDATE agents SET happiness = ? WHERE agent_id = ?", (happiness, agent_id))
            conn.commit()