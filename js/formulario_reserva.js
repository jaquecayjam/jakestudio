// Creación del modal-------------
// Elementos del DOM
const modal = document.getElementById("calendario-modal");
const elegirFechaBtn = document.getElementById("elegir-fecha");
const closeButton = document.querySelector(".close");
const formReserva = document.getElementById("form-reserva");


// Añadiomo variables globales para saber  el mes y año que seleccionamos

let mesSeleccionado = new Date().getMonth(); // Inicializa con el mes actual
let añoSeleccionado = new Date().getFullYear(); // Inicializa con el año actual
let fechaSeleccionadaGlobal = null;
let filaAnterior = null;
let filaSemanaActual = null;

// Cuando hacemos clic en Elegir fecha botón
elegirFechaBtn.addEventListener("click", () => {
    modal.style.display = "block"; // Muestra el modal
    // Al abrir el modal, asegurarse de que los selectores reflejen la fecha actual
    slccionMes.value = mesSeleccionado; // Actualiza el mes seleccionado
    slccionAño.value = añoSeleccionado; // Actualiza el año seleccionado
    generarCalendario(mesSeleccionado, añoSeleccionado); // Genera el calendario con el mes y año actuales
});

// Modal se cierra al hacer clic en la "X"
closeButton.addEventListener("click", () => {
    modal.style.display = "none"; // Oculta el modal
});
// FIN Creación del modal-------------

// Creación del calendario-------------------
const slccionMes = document.getElementById('elegir-mes');
const slccionAño = document.getElementById('elegir-año');
const calendarioFull = document.getElementById('calendario-full');

// Inicializa los selectores de mes y año
function initializeSelectors() {
    añadirMeses(); // Llenar el selector de meses
    añadirAños();  // Llenar el selector de años
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
        if (i === añoActual) option.selected = true; // Marca el año actual como seleccionado
        slccionAño.appendChild(option);
    }
}
// OBTENGO RESERVAS DE LA BASE DE DATOS , me devulve un array-----------------------/////////////////////////
// async function obtenerReservas(mes, año) {
//     try {
//         const response = await fetch(`./php/obtener_reservas.php?mes=${mes + 1}&año=${año}`);
//         if (!response.ok) throw new Error("Error al cargar las reservas");
//         const reservas = await response.json(); // [{fecha: "YYYY-MM-DD", hora_inicio: "HH:MM:SS", hora_fin: "HH:MM:SS"}]

//         // Llama a la función para marcar las horas en rojo en el calendario
//         marcarHorasReservadas(reservas);
//     } catch (error) {
//         console.error("Error al obtener reservas:", error);
//     }
// }
async function obtenerReservas() {
    console.log("Iniciando la obtención de datos...");
    try {
        const response = await fetch('./php/obtener_reservas.php'); // Cambia la ruta si es necesario
        if (!response.ok) throw new Error("Error al cargar las reservas");
        const reservas = await response.json(); // [{ fecha: "YYYY-MM-DD", hora_inicio: "HH:MM:SS", hora_fin: "HH:MM:SS" }]
        console.log("Reservas obtenidasss:", reservas); // Agrega esto para verificar los datos
        return reservas || []; // Asegura que siempre devuelve un array
    } catch (error) {
        console.error("Error al obtener reservas:", error);
        return []; // Devuelve un array vacío en caso de error
    }
}

// MARCAR HORAS RESERVADAS----------------------------------------------/////////////////////////
function marcarHorasReservadas(reservas) {
    reservas.forEach(reserva => {
        // Convierte la fecha de la reserva para buscarla en el calendario
        const fechaReserva = reserva.fecha;
        const horaInicioReserva = reserva.hora_inicio.substring(0, 5); // "13:00" (quitamos los segundos)
        const horaFinReserva = reserva.hora_fin.substring(0, 5); // "17:00"

        // Selecciona todas las celdas de horas en el calendario para esa fecha
        const celdasHoras = document.querySelectorAll(`[data-fecha="${fechaReserva}"] .hora`);

        celdasHoras.forEach(celda => {
            // Obtiene el rango de la hora en el formato "HH:MM - HH:MM"
            const [horaInicio, horaFin] = celda.textContent.split(" - ");

            // Compara si el rango del calendario está dentro del rango de la reserva
            if ((horaInicioReserva <= horaInicio && horaFinReserva > horaInicio) ||
                (horaInicioReserva < horaFin && horaFinReserva >= horaFin)) {

                // Marca en rojo la celda si coincide
                celda.classList.add("reservado");
            }
        });
    });
}



