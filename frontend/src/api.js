const BASE_URL = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || `Error de red (${res.status}) al conectar con el backend`);
  }
  return res.json();
}
export async function emailExists(email) {
  const { exists } = await request(`/users/check?correo=${encodeURIComponent(email)}`);
  return exists;
}

export async function documentoExists(documento) {
  const { exists } = await request(`/users/check?documento=${encodeURIComponent(documento)}`);
  return exists;
}
export async function login(documento, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ documento, password }),
  });
}

export async function createUser(payload) {
  return request("/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
