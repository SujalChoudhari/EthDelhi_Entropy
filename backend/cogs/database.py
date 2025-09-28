import sqlite3
import os
import time

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../_data"))
os.makedirs(DATA_DIR, exist_ok=True)
DB_PATH = os.path.join(DATA_DIR, "agents.db")

PUB_SUB_DB_PATH = os.path.join(DATA_DIR, "pubsub.db")

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
                    type TEXT,
                    function_agent_mapping TEXT
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
                  type: str = None,
                  function_agent_mapping: str = None):
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            c.execute(
                """
                INSERT INTO agents (
                    agent_id, code, agentverse_id, 
                    risk, assetClass, time, currentStateOfMarket, interest, perf, isNew, reputation,
                    name, creator, title, summary, description, type, function_agent_mapping
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (agent_id, code, agentverse_id, 
                 risk, assetClass, time, currentStateOfMarket, interest, perf, isNew, reputation,
                 name, creator, title, summary, description, type, function_agent_mapping),
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
                ORDER BY agent_id
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

class PubSubDatabase:
    def __init__(self, db_path=PUB_SUB_DB_PATH):
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            c.execute(
                """
                CREATE TABLE IF NOT EXISTS ohlcv_data (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    agent_id TEXT NOT NULL,
                    open_price REAL NOT NULL,
                    high_price REAL NOT NULL,
                    low_price REAL NOT NULL,
                    close_price REAL NOT NULL,
                    volume REAL NOT NULL,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    arguments TEXT NOT NULL
                )
                """
            )
            conn.commit()

    def insert_row(self, 
                   agent_id: str,
                   open_price: float,
                   high_price: float,
                   low_price: float,
                   close_price: float,
                   volume: float,
                   arguments: str,
                   timestamp: str = None):
        """
        Insert a new OHLCV data row for a specific agent.
        
        Args:
            agent_id: The agent identifier
            open_price: Opening price
            high_price: Highest price
            low_price: Lowest price
            close_price: Closing price
            volume: Trading volume
            timestamp: Optional timestamp (defaults to current time)
        """
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            if timestamp is None:
                timestamp = time.time()

            c.execute(
                """
                INSERT INTO ohlcv_data (
                    agent_id, open_price, high_price, low_price, close_price, volume, timestamp, arguments
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (agent_id, open_price, high_price, low_price, close_price, volume, timestamp, arguments)
            )
            conn.commit()

    def get_latest_row(self, agent_id: str, arguments = None):
        """
        Get the latest OHLCV data row for a specific agent.
        
        Args:
            agent_id: The agent identifier
            
        Returns:
            Dictionary containing the latest OHLCV data or None if no data exists
        """
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            where_clause = "WHERE agent_id = ? "
            if arguments is not None:
                where_clause += "AND arguments = ?"
            c.execute(
                f"""
                SELECT * FROM ohlcv_data 
                {where_clause}
                ORDER BY timestamp DESC 
                LIMIT 1
                """,
                (agent_id, arguments)
            )
            row = c.fetchone()
            if row:
                columns = [desc[0] for desc in c.description]
                return dict(zip(columns, row))
            return None

    def get_all_rows(self, agent_id: str, limit: int = None):
        """
        Get all OHLCV data rows for a specific agent.
        
        Args:
            agent_id: The agent identifier
            limit: Optional limit on number of rows to return
            
        Returns:
            List of dictionaries containing OHLCV data
        """
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            if limit:
                c.execute(
                    """
                    SELECT * FROM ohlcv_data 
                    WHERE agent_id = ? 
                    ORDER BY timestamp DESC 
                    LIMIT ?
                    """,
                    (agent_id, limit)
                )
            else:
                c.execute(
                    """
                    SELECT * FROM ohlcv_data 
                    WHERE agent_id = ? 
                    ORDER BY timestamp DESC
                    """,
                    (agent_id,)
                )
            rows = c.fetchall()
            col_names = [desc[0] for desc in c.description]
            return [dict(zip(col_names, row)) for row in rows]

    def delete_agent_data(self, agent_id: str):
        """
        Delete all OHLCV data for a specific agent.
        
        Args:
            agent_id: The agent identifier
        """
        with sqlite3.connect(self.db_path) as conn:
            c = conn.cursor()
            c.execute("DELETE FROM ohlcv_data WHERE agent_id = ?", (agent_id,))
            conn.commit()
