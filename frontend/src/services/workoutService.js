const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function handleResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  const data = isJson ? await res.json() : await res.text();
  if (!res.ok) {
    const message =
      data && typeof data === 'object' && 'message' in data
        ? data.message
        : typeof data === 'string' && data.trim()
        ? data
        : `Error ${res.status}`;
    throw new Error(message);
  }

  return data;
}

export async function getWorkoutHistory(token) {
  const res = await fetch(`${API_URL}/workouts/history`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
}

export async function getWorkoutSummary(token) {
  const res = await fetch(`${API_URL}/workouts/summary`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
}

export async function getWorkoutSession(logId, token) {
  const res = await fetch(`${API_URL}/workouts/${logId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(res);
}
