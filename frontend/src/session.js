

const SESSION_KEY = "bc_session";
const TOKEN_KEY = "bc_token";

export function setToken(token) {

    sessionStorage.setItem(TOKEN_KEY, token);

}
export function getToken() {

    return sessionStorage.getItem(TOKEN_KEY);

}

export function setSession(user) {

    sessionStorage.setItem(

        SESSION_KEY,

        JSON.stringify(user)

    );

}

export function getSession() {

    const data = sessionStorage.getItem(SESSION_KEY);

    if (!data) return null;

    return JSON.parse(data);

}

export function clearSession() {

    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(TOKEN_KEY);

}