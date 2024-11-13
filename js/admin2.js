// Variables para los selectores
const slccionMes = document.getElementById('elegir-mes');
const slccionAño = document.getElementById('elegir-año');
const calendarioFull = document.getElementById('calendario-full');
const tituloMesAño = document.getElementById('tituloMesAño'); // Suponiendo que este elemento existe para el título del mes y año

let mesSeleccionado = new Date().getMonth(); // Inicializa con el mes actual
let añoSeleccionado = new Date().getFullYear(); // Inicializa con el año actual
let filaSemanaActual = null;

// Variables globales
let selecciones = [];
let idReservaSeleccionada = null; // para eliminar ID

// Inicializa los selectores de mes y año
function initializeSelectors() {
    añadirMeses(); // Llenar el selector de meses
    añadirAños();  // Llenar el selector de años

    // Establecer el mes y año actuales como seleccionados automáticamente
    slccionMes.value = mesSeleccionado;  // Selecciona el mes actual
    slccionAño.value = añoSeleccionado;  // Selecciona el año actual

    // Agregar los eventos de cambio para los selectores
    slccionMes.addEventListener('change', () => {
        mesSeleccionado = parseInt(slccionMes.value); // Actualiza el mes seleccionado
        generarCalendario(mesSeleccionado, añoSeleccionado); // Genera el calendario con el nuevo mes
    });

    slccionAño.addEventListener('change', () => {
        añoSeleccionado = parseInt(slccionAño.value); // Actualiza el año seleccionado
        generarCalendario(mesSeleccionado, añoSeleccionado); // Genera el calendario con el nuevo año
    });
}

function añadirMeses() {
    for (let i = 0; i < 12; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = new Date(0, i).toLocaleString('es-ES', { month: 'long' });
        slccionMes.appendChild(option);
    }
    // Establece el valor actual como seleccionado
    slccionMes.value = mesSeleccionado;
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

// Generar el calendario de forma automática al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    slccionMes.value = mesSeleccionado; // Actualiza el mes seleccionado
    slccionAño.value = añoSeleccionado; // Actualiza el año seleccionado
    initializeSelectors(); // Inicializa los selectores de mes y año
    generarCalendario(mesSeleccionado, añoSeleccionado); // Muestra el calendario con el mes y año actuales
});


