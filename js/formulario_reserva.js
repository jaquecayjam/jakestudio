// Creación del modal-------------
// Elementos del DOM
const modal = document.getElementById("calendario-modal");
const elegirFechaBtn = document.getElementById("elegir-fecha");
const closeButton = document.querySelector(".close");
const formReserva = document.getElementById("form-reserva");
// Cuando hacemos clic en Elegir fecha botón
elegirFechaBtn.addEventListener("click", () => {
    modal.style.display = "block";
});

// Modal se cierra al hacer clic en la "X"
closeButton.addEventListener("click", () => {
    modal.style.display = "none";
});
// FIN Creación del modal-------------

// Creación del calendario-------------------
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

function generarCalendario(selectMes, selectAño) {
    calendarioFull.innerHTML = '';
    const nombreMes = new Date(selectAño, selectMes).toLocaleString('es-ES', { month: 'long', year: 'numeric' });
    tituloMesAño.textContent = nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);

    const primerDiaMes = new Date(selectAño, selectMes, 1).getDay();
    const diasTotalMes = new Date(selectAño, selectMes + 1, 0).getDate();
    const initialOffset = (primerDiaMes + 6) % 7;

    let currentDate = 1;

    for (let weekIndex = 0; weekIndex < 6; weekIndex++) {
        const weekRow = document.createElement('tr');

        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const celdaDia = document.createElement('td');

            if (weekIndex === 0 && dayIndex < initialOffset) {
                celdaDia.textContent = '';
            } else if (currentDate <= diasTotalMes) {
                celdaDia.textContent = currentDate;

                if (dayIndex >= 0 && dayIndex <= 4) {
                    const diaSeleccionado = currentDate;
                    const mesSeleccionado = selectMes;
                    const añoSeleccionado = selectAño;

                    const horas = crearRangoHoras(diaSeleccionado, mesSeleccionado, añoSeleccionado);
                    celdaDia.appendChild(horas);
                }
                currentDate++;
            } else {
                celdaDia.textContent = '';
            }

            weekRow.appendChild(celdaDia);
        }

        calendarioFull.appendChild(weekRow);
    }
}

// Crea un rango de horas
function crearRangoHoras(dia, mes, año) {
    const horasContainer = document.createElement('div');

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
        const horaElement = document.createElement('p');
        horaElement.textContent = hora;
        horaElement.classList.add('hora');
        horasContainer.appendChild(horaElement);
    });

    horasContainer.addEventListener('click', (event) => {
        const horaSeleccionada = event.target.textContent;
        if (horaSeleccionada) {
            guardarFechaHoraSeleccionada(dia, mes, año, horaSeleccionada);
        }
    });

    return horasContainer;
}
// FIN Creación del calendario-------------------
// Guarda la fecha y hora seleccionadas en los campos ocultos
function guardarFechaHoraSeleccionada(dia, mes, año, hora) {
    const fechaInput = document.getElementById('fecha');
    const horaInicioInput = document.getElementById('hora_inicio');
    const horaFinInput = document.getElementById('hora_fin');

    const fechaSeleccionada = `${año}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

    fechaInput.value = fechaSeleccionada;

    const [horaInicio, horaFin] = hora.split(' - ');
    horaInicioInput.value = horaInicio;
    horaFinInput.value = horaFin;
}
//utilizo API FECH para enviar los datos sl servidor sin recargar la pagina----------------
formReserva.addEventListener('submit', function (event) {
    event.preventDefault(); // Evita el envío normal del formulario
    // datos de mi formulario
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const correo = document.getElementById('correo').value;
    const fecha = document.getElementById('fecha').value; // La fecha que has guardado
    const horaInicio = document.getElementById('hora_inicio').value; // Hora de inicio
    const horaFin = document.getElementById('hora_fin').value; // Hora de fin

    // creamos un objeto FormData para enviar los datos
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('apellido', apellido);
    formData.append('correo', correo);
    formData.append('fecha', fecha);
    formData.append('hora_inicio', horaInicio);
    formData.append('hora_fin', horaFin);

    // Envio de  los datos al servidor
    fetch('./php/reservas.php', {
        method: 'POST',
        body: formData,
    })
        .then(response => {
            if (response.ok) {
                return response.text(); // Obtener respuesta como texto
            }
            throw new Error('Error al enviar datos'); // Si no está bien, lanza un error
        })
        .then(data => {
            console.log(data); // Aquí puedes ver el mensaje de éxito o error
            alert(data); // Mostrar un mensaje al usuario
        })
        .catch(error => {
            console.error('Error:', error); // Manejar errores
            alert('Error al enviar la solicitud');
        });
});


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
