import { apiFetch } from "../http.js";

const URL = "/api/notificaciones";
export async function getNotifications(usuarioId) {

    const response = await apiFetch(

        `${URL}?usuarioId=${usuarioId}&_sort=fecha&_order=desc`

    );

    if (!response.ok) {

        throw new Error("Error obteniendo notificaciones.");

    }

    return await response.json();

}

export async function markAsRead(id) {

    const response = await apiFetch(`${URL}/${id}`, {

        method: "PATCH",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({ leida: true })

    });

    if (!response.ok) {

        throw new Error("No se pudo actualizar la notificación.");

    }

    return await response.json();

}


export async function markAllAsRead(usuarioId) {

    const notifications = await getNotifications(usuarioId);

    const unread = notifications.filter(n => !n.leida);

    await Promise.all(

        unread.map(n => markAsRead(n.id))

    );

}
