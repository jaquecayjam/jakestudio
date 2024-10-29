// Creación del modal-------------
// Elementos del DOM
const modal = document.getElementById("calendario-modal");
const elegirFechaBtn = document.getElementById("elegir-fecha");
const closeButton = document.querySelector(".close");

// Cuando hacemos clic en Elegir fecha botón
elegirFechaBtn.addEventListener("click", () => {
    modal.style.display = "block";
});

// Modal se cierra al hacer clic en la "X"
closeButton.addEventListener("click", () => {
    modal.style.display = "none";
});
// FIN Creación del modal-------------

// Creación del calendario
const slccionMes = document.getElementById('elegir-mes');
const slccionAño = document.getElementById('elegir-año');
const calendarioFull = document.getElementById('calendario-full');

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
function generarCalendario(selectMes, selectAño) {
    calendarioFull.innerHTML = ''; 
    const nombreMes = new Date(selectAño, selectMes).toLocaleString('es-ES', { month: 'long', year: 'numeric' });
    tituloMesAño.textContent = nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1); // Capitaliza el primer carácter

    const primerDiaMes = new Date(selectAño, selectMes, 1).getDay(); // Día de la semana del primer día del mes
    const diasTotalMes = new Date(selectAño, selectMes + 1, 0).getDate(); // Total de días en el mes
    const initialOffset = (primerDiaMes + 6) % 7; // Ajusta el día para iniciar desde Lunes

    let currentDate = 1; // Representa el 1 dia del mes

    // Filas para el calendario
    for (let weekIndex = 0; weekIndex < 6; weekIndex++) {
        const weekRow = document.createElement('tr'); // Crear una nueva fila por semana

        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const celdaDia = document.createElement('td'); // Crear celda para el día

            // Rellenar las celdas weekIndex===0, representa si estamos en la pruemra semana
            if (weekIndex === 0 && dayIndex < initialOffset) {
                celdaDia.textContent = ''; // Celdas vacías antes del primer día
            } else if (currentDate <= diasTotalMes) {
                celdaDia.textContent = currentDate; // Establece el texto de la celda como la fecha

                // Solo agregar horas de Lunes a Viernes
                if (dayIndex >= 0 && dayIndex <= 4) { // 0 es Lunes y 4 es Viernes
                    const horas = crearRangoHoras(); // Crea el rango de horas
                    celdaDia.appendChild(horas); // Agrega el rango de horas a la celda
                }
                currentDate++; // Avanza al siguiente día
            } else {
                celdaDia.textContent = ''; // Celdas vacías después del último día del mes
            }

            weekRow.appendChild(celdaDia); // Añadir la celda a la fila
        }

        calendarioFull.appendChild(weekRow); // Añadir la fila al cuerpo del calendario
    }
}

// Crea un rango de horas
function crearRangoHoras() {
    const horasContainer = document.createElement('div'); // Crear un contenedor para las horas

    // Definición de horas (09:00 a 18:00)
    const horas = [
        "09:00 - 10:00",
        "10:00 - 11:00",
        "11:00 - 12:00",
        "12:00 - 13:00",
        "13:00 - 14:00",
        "14:00 - 15:00",
        "15:00 - 16:00",
        "16:00 - 17:00",
        "17:00 - 18:00"
    ];

    horas.forEach(hora => {
        const horaElement = document.createElement('p'); // Crear un elemento para cada hora
        horaElement.textContent = hora; // Establecer el texto de la hora
        horaElement.classList.add('hora'); // Clase CSS

        horasContainer.appendChild(horaElement); // Añadir el elemento de hora al contenedor
    });

    return horasContainer; // Retornar el contenedor con las horas
}

// Actualizar el calendario al cambiar el mes o año
slccionMes.addEventListener('change', () => generarCalendario(parseInt(slccionMes.value), parseInt(slccionAño.value)));
slccionAño.addEventListener('change', () => generarCalendario(parseInt(slccionMes.value), parseInt(slccionAño.value)));

// calendario aparece en el dia, mes, año actual
calendarioFull.addEventListener('click', () => {
    const hoy = new Date();
    slccionMes.value = hoy.getMonth(); // Establece el mes actual
    slccionAño.value = hoy.getFullYear(); // Establece el año actual
    generarCalendario(hoy.getMonth(), hoy.getFullYear()); // Genera el calendario para la fecha actual
});

// Inicializa la aplicación
initializeSelectors();
// el selector de mes aparece según el mes y año actual:
const hoy = new Date(); // me crea un objeto, con la fecha actual
slccionMes.value = hoy.getMonth(); // Selecciona el mes actual
slccionAño.value = hoy.getFullYear(); // Selecciona el año actual
generarCalendario(new Date().getMonth(), new Date().getFullYear());
