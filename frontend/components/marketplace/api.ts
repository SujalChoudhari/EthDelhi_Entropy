export const API_BASE = "http://localhost:8000/agents";

export async function fetchStrategies(search?: string, type?: string) {
  const params = new URLSearchParams();
  if (type) {
    params.append('type', type); // Filter by agent type (strategy or indicator)
  }
  if (search) {
    params.append('search', search);
  }
  
  const url = `${API_BASE}/?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch strategies");
  const data = await res.json();
  return data.agents;
}

export async function updateReputation(agentId: string, reputation: number) {
  const res = await fetch(`${API_BASE}/${agentId}/reputation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reputation }),
  });
  if (!res.ok) throw new Error("Failed to update reputation");
  return res.json();
}
