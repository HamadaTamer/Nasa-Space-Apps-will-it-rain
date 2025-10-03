// api/client.ts
import type { ActivityRequest, ActivityResponse } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000";

export async function fetchActivity(req: ActivityRequest, signal?: AbortSignal): Promise<ActivityResponse> {
  const res = await fetch(`${API_BASE}/api/v1/activity`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
    signal,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Activity API ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}