function generarCalendario(selectMes, selectAño) {
    calendarioFull.innerHTML = ''; // Limpia el calendario previo
    const nombreMes = new Date(selectAño, selectMes).toLocaleString('es-ES', { month: 'long', year: 'numeric' });
    tituloMesAño.textContent = nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);

    const primerDiaMes = new Date(selectAño, selectMes, 1).getDay();
    const diasTotalMes = new Date(selectAño, selectMes + 1, 0).getDate();
    const initialOffset = (primerDiaMes + 6) % 7;

    let currentDate = 1;
    const fechaActual = new Date(); // Obtiene la fecha actual IMPORTANTE
    const diaActual = fechaActual.getDate();
    const mesActual = fechaActual.getMonth();
    const añoActual = fechaActual.getFullYear();
    const diaDeLaSemanaActual = fechaActual.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
    // Calcular el índice de la semana actual en el mes
    const semanaActual = Math.floor((diaActual + primerDiaMes - 1) / 7); // Semana actual (0-5)

    // AQUI EMPIEZA LO DURO
    for (let weekIndex = 0; weekIndex < 6; weekIndex++) {
        const weekRow = document.createElement('tr');

        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const celdaDia = document.createElement('td');

            if (weekIndex === 0 && dayIndex < initialOffset) {
                celdaDia.textContent = '';
            } else if (currentDate <= diasTotalMes) {
                const diaElemento = document.createElement('span');
                diaElemento.textContent = currentDate;
                celdaDia.appendChild(diaElemento);

                // Asignar un data-attribute con la fecha completa
                celdaDia.dataset.fecha = `${selectAño}-${String(selectMes + 1).padStart(2, '0')}-${String(currentDate).padStart(2, '0')}`;

                if (dayIndex >= 0 && dayIndex <= 4) {
                    celdaDia.addEventListener('click', () => {
                        if (diaElemento.textContent.trim() !== '') {
                            // Limpia las horas en la fila anterior si existe
                            if (filaSemanaActual && filaSemanaActual !== weekRow) {
                                limpiarHorasEnFila(filaSemanaActual);
                                filaSemanaActual.dataset.horasGeneradas = ''; // Resetear el flag
                            }
                            if (filaAnterior && filaAnterior !== weekRow && filaAnterior !== filaSemanaActual) {
                                limpiarHorasEnFila(filaAnterior);
                                filaAnterior.dataset.horasGeneradas = '';
                            }

                            // si ya hay .hora en mi semana actual evita que se vuelva a generar
                            if (celdaDia.querySelector('.hora')) {
                                // Si ya hay horas, no generamos más
                                return; // Salimos de la función para evitar crear más horas
                            }

                            // Verifica si ya se han generado horas en esta fila
                            if (!weekRow.dataset.horasGeneradas) {
                                // Genera las horas en las celdas de lunes a viernes de esta fila
                                Array.from(weekRow.children).forEach((celda, index) => {
                                    if (index >= 0 && index <= 4 && celda.textContent.trim() !== '') {
                                        crearRangoHoras(currentDate, selectMes, selectAño, celda);
                                    }
                                });

                                // Marca que las horas han sido generadas para esta fila
                                weekRow.dataset.horasGeneradas = 'true';
                                filaAnterior = weekRow; // Actualiza la filaAnterior a la fila actual
                            }
                        }
                    });
                }


                currentDate++;
            } else {
                celdaDia.textContent = '';
            }

            weekRow.appendChild(celdaDia);
        }

        calendarioFull.appendChild(weekRow);
    }
    // con esto evito que se generen en los meses que no corresponde
    if (selectMes === mesActual && selectAño === añoActual) {
        generarHorasSemanaActual(selectMes, selectAño, semanaActual);
    }
    obtenerReservas(selectMes, selectAño);
}

// FUNCION PARA CREAR LAS HORAS EN LA SEMANA ACTUAL --------------------------------/////////////////////////
function generarHorasSemanaActual(selectMes, selectAño, semanaActual) {
    const rows = calendarioFull.querySelectorAll('tr');
    let currentDay = new Date(selectAño, selectMes, 1);

    rows.forEach((row, rowIndex) => {
        if (rowIndex === semanaActual) {
            filaSemanaActual = row; // Guarda la referencia de la semana actual

            Array.from(row.children).forEach((cell, cellIndex) => {
                const diaCalendario = currentDay.getDate();
                if (cellIndex >= 0 && cellIndex <= 4) {
                    crearRangoHoras(diaCalendario, selectMes, selectAño, cell);
                }
                currentDay.setDate(diaCalendario + 1);
            });
        }
    });
}

