// 1. Esperamos a que el navegador termine de cargar todo el HTML
document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // GRÁFICO 1: ALERTAS POR MES (LÍNEAS)
    // ==========================================

    // 2. Buscamos el primer lienzo en el HTML usando su ID "lineChart"
    const ctxLineas = document.getElementById('lineChart');

    // 3. Inicializamos un nuevo gráfico de tipo Chart
    new Chart(ctxLineas, {
        type: 'line', // Le decimos que el diseño sea una línea continua
        data: {
            // Las etiquetas que irán en el eje X (abajo)
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'], 
            datasets: [{
                label: 'Cantidad de Alertas', // Título de la línea
                data: [65, 78, 120, 142, 98, 320], // Los números que dibujarán los puntos
                borderColor: '#f79c1d', // El color naranja característico de tu proyecto
                backgroundColor: 'rgba(247, 156, 29, 0.1)', // Fondo transparente bajo la línea
                tension: 0.3 // Hace que las curvas de la línea se vean suaves y modernas
            }]
        },
        options: {
            responsive: true, // Hace que el gráfico se adapte si achicas la pantalla
            plugins: {
                legend: { display: false } // Ocultamos el cuadro de leyenda para que se vea más limpio
            }
        }
    });


    // ==========================================
    // GRÁFICO 2: ALERTAS POR NIVEL (DONA)
    // ==========================================

    // 4. Buscamos el segundo lienzo en el HTML usando su ID "donutChart"
    const ctxDona = document.getElementById('donutChart');

    // 5. Inicializamos el gráfico circular tipo Dona
    new Chart(ctxDona, {
        type: 'doughnut', // Definimos el tipo "Dona"
        data: {
            // Las categorías que representan cada tajada
            labels: ['Bajo', 'Medio', 'Alto'], 
            datasets: [{
                data: [150, 125, 45], // El total suma 320 (igual a tus tarjetas HTML)
                // Colores para cada sección (Verde para bajo, Amarillo/Naranja para medio, Rojo para alto)
                backgroundColor: ['#2ecc71', '#f1c40f', '#e74c3c'], 
                borderWidth: 2 // Grosor de la línea que separa cada tajada
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom' // Colocamos los letreros guía abajo del círculo
                }
            }
        }
    });

});