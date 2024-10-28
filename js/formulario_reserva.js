// Creacion del modal-------------
//  elementos del DOM
const modal = document.getElementById("calendario-modal");
const elegirFechaBtn = document.getElementById("elegir-fecha");
const closeButton = document.querySelector(".close");

// cuando hacemos click en Elegir fecha boton
elegirFechaBtn.addEventListener("click", () => {
    modal.style.display = "block";
});

//modal se cierra al hacer clic en la "X"
closeButton.addEventListener("click", () => {
    modal.style.display = "none";
});
// FIN Creacion del modal-------------

// Creacion del calendario
const slccionMes = document.getElementById('elegir-mes');
const slccionAño = document.getElementById('elegir-año');
const calendarioFull = document.getElementById('calendario-full');
const horaInicioInput = document.getElementById('hora-inicio-input');
const horaFinInput = document.getElementById('hora-fin-input');

// Inicializa los selectores de mes y año
function initializeSelectors() {
    añadirMeses();
    añadirAños();
}

function añadirMeses() {
    for (let i = 0; i < 12; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = new Date(0, i).toLocaleString('es-ES', { month: 'long' });
        slccionMes.appendChild(option);
    }
}

function añadirAños() {
    const añoActual = new Date().getFullYear();
    for (let i = añoActual - 10; i <= añoActual + 10; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        if (i === añoActual) option.selected = true;
        slccionAño.appendChild(option);
    }
}

// Genera el calendario
functiongenerarCalendario(selectMes, selectAño) {
    calendarioFull.innerHTML = ''; // Limpia el calendario existente

    const primerDiaMes = new Date(selectAño, selectMes, 1).getDay(); // Día de la semana del primer día del mes
    const diasTotalMes = new Date(selectAño, selectMes + 1, 0).getDate(); // Total de días en el mes
    const initialOffset = (primerDiaMes + 6) % 7; // Desplazamiento inicial para alinear el primer día

    let currentDate = 1; // Inicializa la fecha actual

    // Crear filas para el calendario (máximo 6 filas para las semanas)
    for (let weekIndex = 0; weekIndex < 6; weekIndex++) {
        const weekRow = document.createElement('tr'); // Crear una nueva fila para la semana
        // Crear columnas para cada día de la semana
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const celdaDia = document.createElement('td'); // Crear una nueva celda para el día
                        if (weekIndex === 0 && dayIndex < initialOffset) {
                celdaDia.textContent = ''; // Celdas vacías antes del primer día
            } else if (currentDate <= diasTotalMes) {
                               const dayElement = crearCeldasDias(selectMes, selectAño, currentDate, dayIndex);
               
                celdaDia.textContent = dayElement.textContent; 
                currentDate++; // Avanza al siguiente día
            } else {
                celdaDia.textContent = ''; // Celdas vacías después del último día del mes
            }

            weekRow.appendChild(celdaDia); // Añadir la celda a la fila
        }

        calendarioFull.appendChild(weekRow); // Añadir la fila al cuerpo del calendario

        if (currentDate > diasTotalMes) break;
    }
}



function crearCeldasDias(dia, dayOfWeek) {
    constcelda = document.createElement('td'); // Crear la celda del día
   celda.textContent = dia; // Establecer el texto de la celda como la fecha

    // Resalta sábados y domingos
    if (dayOfWeek === 5 || dayOfWeek === 6) {
       celda.classList.add('fin-de-semana'); // Añadir clase para fines de semana
    }

    returncelda; // Retornar la celda completa
}

// actualizar el calendario al cambiar el mes o año
slccionMes.addEventListener('change', () =>generarCalendario(parseInt(slccionMes.value), parseInt(slccionAño.value)));
slccionAño.addEventListener('change', () =>generarCalendario(parseInt(slccionMes.value), parseInt(slccionAño.value)));


// Inicializa la aplicación
initializeSelectors();
generateCalendar(new Date().getMonth(), new Date().getFullYear());

// FIN Creacion del calendario-------------------