// Modificación de la función crearRangoHoras para que acepte un contenedor
// async function crearRangoHoras(dia, mes, año, celda) {
//     const horas = [
//         "09:00 - 10:00",
//         "10:00 - 11:00",
//         "11:00 - 12:00",
//         "12:00 - 13:00",
//         "13:00 - 14:00",
//         "14:00 - 15:00",
//         "15:00 - 16:00",
//         "16:00 - 17:00",
//         "17:00 - 18:00"
//     ];

//     // Obtén las reservas del servidor
//     const reservas = await obtenerReservas();
//     const reservasPorFecha = reservas.filter(reserva => reserva.fecha === `${año}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`);

//     horas.forEach(hora => {
//         const horaElement = document.createElement('p');
//         horaElement.textContent = hora;
//         horaElement.classList.add('hora');

//         // Verifica si la hora está ocupada
//         const horaOcupada = reservasPorFecha.some(reserva => {
//             const [horaInicio, horaFin] = [reserva.hora.split(' - ')[0], reserva.hora.split(' - ')[1]];
//             return (horaInicio <= hora && horaFin > hora);
//         });

//         if (horaOcupada) {
//             horaElement.style.color = 'red'; // Cambia el color a rojo si está ocupada
//         }

//         // Agregar evento de clic a cada hora
//         horaElement.addEventListener('click', () => {
//             // Cambia el color de fondo a azul al hacer clic
//             if (horaElement.style.backgroundColor === 'blue') {
//                 horaElement.style.backgroundColor = ''; // Restaura el color original
//             } else {
//                 horaElement.style.backgroundColor = 'blue'; // Cambia a azul
//             }
//             // Aquí puedes añadir la lógica para guardar la fecha y hora seleccionadas
//             const diaCelda = celda.dataset.fecha.split('-');
//             const diaSeleccionado = parseInt(diaCelda[2], 10);
//             const mesSeleccionado = parseInt(diaCelda[1], 10) - 1; // Ajusta porque meses son 0-index
//             const añoSeleccionado = parseInt(diaCelda[0], 10);
//             guardarFechaHoraSeleccionada(diaSeleccionado, mesSeleccionado, añoSeleccionado, hora);
//         });

//         celda.appendChild(horaElement); // Agrega el elemento directamente a la celda
//     });
// }
// FUNCION CREAR RANGOS HORAS-------------------------------/////////////////////////
async function crearRangoHoras(dia, mes, año, celda) {
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

    // Obtén las reservas del servidor
    const reservas = await obtenerReservas();
    if (!Array.isArray(reservas)) {
        console.error("Reservas no es un array:", reservas);
        return; // Sal de la función si reservas no es un array
    }
    // Formatear la fecha para la comparación
    const fechaSeleccionada = `${año}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    console.log("fecha formateado" + fechaSeleccionada);

    // Filtrar las reservas para la fecha actual
    const reservasPorFecha = reservas.filter(reserva => reserva.fecha === fechaSeleccionada);
    horas.forEach(hora => {
        const horaElement = document.createElement('p');
        horaElement.textContent = hora;
        horaElement.classList.add('hora');

        // Extraer la hora de inicio y fin del rango actual
        const [horaInicio, horaFin] = hora.split(' - ');

        // Verifica si la hora está ocupada
        const horaOcupada = reservasPorFecha.some(reserva => {
            // Convertir las horas de reserva a formato HH:MM para comparación
            const reservaInicio = reserva.hora_inicio.substring(0, 5); // Tomar HH:MM
            const reservaFin = reserva.hora_fin.substring(0, 5); // Tomar HH:MM

            // Compara si la hora de inicio o la hora de fin de la reserva colisionan con la hora actual
            return (reservaInicio < horaFin && reservaFin > horaInicio);
        });

        if (horaOcupada) {
            horaElement.style.color = 'red'; // Cambia el color a rojo si está ocupada
        }

        // Agregar evento de clic a cada hora
        horaElement.addEventListener('click', () => {
            if (horaElement.style.backgroundColor === 'blue') {
                horaElement.style.backgroundColor = ''; // Restaura el color original
            } else {
                horaElement.style.backgroundColor = 'blue'; // Cambia a azul
            }
            const [diaSeleccionado, mesSeleccionado, añoSeleccionado] = celda.dataset.fecha.split('-');
            guardarFechaHoraSeleccionada(parseInt(diaSeleccionado, 10), parseInt(mesSeleccionado, 10) - 1, parseInt(añoSeleccionado, 10), hora);
        });

        celda.appendChild(horaElement);
    });
}



// FUNCION LIMPIAR HORAS EN LAS FILAS-----------------------------/////////////////////////
function limpiarHorasEnFila(fila) {
    Array.from(fila.children).forEach(celda => {
        // Elimina todos los elementos de horas dentro de cada celda
        celda.querySelectorAll('.hora').forEach(hora => hora.remove());
    });
}

// FIN Creación del calendario-------------------

// GUARDA FECHA, HORAS RESERVADAS, EN LOS CAMPOS OCULTOS----------------------------/////////////////////////
function guardarFechaHoraSeleccionada(dia, mes, año, hora) {
    const fechaInput = document.getElementById('fecha');
    const horaInicioInput = document.getElementById('hora_inicio');
    const horaFinInput = document.getElementById('hora_fin');

    // Formatea la fecha seleccionada como YYYY-MM-DD
    const fechaSeleccionada = `${año}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    fechaInput.value = fechaSeleccionada;

    // Verifica que el formato de hora sea correcto
    if (!hora.includes(' - ')) {
        console.error("El formato de hora no es válido:", hora);
        return;
    }

    // Divide el rango de horas en inicio y fin
    const [horaInicio, horaFin] = hora.split(' - ');
    horaInicioInput.value = horaInicio;
    horaFinInput.value = horaFin;

    // Consola para verificar que se guardaron los datos
    console.log("Fecha seleccionada:", fechaSeleccionada);
    console.log("Hora de inicio seleccionada:", horaInicio);
    console.log("Hora de fin seleccionada:", horaFin);
}

