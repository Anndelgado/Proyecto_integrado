// ======================================================
// ConfiguracionView.js
// Barranquilla Convive
// ======================================================

import { DashboardLayout } from "../../layouts/DashboardLayout.js";
import { PageHeader } from "../../components/layout/PageHeader.js";
import { Card } from "../../components/ui/Card.js";
import { Button } from "../../components/ui/Button.js";
import { getSession } from "../../session.js";

export function ConfiguracionView() {

    const session = getSession() || {};

    const page = document.createElement("div");

    page.className = `
        flex
        flex-col
        gap-8
    `;

    //==================================================
    // Encabezado
    //==================================================

    page.appendChild(

        PageHeader({

            title: "Configuración",

            subtitle: "Ajusta las preferencias generales, de notificaciones y de seguridad del sistema.",

            icon: "gear"

        })

    );

    const grid = document.createElement("section");

    grid.className = `
        grid
        gap-6
        xl:grid-cols-2
    `;

    //==================================================
    // General
    //==================================================

    const generalForm = document.createElement("form");

    generalForm.className = "flex flex-col gap-5";

    generalForm.innerHTML = `

        ${field("Nombre del sistema", "nombreSistema", "text", "Barranquilla Convive")}

        ${field("Correo de contacto", "correoContacto", "email", "soporte@baqconvive.gov.co")}

        ${field("Zona horaria", "zonaHoraria", "text", "América/Bogotá")}

    `;

    generalForm.appendChild(

        saveButton()

    );

    generalForm.addEventListener(

        "submit",

        (event) => {

            event.preventDefault();

            alert("Preferencias generales guardadas correctamente.");

        }

    );

    grid.appendChild(

        Card({

            title: "General",

            subtitle: "Información básica del sistema",

            content: generalForm

        })

    );

    //==================================================
    // Notificaciones
    //==================================================

    const notifForm = document.createElement("form");

    notifForm.className = "flex flex-col gap-5";

    notifForm.innerHTML = `

        ${toggle("Alertas de riesgo alto", "notifRiesgoAlto", true)}

        ${toggle("Nuevos usuarios pendientes", "notifPendientes", true)}

        ${toggle("Resumen semanal por correo", "notifResumen", false)}

    `;

    notifForm.appendChild(

        saveButton()

    );

    notifForm.addEventListener(

        "submit",

        (event) => {

            event.preventDefault();

            alert("Preferencias de notificaciones guardadas correctamente.");

        }

    );

    grid.appendChild(

        Card({

            title: "Notificaciones",

            subtitle: "Elige qué eventos quieres recibir",

            content: notifForm

        })

    );

    //==================================================
    // Seguridad
    //==================================================

    const securityForm = document.createElement("form");

    securityForm.className = "flex flex-col gap-5";

    securityForm.innerHTML = `

        ${field("Correo de la cuenta", "correoCuenta", "email", session.correo ?? "", true)}

        ${field("Nueva contraseña", "nuevaPassword", "password", "")}

        ${field("Confirmar nueva contraseña", "confirmarPassword", "password", "")}

    `;

    securityForm.appendChild(

        saveButton("Actualizar contraseña")

    );

    securityForm.addEventListener(

        "submit",

        (event) => {

            event.preventDefault();

            const data = Object.fromEntries(new FormData(securityForm).entries());

            if (

                data.nuevaPassword &&
                data.nuevaPassword !== data.confirmarPassword

            ) {

                alert("Las contraseñas no coinciden.");

                return;

            }

            alert("Los cambios de seguridad se guardaron correctamente.");

            securityForm.reset();

        }

    );

    grid.appendChild(

        Card({

            title: "Seguridad",

            subtitle: "Actualiza los datos de acceso de tu cuenta",

            content: securityForm

        })

    );

    //==================================================
    // Datos del sistema
    //==================================================

    const dataPanel = document.createElement("div");

    dataPanel.className = "flex flex-col gap-5";

    dataPanel.innerHTML = `

        <div
            class="
                flex
                items-center
                justify-between
                rounded-2xl
                bg-slate-50
                p-5
            "
        >

            <div>

                <p class="font-semibold text-navy-900">

                    Respaldo de la base de datos

                </p>

                <p class="mt-1 text-sm text-slate-500">

                    Descarga una copia de los datos actuales del sistema.

                </p>

            </div>

        </div>

        <div
            class="
                flex
                items-center
                justify-between
                rounded-2xl
                bg-red-50
                p-5
            "
        >

            <div>

                <p class="font-semibold text-red-700">

                    Zona de riesgo

                </p>

                <p class="mt-1 text-sm text-red-500">

                    Restablecer la configuración a los valores de fábrica.

                </p>

            </div>

        </div>

    `;

    const backupButton = Button({

        text: "Descargar respaldo",

        icon: "download",

        variant: "secondary"

    });

    dataPanel.firstElementChild.appendChild(backupButton);

    backupButton.addEventListener(

        "click",

        () => {

            alert("La descarga del respaldo comenzará en breve.");

        }

    );

    const resetButton = Button({

        text: "Restablecer",

        icon: "arrow-rotate-left",

        variant: "danger"

    });

    dataPanel.lastElementChild.appendChild(resetButton);

    resetButton.addEventListener(

        "click",

        () => {

            const confirmed = confirm(

                "¿Deseas restablecer la configuración a los valores de fábrica?"

            );

            if (confirmed) {

                alert("La configuración fue restablecida.");

            }

        }

    );

    grid.appendChild(

        Card({

            title: "Datos del Sistema",

            subtitle: "Respaldo y restablecimiento",

            content: dataPanel

        })

    );

    page.appendChild(grid);

    //==================================================

    return DashboardLayout({

        activePath: "/admin/configuracion",

        title: "Configuración",

        content: page

    });

}

//==================================================
// Helpers de formulario
//==================================================

function field(label, name, type = "text", value = "", disabled = false) {

    return `

        <div>

            <label
                class="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-slate-700
                "
            >
                ${label}
            </label>

            <input

                name="${name}"

                type="${type}"

                value="${value}"

                ${disabled ? "disabled" : ""}

                class="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    px-4
                    py-3
                    outline-none
                    focus:border-yellow-400
                    disabled:bg-slate-100
                    disabled:text-slate-400
                "

            >

        </div>

    `;

}

function toggle(label, name, checked = false) {

    return `

        <label
            class="
                flex
                items-center
                justify-between
                rounded-2xl
                bg-slate-50
                px-5
                py-4
                cursor-pointer
            "
        >

            <span class="text-sm font-medium text-slate-700">

                ${label}

            </span>

            <input

                type="checkbox"

                name="${name}"

                ${checked ? "checked" : ""}

                class="h-5 w-5 accent-yellow-400"

            >

        </label>

    `;

}

function saveButton(text = "Guardar cambios") {

    return Button({

        text,

        icon: "floppy-disk",

        type: "submit"

    });

}
