const BASE_URL = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    // El backend manda { error: "mensaje legible" }; se usa ese texto
    // si existe, para no mostrarle al usuario un código HTTP pelado.
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || `Error de red (${res.status}) al conectar con el backend`);
  }
  return res.json();
}

// Antes, register.js traía el usuario completo (con password) solo para
// ver si ya existía. Ahora el backend responde solo un booleano.
export async function emailExists(email) {
  const { exists } = await request(`/users/check?correo=${encodeURIComponent(email)}`);
  return exists;
}

export async function documentoExists(documento) {
  const { exists } = await request(`/users/check?documento=${encodeURIComponent(documento)}`);
  return exists;
}

// La contraseña se verifica en el servidor; aquí solo se envía una vez
// y se recibe un token de sesión, nunca la contraseña de vuelta.
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
