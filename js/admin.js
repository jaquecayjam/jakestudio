// Variables para los selectores
const slccionMes = document.getElementById('elegir-mes');
const slccionAño = document.getElementById('elegir-año');
const calendarioFull = document.getElementById('calendario-full');
const tituloMesAño = document.getElementById('tituloMesAño'); // Suponiendo que este elemento existe para el título del mes y año

let mesSeleccionado = new Date().getMonth(); // Inicializa con el mes actual
let añoSeleccionado = new Date().getFullYear(); // Inicializa con el año actual
let filaSemanaActual = null;

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

        console.log("Reservas obtenidas:", reservas); // Agrega esto para verificar los datos

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

        // Crear un nuevo formato con hora_inicio - hora_fin
        const reservasFormateadas = reservas.map(reserva => {
            if (!reserva.fecha || !reserva.hora_inicio || !reserva.hora_fin) {
                console.warn("Reserva incompleta, omitiendo:", reserva);
                return null; // Ignora esta reserva si falta alguna propiedad
            }

            // Si la hora de inicio y fin son diferentes, generamos los intervalos de una hora
            const intervalos = generarIntervalos(reserva.hora_inicio.substring(0, 5), reserva.hora_fin.substring(0, 5));

            return {
                fecha: reserva.fecha,
                horas: intervalos
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

                // Asignar un data-attribute con la fecha completa
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
    // reservas formateadas
    const reservas = await obtenerReservas();

    // 2. Extraer las fechas y horas de la fila del calendario
    const diasYHoras = extraerDiaYHoras(semanaFila);

    // 3. Almacenaremos las horas ocupadas para mostrarlas más tarde
    let horasOcupadas = {};

    // 4. Comparar las fechas y horas
    for (const fecha in diasYHoras) {  // Si existe la fecha en las reservas, comparamos las horas
        const reservasDelDia = reservas.filter(reserva => reserva.fecha === fecha);
        const horasDelCalendario = diasYHoras[fecha];

        reservasDelDia.forEach(reserva => {
            // Comparamos las horas de la reserva con las horas del calendario
            horasDelCalendario.forEach(horaCalendario => {
                // Si la hora de la reserva está dentro del rango del calendario
                if (reserva.horas.includes(horaCalendario)) {
                    console.log(`La reserva para ${fecha} a las ${horaCalendario} ya está ocupada.`);

                    // Almacenamos solo las horas ocupadas
                    if (!horasOcupadas[fecha]) {
                        horasOcupadas[fecha] = [];
                    }
                    horasOcupadas[fecha].push(horaCalendario); // Agrega la hora ocupada
                }
            });
        });
    }

    // 5. Mostrar las horas ocupadas
    console.log("Horas ocupadas:", horasOcupadas);
    return horasOcupadas;  // Devuelve el objeto con las horas ocupadas
}


// FUNCION PARA MARCAR LOS DIAS QUE COINCIDEN EN ROJO Y BLOQUEAR LA PULSAR--------------------//////////////////////////

async function marcarHorasOcupadas(semanaFila) {
    // Espera la promise de la funcion compararReservasConCalendario
    const horasOcupadas = await compararReservasConCalendario(semanaFila);

    Array.from(semanaFila.children).forEach((celda, index) => {
        if (index >= 0 && index <= 4) {  // Solo lunes a viernes
            const fechaCelda = celda.dataset.fecha;  // Extraemos la fecha desde el data-attribute
            if (fechaCelda && horasOcupadas[fechaCelda]) {
                // Si la fecha de la celda está en las horas ocupadas, procedemos a marcarla
                const horasDelCalendario = horasOcupadas[fechaCelda];
                // Recorremos las horas de la celda
                Array.from(celda.querySelectorAll('.hora')).forEach(horaElemento => {
                    const horaCalendario = horaElemento.textContent;
                    // Si la hora de la celda está ocupada, cambiamos el estilo o el contenido
                    if (horasDelCalendario.includes(horaCalendario)) {
                        horaElemento.style.backgroundColor = 'red';
                        horaElemento.style.color = 'white';
                        horaElemento.textContent = `${horaCalendario} (Ocupada)`;
                        horaElemento.style.pointerEvents = 'none';

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

    const fechaSeleccionada = `${año}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    console.log("Fecha formateada: " + fechaSeleccionada);
    // Array para almacenar las horas seleccionadas
    const horasSeleccionadas = [];
    // Crear las horas en el rango
    horas.forEach(hora => {
        const horaElement = document.createElement('p');
        horaElement.textContent = hora;
        horaElement.classList.add('hora');
        // Agregar evento de clic a cada hora
        horaElement.addEventListener('click', () => {
            // Si la hora ya está seleccionada, la removemos del array y restauramos el color
            if (horaElement.style.backgroundColor === 'blue') {
                horaElement.style.backgroundColor = ''; // Color original
                const index = horasSeleccionadas.indexOf(hora);
                if (index > -1) {
                    horasSeleccionadas.splice(index, 1); // Elimina la hora del array
                }
            } else {
                // Si no está seleccionada, la agregamos al array y cambiamos el color a azul
                horaElement.style.backgroundColor = 'blue';
                horasSeleccionadas.push(hora);
            }
            //  Para guardar la fecha y hora seleccionadas
            const diaCelda = celda.dataset.fecha.split('-');
            const diaSeleccionado = parseInt(diaCelda[2], 10);
            const mesSeleccionado = parseInt(diaCelda[1], 10) - 1;
            const añoSeleccionado = parseInt(diaCelda[0], 10);
            guardarFechaHoraSeleccionada(diaSeleccionado, mesSeleccionado, añoSeleccionado, hora);
            // Verificar si hay más de dos horas seleccionadas
            if (horasSeleccionadas.length >= 2) {
                console.log("Más de dos horas seleccionadas:", horasSeleccionadas);
                // Extraer las horas de inicio y fin de cada intervalo
                const horasInicio = horasSeleccionadas.map(hora => hora.split(' - ')[0]); // ejemplo: ["13:00", "14:00", "12:00"]
                const horasFin = horasSeleccionadas.map(hora => hora.split(' - ')[1]); // ejemplo: ["14:00", "15:00", "13:00"]

                // Ordenar las horas de inicio y fin alfabéticamente para encontrar las más tempranas y más tardías
                const horaInicio = horasInicio.sort()[0]; // La más temprana
                const horaFin = horasFin.sort().slice(-1)[0]; // La más tarde
                // esto hay quitarlo mas adelante:
                console.log("Hora de inicio más temprana:", horaInicio);
                console.log("Hora de fin más tardía:", horaFin);

                // Llamada a la función para guardar las horas seleccionadas con la más temprana y más tardía
                guardarFechaHoraSeleccionada(diaSeleccionado, mesSeleccionado, añoSeleccionado, `${horaInicio} - ${horaFin}`);
            }
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
    fetch('../php/reservas.php', {
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
            console.log(data); // Recibo ensaje de éxito o error
            alert(data); // Muestra un mensaje al usuario
        })
        .catch(error => {
            console.error('Error:', error); // Saber/ me informa de los errores
            alert('Error al enviar la solicitud');
        });
});

// FUNCION PARA MOSTRAR SOLO LA CELDA DEL DIA ACTUAL EN DISPOSITIVOS MOVIL-----------------------/////////////////////////
// NO FUNCIONA
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