// Función para agregar los eventos a los selectores de mes y año
function agregarEventos() {
    // Evento cuando cambia el mes
    slccionMes.addEventListener('change', () => {
        mesSeleccionado = parseInt(slccionMes.value); // Actualiza el mes seleccionado
        generarCalendario(mesSeleccionado, añoSeleccionado); // Genera el calendario con el nuevo mes
    });

    // Evento cuando cambia el año
    slccionAño.addEventListener('change', () => {
        añoSeleccionado = parseInt(slccionAño.value); // Actualiza el año seleccionado
        generarCalendario(mesSeleccionado, añoSeleccionado); // Genera el calendario con el nuevo año
    });
}
//OBTENGO LAS FECHAS Y HORAS DE MI BASE DE DATOS-------------------------//////////////////////////////////////////////
async function obtenerReservas() {
    console.log("Iniciando la obtención de datos...");
    try {
        const response = await fetch('../php/obtener_reservas.php'); // Cambia la ruta si es necesario
        if (!response.ok) throw new Error("Error al cargar las reservas");

        const reservas = await response.json(); // [{ fecha: "YYYY-MM-DD", hora_inicio: "HH:MM:SS", hora_fin: "HH:MM:SS" }]

        // Verifica que las reservas tengan el formato esperado
        if (!Array.isArray(reservas)) {
            throw new Error("El formato de las reservas no es válido");
        }

        console.log("Reservas obtenidas de la bd:", reservas); // Agrega esto para verificar los datos

        // Función para generar los intervalos de una hora entre dos horas
        const generarIntervalos = (horaInicio, horaFin) => {
            const intervalos = [];
            let currentHour = new Date(`1970-01-01T${horaInicio}:00`);
            const endHour = new Date(`1970-01-01T${horaFin}:00`);

            while (currentHour < endHour) {
                const start = currentHour.toTimeString().substring(0, 5); // Hora de inicio
                currentHour.setHours(currentHour.getHours() + 1); // Incrementamos una hora
                const end = currentHour.toTimeString().substring(0, 5); // Hora de fin
                intervalos.push(`${start} - ${end}`);
            }

            return intervalos;
        };

// Crear un nuevo formato con hora_inicio - hora_fin y nombre
// const reservasFormateadas = reservas.map(reserva => {
//     if (!reserva.fecha || !reserva.hora_inicio || !reserva.hora_fin || !reserva.nombre) {
//         console.warn("Reserva incompleta, omitiendo:", reserva);
//         return null; // Ignora esta reserva si falta alguna propiedad
//     }

//     // Si la hora de inicio y fin son diferentes, generamos los intervalos de una hora
//     const intervalos = generarIntervalos(reserva.hora_inicio.substring(0, 5), reserva.hora_fin.substring(0, 5));

//     return {
//         fecha: reserva.fecha,
//         nombre: reserva.nombre, // Ahora incluye el nombre en el formato de la reserva
//         horas: intervalos
//     };
// }).filter(reserva => reserva !== null); // Filtra las reservas nulas (por datos incompletos)

// console.log("Reservas formateadas:", reservasFormateadas); // Verifica el formato

// return reservasFormateadas || []; // Asegura que siempre devuelve un array con el formato esperado
// } catch (error) {
// console.error("Error al obtener reservas:", error);
// return []; // Devuelve un array vacío en caso de error
// }
// agregamos para que guarde tambien la id
const reservasFormateadas = reservas.map(reserva => {
    if (!reserva.id || !reserva.fecha || !reserva.hora_inicio || !reserva.hora_fin || !reserva.nombre) {
        console.warn("Reserva incompleta, omitiendo:", reserva);
        return null; // Ignora esta reserva si falta alguna propiedad
    }

    // Generamos los intervalos de una hora entre hora_inicio y hora_fin
    const intervalos = generarIntervalos(reserva.hora_inicio.substring(0, 5), reserva.hora_fin.substring(0, 5));

    return {
        id: reserva.id,           // Incluimos el id en el objeto formateado
        fecha: reserva.fecha,
        nombre: reserva.nombre,    // Ahora incluye el nombre
        horas: intervalos          // Intervalos de horas ocupadas
    };
}).filter(reserva => reserva !== null); // Filtra las reservas nulas (por datos incompletos)

console.log("Reservas formateadas:", reservasFormateadas); // Verifica el formato

return reservasFormateadas || []; // Asegura que siempre devuelve un array con el formato esperado
} catch (error) {
console.error("Error al obtener reservas:", error);
return []; // Devuelve un array vacío en caso de error
}
}