// ENVIAR LOS DATOS INTRODUCIDOS EN EL FORMULARIO A LA BASE DE DATOS------------------------------------------/////////////////////////
// Utilizo API FETCH para enviar los datos al servidor sin recargar la página----------------
formReserva.addEventListener('submit', function (event) {
    event.preventDefault(); // Evita el envío normal del formulario

    // Datos de mi formulario
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const correo = document.getElementById('correo').value;
    const fecha = document.getElementById('fecha').value; // La fecha que has guardado
    const horaInicio = document.getElementById('hora_inicio').value; // Hora de inicio
    const horaFin = document.getElementById('hora_fin').value; // Hora de fin

    // Creamos un objeto FormData para enviar los datos
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('apellido', apellido);
    formData.append('correo', correo);
    formData.append('fecha', fecha);
    formData.append('hora_inicio', horaInicio);
    formData.append('hora_fin', horaFin);

    // Envío de los datos al servidor
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

// FUNCION PARA MOSTRAR SOLO LA CELDA DEL DIA ACTUAL EN DISPOSITIVOS MOVIL-----------------------/////////////////////////
function mostrarSoloDiaActualMovil() {
    if (!esDispositivoMovil()) return; // Solo aplicamos para móviles

    const fechaActual = new Date();
    const diaActual = fechaActual.getDate();
    const mesActual = fechaActual.getMonth();
    const añoActual = fechaActual.getFullYear();
    
    let celdaDiaActual = null;

    // Busca la celda del día actual en el calendario
    Array.from(calendarioFull.querySelectorAll('td')).forEach(celda => {
        if (celda.dataset.fecha) {
            const [año, mes, dia] = celda.dataset.fecha.split('-').map(Number);
            if (año === añoActual && mes - 1 === mesActual && dia === diaActual) {
                celdaDiaActual = celda;
            }
        }
    });

    // Si se encuentra la celda del día actual, oculta las demás
    if (celdaDiaActual) {
        Array.from(calendarioFull.querySelectorAll('tr')).forEach(row => {
            row.style.display = 'none'; // Oculta todas las filas
        });
        celdaDiaActual.closest('tr').style.display = ''; // Muestra solo la fila con el día actual
    }
}


// Actualizamos esta parte de codigo, ya que el anterio hace que cargara siempre al mes actual, ej:
// al hacer click en un mes difrente al actual,no nos deja interactuar con los dias del mes.

// calendarioFull.addEventListener('click', () => {
//     const hoy = new Date();
//     slccionMes.value = hoy.getMonth(); // Establece el mes actual
//     slccionAño.value = hoy.getFullYear(); // Establece el año actual
//     generarCalendario(hoy.getMonth(), hoy.getFullYear()); // Genera el calendario para la fecha actual
// }
slccionMes.addEventListener('change', (event) => {
    mesSeleccionado = parseInt(event.target.value); // Actualiza el mes seleccionado
    generarCalendario(mesSeleccionado, añoSeleccionado); // Genera el calendario con el mes seleccionado
});

slccionAño.addEventListener('change', (event) => {
    añoSeleccionado = parseInt(event.target.value); // Actualiza el año seleccionado
    generarCalendario(mesSeleccionado, añoSeleccionado); // Genera el calendario con el año seleccionado
});

// Inicializa la aplicación
initializeSelectors(); // Llama a la función para inicializar los select
