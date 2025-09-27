export const API_BASE = "http://localhost:8000/agents";

export async function fetchStrategies(search?: string) {
  const params = new URLSearchParams();
  params.append('type', 'string'); // Only fetch strategy-type agents
  if (search) {
    params.append('search', search);
  }
  
  const url = `${API_BASE}/?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch strategies");
  const data = await res.json();
  return data.agents;
}

export async function updateHappiness(agentId: string, happiness: number) {
  const res = await fetch(`${API_BASE}/${agentId}/happiness`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ happiness }),
  });
  if (!res.ok) throw new Error("Failed to update happiness");
  return res.json();
}
