const BASE_URL = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`Error de red (${res.status}) al conectar con el backend`);
  }
  return res.json();
}

export async function findUserByEmail(email) {
  const users = await request(`/users?correo=${encodeURIComponent(email)}`);
  return users[0] || null;
}

export async function findUserByDocumento(documento) {
  const users = await request(`/users?documento=${encodeURIComponent(documento)}`);
  return users[0] || null;
}

export async function createUser(payload) {
  return request("/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