// Generación del calendario
function generarCalendario(selectMes, selectAño) {
    calendarioFull.innerHTML = ''; // Limpia el calendario previo
    const nombreMes = new Date(selectAño, selectMes).toLocaleString('es-ES', { month: 'long', year: 'numeric' });
    tituloMesAño.textContent = nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);

    const primerDiaMes = new Date(selectAño, selectMes, 1).getDay();
    const diasTotalMes = new Date(selectAño, selectMes + 1, 0).getDate();
    const initialOffset = (primerDiaMes + 6) % 7;

    let currentDate = 1;
    const fechaActual = new Date();
    const diaActual = fechaActual.getDate();
    const mesActual = fechaActual.getMonth();
    const añoActual = fechaActual.getFullYear();
    const diaDeLaSemanaActual = fechaActual.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
    const semanaActual = Math.floor((diaActual + primerDiaMes - 1) / 7); // Semana actual (0-5)

    // Generación de filas para el calendario
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

                // Asignar un data-attribute con la fecha completa IMPORTANTEEEEEE 
                celdaDia.dataset.fecha = `${selectAño}-${String(selectMes + 1).padStart(2, '0')}-${String(currentDate).padStart(2, '0')}`;

                // Añadir evento de clic solo para días válidos
                if (dayIndex >= 0 && dayIndex <= 4) { // Lunes a Viernes
                    celdaDia.addEventListener('click', () => {
                        // Verifica si ya hay horas generadas
                        if (celdaDia.querySelector('.hora')) {
                            return; // Si ya hay horas, no generamos más
                        }

                        // Limpia las horas de la fila anterior si es necesario
                        if (filaSemanaActual && filaSemanaActual !== weekRow) {
                            limpiarHorasEnFila(filaSemanaActual);
                            filaSemanaActual.dataset.horasGeneradas = ''; // Resetear el flag
                        }

                        // Genera las horas si no se generaron previamente
                        if (!weekRow.dataset.horasGeneradas) {
                            Array.from(weekRow.children).forEach((celda, index) => {
                                if (index >= 0 && index <= 4 && celda.textContent.trim() !== '') {
                                    crearRangoHoras(currentDate, selectMes, selectAño, celda);
                                }
                            });
                            weekRow.dataset.horasGeneradas = 'true'; // Marca que las horas han sido generadas
                            filaSemanaActual = weekRow; // Actualiza la filaSemanaActual
                        }
                        compararReservasConCalendario(weekRow); // Esto mostrará las coincidencias en la consola
                        // Extraer las fechas y las horas de la fila
                        const diasYHoras = extraerDiaYHoras(weekRow);
                        console.log(diasYHoras); // Ver en la consola las fechas y horas extraídas
                        marcarHorasOcupadas(weekRow);
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

    // Solo generar horas si estamos en el mes y año actuales
    if (selectMes === mesActual && selectAño === añoActual) {
        generarHorasSemanaActual(selectMes, selectAño, semanaActual);
    }
}

// FUNCION PARA EXTRAER DIAS Y HORAS DE LA FILA EN LA QUE SE ENCUENTRA------------------///////////////////////////////
function extraerDiaYHoras(semanaFila) {
    let diasYHoras = {};

    // Recorremos las celdas de la fila (de la celda 0 a la 4, es decir, de lunes a viernes
    Array.from(semanaFila.children).forEach((celda, index) => {
        if (index >= 0 && index <= 4) {  // Solo lunes a viernes
            const fechaCelda = celda.dataset.fecha;  // Extraemos la fecha desde el data-attribute
            if (fechaCelda && celda.querySelector('.hora')) {
                let horas = [];
                // Recorremos todas las horas generadas dentro de la celda
                celda.querySelectorAll('.hora').forEach(horaElemento => {
                    horas.push(horaElemento.textContent);  // Extraemos las horas
                });
                // Almacenamos la fecha y sus horas en el objeto
                diasYHoras[fechaCelda] = horas;
            }
        }
    });

    return diasYHoras;
}

// FUNCION PRA COMPARAR HORAS BASE DE DATOS Y HORAS FILA EN LA QUE SE ECNUENTRA- GUARDO LOS DIAS QUE COINCIDEN: LOS DIAS OCUPADO----------////////
async function compararReservasConCalendario(semanaFila) {
    const reservas = await obtenerReservas();

    const diasYHoras = extraerDiaYHoras(semanaFila);

    let horasOcupadas = {};

    for (const fecha in diasYHoras) {
        const reservasDelDia = reservas.filter(reserva => reserva.fecha === fecha);
        const horasDelCalendario = diasYHoras[fecha];

        reservasDelDia.forEach(reserva => {
            horasDelCalendario.forEach(horaCalendario => {
                if (reserva.horas.includes(horaCalendario)) {
                    // Si la hora está ocupada, almacenamos el nombre de la persona que hizo la reserva
                    if (!horasOcupadas[fecha]) {
                        horasOcupadas[fecha] = [];
                    }

                    // Guardamos la hora ocupada junto con el nombre
                    horasOcupadas[fecha].push({
                        id: reserva.id,  // Asegúrate de incluir el id aquí PARA CONSEGUIR ID
                        hora: horaCalendario,
                        nombre: reserva.nombre  // Incluimos el nombre aquí
                    });
                }
            });
        });
    }

    return horasOcupadas;
}


// FUNCION PARA MARCAR LOS DIAS QUE COINCIDEN EN ROJO Y BLOQUEAR LA PULSAR Y AÑADIRLE LA ID, YA QUE NO LA TIENE, Y ASI ELIMINARLA CON POR ID--------------------//////////////////////////
async function marcarHorasOcupadas(semanaFila) {
    const horasOcupadas = await compararReservasConCalendario(semanaFila);

    Array.from(semanaFila.children).forEach((celda, index) => {
        if (index >= 0 && index <= 4) {  // Solo lunes a viernes
            const fechaCelda = celda.dataset.fecha;  // Extraemos la fecha desde el data-attribute
            if (fechaCelda && horasOcupadas[fechaCelda]) {
                const horasDelCalendario = horasOcupadas[fechaCelda];
                // Recorremos las horas de la celda
                Array.from(celda.querySelectorAll('.hora')).forEach(horaElemento => {
                    const horaCalendario = horaElemento.textContent;
                    // Si la hora de la celda está ocupada
                    const horaOcupada = horasDelCalendario.find(h => h.hora === horaCalendario);
                    if (horaOcupada) {
                        // Cambiamos el estilo para marcarla como ocupada
                        horaElemento.style.backgroundColor = 'red';
                        horaElemento.style.color = 'white';
                        horaElemento.textContent = `${horaCalendario} (Ocupada por ${horaOcupada.nombre})`;  // Mostrar el nombre
                        horaElemento.dataset.id = horaOcupada.id;  // Guarda el id en data-id para ID-----
                        // horaElemento.style.pointerEvents = 'none'; en admin lo quito para poder obtener
                          // Guardar el id en una variable al hacer clic 
                          horaElemento.addEventListener('click', function() {
                            idReservaSeleccionada = horaElemento.dataset.id;  // Guarda el id seleccionado
                            console.log(`Reserva seleccionada ID: ${idReservaSeleccionada}`);
                        });
                    }
                });
            }
        }
    });
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
                if (cellIndex >= 0 && cellIndex <= 4) { // Lunes a Viernes
                    crearRangoHoras(diaCalendario, selectMes, selectAño, cell);
                }
                currentDay.setDate(diaCalendario + 1);
            });
            compararReservasConCalendario(row);
            marcarHorasOcupadas(row); // Llama a la función para marcar en rojo las horas ocupadas
        }
    });
}
// FUNCION PARA CREAR RANGO DE HORAS-----------------------------//////////////////////////////////////////////////
// aqui he eliminado codigo y he modificado tambien, en este caso me guardo selecciones para podder usarlo mas adelante

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

    // Formatear la fecha seleccionada
    const fechaSeleccionada = `${año}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    console.log("Fecha seleccionada: " + fechaSeleccionada);

    horas.forEach(hora => {
        const horaElement = document.createElement('p');
        horaElement.textContent = hora;
        horaElement.classList.add('hora');
        // descativo esto para admin2
        // // Agregar evento de clic a cada hora
        // // Agregar evento de clic a cada hora
        // horaElement.addEventListener('click', () => {
        //     // Obtener la fecha y hora seleccionadas
        //     extraerClick(horaElement);  // Llamamos a la función para extraer la fecha y la hora

        //     // Si la hora ya está seleccionada, la removemos y restauramos el color
        //     if (horaElement.style.backgroundColor === 'blue') {
        //         horaElement.style.backgroundColor = ''; // Restauramos el color original
        //         // estas fechas estan mal:
        //         // console.log("Hora deseleccionada:", { fecha: fechaSeleccionada, hora });
        //     } else {
        //         // Si no está seleccionada, la agregamos y cambiamos el color a azul
        //         horaElement.style.backgroundColor = 'blue';
        //         // estas fechas estan mal, creo m propia funcion EXTRAERCLICK() porque al hacer clcick en la hora me da una fecha que no es la correcta
        //         // console.log("Hora seleccionada:", { fecha: fechaSeleccionada, hora });
        //     }
        // });
        

        celda.appendChild(horaElement);
    });
}
// EXTRAER CON ESTA FUNCION AL HACER CLICK EN UN RANGO DE HORA PARA PANEL ADMIN
// esta funcion me da el resultado por consola
function extraerClick(horaElement) {
    // Obtener la celda <td> que contiene la hora. Suponemos que 'horaElement' es un <p> dentro de un <td>.
    const celda = horaElement.closest('td');  // Encuentra el <td> más cercano al <p> de la hora
    const fechaSeleccionada = celda ? celda.dataset.fecha : '';  // Extraemos la fecha desde el data-attribute de la celda
    
    if (!fechaSeleccionada) {
        console.warn('No se pudo obtener la fecha desde la celda.');
        return;  // Si no se obtiene la fecha, salimos de la función
    }

    const horaSeleccionada = horaElement.textContent;  // Obtenemos la hora del <p class="hora"> clickeado

    // Mostrar la fecha y la hora seleccionada en la consola
    console.log(`Fecha seleccionada BIEN: ${fechaSeleccionada}`);
    console.log(`Hora seleccionada BIEN: ${horaSeleccionada}`);
}

async function compararSeleccionesConReservas() {
    const reservas = await obtenerReservas(); // Obtener las reservas de la base de datos
    selecciones.forEach(({ fecha, hora }) => {
        // Buscar las reservas para esa fecha
        const reservasDelDia = reservas.filter(reserva => reserva.fecha === fecha);
        
        // Verificar si la hora seleccionada coincide con alguna de las reservas
        reservasDelDia.forEach(reserva => {
            // Compara la hora seleccionada con la hora de inicio y fin de la reserva
            if (reserva.hora_inicio === hora || reserva.hora_fin === hora) {
                console.log(`¡Coincidencia encontrada! La hora ${hora} está ocupada para el ${fecha} por ${reserva.nombre}.`);
            } else {
                console.log(`La hora ${hora} está libre para el ${fecha}.`);
            }
        });
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
    // Aquí 'hora' ya es el rango completo como "HH:MM - HH:MM"
    if (!hora.includes(' - ')) {
        console.error("El formato de hora no es válido:", hora);
        return;
    }
    // Divide el rango de horas en inicio y fin
    const [horaInicio, horaFin] = hora.split(' - ');
    // Establece los valores de los inputs con la hora de inicio y fin
    horaInicioInput.value = horaInicio;
    horaFinInput.value = horaFin;
    // Consola para verificar que se guardaron los datos
    console.log("Fecha seleccionada:", fechaSeleccionada);
    console.log("Hora de inicio seleccionada:", horaInicio);
    console.log("Hora de fin seleccionada:", horaFin);
}

// ENVIAR LOS DATOS INTRODUCIDOS EN EL FORMULARIO A LA BASE DE DATOS------------------------------------------/////////////////////////


// POSIBLE ELIMINACION PERO SOLO EN ADMIN2------
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

// FUNCION PARA ELIMINAR CON BOTON RESERVAD ELA BASDE DE DATOS
document.getElementById('eliminarReserva').addEventListener('click', async function() {
    if (!idReservaSeleccionada) {
        alert("Por favor, selecciona una reserva marcada en rojo para eliminar.");
        return;
    }

    const confirmacion = confirm("¿Estás seguro de que deseas eliminar esta reserva?");
    if (!confirmacion) return;

    try {
        const response = await fetch(`../php/eliminar_reserva.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: idReservaSeleccionada })
        });

        const result = await response.json();
        if (result.success) {
            alert("Reserva eliminada exitosamente.");
            // Aquí puedes actualizar la vista para reflejar el cambio sin recargar
            idReservaSeleccionada = null;
        } else {
            alert("Hubo un problema al eliminar la reserva.");
        }
    } catch (error) {
        console.error("Error al intentar eliminar la reserva:", error);
        alert("Error al intentar eliminar la reserva.");
    }
});