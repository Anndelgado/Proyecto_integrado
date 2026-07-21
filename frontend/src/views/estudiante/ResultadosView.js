import { DashboardLayout } from "../../layouts/DashboardLayout.js";
import { PageHeader } from "../../components/layout/PageHeader.js";
import { StatCard } from "../../components/dashboard/StatCard.js";
import { ChartCard } from "../../components/dashboard/ChartCard.js";
import { TableCard } from "../../components/dashboard/TableCard.js";
import { Badge } from "../../components/ui/Badge.js";
import { Button } from "../../components/ui/Button.js";
import { getSession } from "../../session.js";
import { navigate } from "../../router.js";
import { getCatalogoTests, getResultados } from "../../services/TestService.js";
export async function ResultadosView() {
    const session = getSession() || {};

    const catalogo = getCatalogoTests();

    const resultados = await getResultados(session.id).catch(() => []);

    const page = document.createElement("div");

    page.className = `
        flex
        flex-col
        gap-8
    `;


    page.appendChild(

        PageHeader({

            title: "Mis Resultados",

            subtitle: "Consulta la evolución de tu bienestar emocional a partir de los test que has respondido.",

            icon: "chart-pie",

            secondaryButtonText: "Responder un test",

            secondaryButtonIcon: "clipboard-list",

            onSecondaryClick() {

                navigate("/estudiante/test");

            }

        })

    );
    if (!resultados.length) {

        const empty = document.createElement("div");

        empty.className = `
            flex
            flex-col
            items-center
            gap-5
            rounded-3xl
            bg-white
            p-16
            text-center
            shadow-sm
        `;

        empty.innerHTML = `

            <div
                class="
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-2xl
                    bg-yellow-100
                    text-yellow-600
                "
            >
                <i class="fa-solid fa-chart-pie text-2xl"></i>
            </div>

            <div>
                <h3 class="text-lg font-semibold text-navy-900">
                    Todavía no tienes resultados
                </h3>
                <p class="mt-2 max-w-md text-sm text-slate-500">
                    Responde alguno de tus test disponibles y aquí podrás ver tu progreso.
                </p>
            </div>

        `;

        empty.appendChild(

            Button({

                text: "Ir a Mis Test",

                icon: "arrow-right",

                onClick() {

                    navigate("/estudiante/test");

                }

            })

        );

        page.appendChild(empty);

        return DashboardLayout({

            activePath: "/estudiante/resultados",

            title: "Mis Resultados",

            content: page

        });

    }

    const esteMes = resultados.filter(resultado => {

        const fecha = new Date(resultado.fecha);

        const hoy = new Date();

        return fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear();

    }).length;

    const promedio = Math.round(

        resultados.reduce((suma, resultado) => suma + resultado.porcentaje, 0) / resultados.length

    );

    const enAlerta = resultados.filter(resultado => resultado.nivel === "Alto").length;

    const statsGrid = document.createElement("section");

    statsGrid.className = `
        grid
        gap-6
        sm:grid-cols-2
        xl:grid-cols-4
    `;

    statsGrid.append(

        StatCard({

            title: "Test Completados",

            value: String(resultados.length),

            icon: "circle-check",

            color: "green"

        }),

        StatCard({

            title: "Este Mes",

            value: String(esteMes),

            icon: "calendar-check",

            color: "blue"

        }),

        StatCard({

            title: "Promedio General",

            value: `${promedio}%`,

            icon: "gauge-high",

            color: "yellow"

        }),

        StatCard({

            title: "Niveles Altos",

            value: String(enAlerta),

            icon: "triangle-exclamation",

            color: enAlerta ? "red" : "navy"

        })

    );

    page.appendChild(statsGrid);
    const promedioBars = document.createElement("div");
    promedioBars.className = `
        flex
        w-full
        flex-col
        gap-6
    `;

    catalogo.forEach(test => {

        const resultadosTest = resultados.filter(r => r.testId === test.id);

        const promedioTest = resultadosTest.length
            ? Math.round(resultadosTest.reduce((suma, r) => suma + r.porcentaje, 0) / resultadosTest.length)
            : 0;

        const barColors = {

            blue: "bg-blue-500",

            yellow: "bg-yellow-400",

            green: "bg-emerald-500"

        };

        const row = document.createElement("div");

        row.innerHTML = `

            <div class="mb-2 flex items-center justify-between text-sm">

                <span class="flex items-center gap-2 font-medium text-navy-900">
                    <i class="fa-solid fa-${test.icon} text-slate-400"></i>
                    ${test.nombre}
                </span>

                <span class="text-slate-500">
                    ${resultadosTest.length
                        ? `${promedioTest}% · ${resultadosTest.length} intento${resultadosTest.length > 1 ? "s" : ""}`
                        : "Sin datos aún"}
                </span>

            </div>

            <div class="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                    class="h-full rounded-full ${barColors[test.color] ?? "bg-slate-400"} transition-all duration-500"
                    style="width: ${promedioTest}%"
                ></div>
            </div>

        `;

        promedioBars.appendChild(row);

    });

    page.appendChild(

        ChartCard({

            title: "Promedio por Tipo de Test",

            subtitle: "Comparativo de tus resultados según el test",

            height: "auto",

            content: promedioBars

        })

    );
    page.appendChild(

        TableCard({

            title: "Historial de Resultados",

            subtitle: "Todos los test que has respondido",

            headers: [

                "Test",

                "Fecha",

                "Puntaje",

                "Nivel"

            ],

            rows: resultados.map(resultado => [

                `<span class="flex items-center gap-3">
                    <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                        <i class="fa-solid fa-${resultado.icon}"></i>
                    </span>
                    <span class="font-medium text-navy-900">${resultado.testNombre}</span>
                </span>`,

                resultado.fecha,

                `${resultado.puntaje}/${resultado.puntajeMax} (${resultado.porcentaje}%)`,

                Badge({ text: resultado.nivel, variant: resultado.variant })

            ]),

            emptyMessage: "Aún no has respondido ningún test."

        })

    );
    return DashboardLayout({

        activePath: "/estudiante/resultados",

        title: "Mis Resultados",

        content: page

    });

}
