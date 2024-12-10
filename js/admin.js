
// Variables para los selectores
const slccionMes = document.getElementById('elegir-mes');
const slccionAño = document.getElementById('elegir-año');
const calendarioFull = document.getElementById('calendario-full');
const tituloMesAño = document.getElementById('tituloMesAño'); // Suponiendo que este elemento existe para el título del mes y año
// const para el formularioReserva
const formReserva = document.getElementById("formularioReserva");
const formModiReserva = document.getElementById("formularioModificarReserva");

let mesSeleccionado = new Date().getMonth(); // Inicializa con el mes actual
let añoSeleccionado = new Date().getFullYear(); // Inicializa con el año actual
let filaSemanaActual = null;

// Variables globales
let selecciones = [];
// INMPORATEN PARA QUE SE PINTEN LAS HORAS DE AZUL
// const horasSeleccionadas = [];
let horasSeleccionadas = [];
// varibles para almacenar en la funcion amrcarhorasocupadas--------------
let idReservaSeleccionada = null; // para eliminar ID
let nombreReservaSeleccionada = null;
let horaInicioSeleccionada = null;
let horaFinSeleccionada = null;
// para modificar no reciben nada aun sin uso
let apellidoReservaSeleccionada = null;
let correoReservaSeleccionada = null;
let fechaReservaSeleccionada = null;


// VARIBLAE PARA HABILITAR HORAS ROJAS Y DEHABILITARLAS LLAMADA EN 
// TOGGLEhORASrOJAS EN BOTON AÑADIR RESERVAS, BOTON CANCELAR,MARCARHORASOCUPADAS Y EN DONDE LE AÑADO EL EVENTO CLIC A LAS CELDAS (GENERARCALENDARIO)
let deshabilitarHorasRojas = false; // Por defecto, las horas rojas están habilitadas




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
                horas: intervalos,          // Intervalos de horas ocupadas
                hora_inicio: reserva.hora_inicio, // Incluimos la hora de inicio
                hora_fin: reserva.hora_fin       // Incluimos la hora de fin
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
                        // Llama a toggleHorasRojas para aplicar el estado de deshabilitación según la bandera IMPORTANTANTE!!
                         toggleHorasRojas();
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
                        nombre: reserva.nombre,  // Incluimos el nombre aquí
                        hora_inicio: reserva.hora_inicio, // Incluimos la hora de inicio
                        hora_fin: reserva.hora_fin       // Incluimos la hora de fin
                    });
                }
            });
        });
    }

    return horasOcupadas;
}
// FUNCINOA BANDERAS----------------------//////////////
function toggleHorasRojas() {
    document.querySelectorAll('.hora').forEach(horaElement => {
        if (horaElement.style.backgroundColor === 'red') {
            horaElement.style.pointerEvents = deshabilitarHorasRojas ? 'none' : 'auto';
        }
    });
}

// FUNCION PARA MARCAR LOS DIAS QUE COINCIDEN EN ROJO Y  AL PULSAR Y AÑADIRLE LA ID, YA QUE NO LA TIENE, Y ASI ELIMINARLA CON POR ID--------------------//////////////////////////
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
                        horaElemento.dataset.nombre = horaOcupada.nombre; //GUARDA NOMBRE??---------------
                        horaElemento.dataset.hora_inicio = horaOcupada.hora_inicio; //GUARDA HORA INICIO??---------------
                        horaElemento.dataset.hora_fin = horaOcupada.hora_fin; //GUARDA HORA FIN??---------------
                        // horaElemento.style.pointerEvents = 'none'; en admin lo quito para poder obtener
                        // Guardar el id en una variable al hacer clic ----------------
                        horaElemento.addEventListener('click', function () {
                            //     idReservaSeleccionada = horaElemento.dataset.id;  // Guarda el id seleccionado---R
                            //      console.log(`NOMBRE ID seleccionada : ${idReservaSeleccionada}`);
                            //     // INTENTO GUARDAR NOMBRE----------------
                            //    nombreReservaSeleccionada = horaElemento.dataset.nombre;  // Guarda el NOMBRE seleccionado-------------R
                            //     console.log(`NOMBRE Reserva seleccionada : ${nombreReservaSeleccionada}`);
                            //     // INTENTO GUARDA HORA INICIO------------------ NO FUNCIONA
                            //    horaInicioSeleccionada = horaElemento.dataset.hora_inicio;  // Guarda HORA INICIO seleccionado-------------R
                            //     console.log(`HORA INICIO Reserva seleccionada : ${horaInicioSeleccionada}`);
                            //     // INTENTO GUARDAR HORA FIN---------------------
                            //    horaFinSeleccionada = horaElemento.dataset.hora_fin;  // Guarda HORA FIN seleccionado-------------R
                            //     console.log(`HORA FIN Reserva seleccionada : ${horaFinSeleccionada}`);
                            //     console.log('-------------------------');

                            // Verifica si ya estaba seleccionado
                            console.log('ESTO ES DE MARCARENROJO-------//////////------------------');
                            if (idReservaSeleccionada === horaElemento.dataset.id) {
                                // Deselecciona los datos
                                idReservaSeleccionada = null;
                                nombreReservaSeleccionada = null;
                                horaInicioSeleccionada = null;
                                horaFinSeleccionada = null;
                                console.log('Elemento deseleccionado');
                            } else {
                                // Selecciona los nuevos datos
                                idReservaSeleccionada = horaElemento.dataset.id;
                                nombreReservaSeleccionada = horaElemento.dataset.nombre;
                                horaInicioSeleccionada = horaElemento.dataset.hora_inicio;
                                horaFinSeleccionada = horaElemento.dataset.hora_fin;

                                console.log(`NOMBRE ID seleccionada : ${idReservaSeleccionada}`);
                                console.log(`NOMBRE Reserva seleccionada : ${nombreReservaSeleccionada}`);
                                console.log(`HORA INICIO Reserva seleccionada : ${horaInicioSeleccionada}`);
                                console.log(`HORA FIN Reserva seleccionada : ${horaFinSeleccionada}`);
                            }

                            console.log('ESTO ES DE MARCARENROJO-----------///////////--------------');







                        });
                    }
                });
            }
        }
    });
      // Aplicar el estado global de las horas rojas IMPORTANTE!!
    toggleHorasRojas();
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


// FUNCION PARA VERIFICAR SI HAY HORAS ENTREMEDIAS DE LAS HORAS SELECCOINADA----------------------
// Función para comprobar si hay alguna hora ocupada (con fondo rojo) FUNCIONA-----------------


// COMPROBAR HORAS ENTREMEDIAS-----------COMPRUEBA SI HAY ALGUNA HORA RESERVADA CON SU COLOR ROJO ----------------------//////////

function verificarHorasInterrumpidas(celda) {
    // Obtener todas las horas dentro de la celda
    const horas = Array.from(celda.querySelectorAll('p.hora'));

    // Buscar todos los índices de las horas seleccionadas (azules)
    const indicesAzules = [];

    for (let i = 0; i < horas.length; i++) {
        // Comprobar si el fondo de la hora es azul
        if (getComputedStyle(horas[i]).backgroundColor === 'rgb(0, 0, 255)') {
            indicesAzules.push(i); // Si es azul, agregar el índice al array
        }
    }

    // Verificar si hay interrupciones (horas rojas) entre las horas seleccionadas
    for (let i = 0; i < indicesAzules.length - 1; i++) {
        const start = indicesAzules[i];
        const end = indicesAzules[i + 1];

        // Buscar horas rojas entre las horas seleccionadas
        for (let j = start + 1; j < end; j++) {
            if (getComputedStyle(horas[j]).backgroundColor === 'rgb(255, 0, 0)') { // Rojo
                console.log("¡Se encontró una hora ocupada entre las seleccionadas!");
                alert("No puedes seleccionar un rango con horas ocupadas (rojas) intermedias.");
                return true; // Bloquear acción si hay una hora roja en el medio
            }
        }
    }

    // Si no hay interrupciones, pintar las horas intermedias entre las horas azules
    for (let i = 0; i < indicesAzules.length - 1; i++) {
        const start = indicesAzules[i];
        const end = indicesAzules[i + 1];

        // Pintar de azul las horas intermedias
        for (let j = start + 1; j < end; j++) {
            const horaElement = horas[j];
            horaElement.style.backgroundColor = 'blue';
            horaElement.style.color = 'white'; // Mejorar visibilidad

            // Agregar la hora seleccionada al array (si no está ya en él)
            const horaText = horaElement.textContent;
            if (!horasSeleccionadas.includes(horaText)) {
                horasSeleccionadas.push(horaText);
            }
        }
    }

    console.log("Horas intermedias seleccionadas y pintadas correctamente.");
    return false; // No hay problemas, todo ha ido bien
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

horas.forEach(hora => {
    const horaElement = document.createElement('p');
    horaElement.textContent = hora;
    horaElement.classList.add('hora');

    horaElement.addEventListener('click', () => {
        console.log("ESTOS ES DE CREAR RANGOS HORAS---***********--------");

        // Si la hora ya está seleccionada, la removemos del array y restauramos el color
        if (horaElement.style.backgroundColor === 'blue') {
            horaElement.style.backgroundColor = ''; // Color original
            horaElement.style.color = '';
        } else {
            // Si no está seleccionada, la agregamos y cambiamos el color a azul
            horaElement.style.backgroundColor = 'blue';
            horaElement.style.color = 'white'; // Mejor visibilidad
        }

        // Obtener horas seleccionadas dinámicamente
        const horasSeleccionadas = Array.from(
            document.querySelectorAll('p.hora[style="background-color: blue; color: white;"]')
        );

        // Verificar si hay al menos dos horas seleccionadas
        if (horasSeleccionadas.length >= 2) {
            // Verificar si las horas seleccionadas tienen interrumpidas
            const interrumpidas = verificarHorasInterrumpidas(celda);

            if (interrumpidas) {
                // Si se encontraron horas interrumpidas, restauramos el estilo de las horas seleccionadas
                horasSeleccionadas.forEach((horaSel) => {
                    // Recorrer todos los elementos p.hora y buscar el que contiene el texto correspondiente
                    const horaElements = celda.querySelectorAll('p.hora');
                    horaElements.forEach((horaElement) => {
                        if (horaElement.textContent === horaSel.textContent) {
                            horaElement.style.backgroundColor = ''; // Restaurar color original
                            horaElement.style.color = ''; // Restaurar color original
                        }
                    });
                });

                // Limpiar el array de horas seleccionadas
                horasSeleccionadas.length = 0;
                console.log("Selección de horas interrumpidas cancelada.");

                // Eliminar la información en formato texto
                eliminarFechaHoraSeleccionada();
                return; // Detener el proceso si hay interrumpidas
            }
        }

        // Verificar si hay al menos una hora seleccionada
        if (horasSeleccionadas.length > 0) {
            const fechas = [];
            const rangos = [];

            horasSeleccionadas.forEach(horaSel => {
                // Obtener el td padre de cada hora seleccionada
                const tdPadre = horaSel.closest('td');
                if (tdPadre && tdPadre.dataset.fecha) {
                    const fecha = tdPadre.dataset.fecha;
                    if (!fechas.includes(fecha)) {
                        fechas.push(fecha); // Evitar duplicados
                    }

                    rangos.push(horaSel.textContent); // Agregar el rango de la hora
                }
            });

            // Encontrar las horas más tempranas y tardías dentro del rango
            const horasInicio = rangos.map(h => h.split(' - ')[0]); // Ej: ["13:00", "14:00"]
            const horasFin = rangos.map(h => h.split(' - ')[1]);   // Ej: ["14:00", "15:00"]

            const horaInicio = horasInicio.sort()[0]; // La más temprana
            const horaFin = horasFin.sort().slice(-1)[0]; // La más tardía

            console.log("Hora de inicio más temprana:", horaInicio);
            console.log("Hora de fin más tardía:", horaFin);
            console.log("Fechas seleccionadas:", fechas);

            // Guardar las fechas y rangos seleccionados
            fechas.forEach(fecha => {
       // Descomponer la fecha en año, mes y día
    const partesFecha = fecha.split('-'); // Esto devuelve un array con [año, mes, día]
    
    const añoSeleccionado = Number(partesFecha[0]); // Convertir el año a número
    const mesSeleccionado = Number(partesFecha[1]); // Convertir el mes a número
    const diaSeleccionado = Number(partesFecha[2]); // Convertir el día a número
    
    // Llamar a la función para guardar la fecha con el formato adecuado
    // Restamos 1 al mes porque en JavaScript los meses son de 0 a 11
    guardarFechaHoraSeleccionada(diaSeleccionado, mesSeleccionado - 1, añoSeleccionado, `${horaInicio} - ${horaFin}`);

            });
        } else {
            // Llamada para eliminar los campos si no hay horas seleccionadas
            eliminarFechaHoraSeleccionada();
            console.log("No hay horas seleccionadas.---------------------------");
        }
    });

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

// GUARDA FECHA, HORAS RESERVADAS, EN LOS CAMPOS OCULTOS AÑADIR RESERVA----------------------------/////////////////////////
function guardarFechaHoraSeleccionada(dia, mes, año, hora) {
    const fechaInput = document.getElementById('fecha');
    const horaInicioInput = document.getElementById('hora_inicio');
    const horaFinInput = document.getElementById('hora_fin');
    // Campos visibles para mostrar en el formulario MODIFICAR:------------------
    const fechaInputVisible = document.getElementById('fechaModificar');
    const horaInicioInputVisible = document.getElementById('hora_inicioModificar');
    const horaFinInputVisible = document.getElementById('hora_finModificar');
    // Formatea la fecha seleccionada como YYYY-MM-DD
    const fechaSeleccionada = `${año}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    fechaInput.value = fechaSeleccionada;
    fechaInputVisible.value = fechaSeleccionada;
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
    // Establece los valores de los campos visibles formulario MODIFICAR:------------------
    horaInicioInputVisible.value = horaInicio;
    horaFinInputVisible.value = horaFin;
    // Consola para verificar que se guardaron los datos
    console.log("ESTOS ES DE GAUARDARFECHAHOAS-----------")
    console.log("Fecha seleccionada:", fechaSeleccionada);
    console.log("Hora de inicio seleccionada:", horaInicio);
    console.log("Hora de fin seleccionada:", horaFin);
    console.log("ESTOS ES DE GAUARDARFECHAHOAS-----------")
    // mostrar fecha y horas seleccionada:
    infoSeleccionada.textContent = `Fecha seleccionada: ${fechaSeleccionada} | Hora de inicio: ${horaInicio} | Hora de fin: ${horaFin}`;

}
// FUNICON PARA ELIMINAR LA INFORMACION ALMACENADA EN LOS CAMPOS FEHCA HORA INICIO HORA FIN:----------------------/////////////////////
function eliminarFechaHoraSeleccionada() {
    // Obtén los elementos de los inputs
    const fechaInput = document.getElementById('fecha');
    const horaInicioInput = document.getElementById('hora_inicio');
    const horaFinInput = document.getElementById('hora_fin');

    // Campos visibles para mostrar en el formulario MODIFICAR:
    const fechaInputVisible = document.getElementById('fechaModificar');
    const horaInicioInputVisible = document.getElementById('hora_inicioModificar');
    const horaFinInputVisible = document.getElementById('hora_finModificar');

    // Restaura los valores de los inputs a su estado original (vacíos o valores predeterminados)
    fechaInput.value = '';
    horaInicioInput.value = '';
    horaFinInput.value = '';

    // Restaurar los valores en los campos visibles para el formulario MODIFICAR
    fechaInputVisible.value = '';
    horaInicioInputVisible.value = '';
    horaFinInputVisible.value = '';
    // Limpiar la información visible en `infoSeleccionada` ----------------------------
    const infoSeleccionada = document.getElementById('infoSeleccionada'); // Asegúrate de que el ID coincide
    if (infoSeleccionada) {
        infoSeleccionada.textContent = ''; // O establece un mensaje predeterminado si es necesario
    }

    // Consola para verificar que los valores fueron eliminados
    console.log("Los valores de fecha y hora han sido eliminados.");
    console.log("Fecha eliminada:", fechaInput.value);
    console.log("Hora de inicio eliminada:", horaInicioInput.value);
    console.log("Hora de fin eliminada:", horaFinInput.value);
}
// FUNCION PARA AÑADIR CON BOTON RESERVAD EN LA BASDE DE DATOS------------///////////
//AÑADIR RESERVA AL HACER CLICK, MUESTRA EL FORMULARIO:
document.getElementById('añadirReserva').addEventListener('click', function () {
    // ocultar formulario añadir
    ocultarFormulario();
    document.getElementById('formularioReserva').style.display = 'block';
    //     //REVIASARRRRRR
    //  Deshabilitar los clics en las horas ocupadas
    // document.querySelectorAll('.hora').forEach(horaElement => {
    //     // Verificar si el fondo de la hora es rojo (ocupada)
    //     if (horaElement.style.backgroundColor === 'red') {
    //         // Deshabilitar el clic sobre este elemento
    //         horaElement.style.pointerEvents = 'none';
    //         // horaElement.style.opacity = '0.5'; // Opcional: cambiar la opacidad para indicar que está deshabilitado
    //     }
    // });


        // Actualizar la bandera para deshabilitar horas rojas
    deshabilitarHorasRojas = true;

    // Deshabilitar las horas rojas IMPORTANTE!!!
    toggleHorasRojas();
});
// ENVIAR DATOS A LA BASE DE DATOS---------------------------------------------------------------////////////////////////////////////////////////////////-
// ENVIAR LOS DATOS INTRODUCIDOS EN EL FORMULARIO AÑADIR RESERVA A LA BASE DE DATOS----
// Utilizo API FETCH para enviar los datos al servidor sin recargar la página----------------ME QUEDO AQUIIIIIII REVISAR
formReserva.addEventListener('submit', function (event) {
    event.preventDefault(); // Evita el envío normal del formulario

    // Datos de mi formulario
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const correo = document.getElementById('correo').value;
    const fecha = document.getElementById('fecha').value; // La fecha que has guardado
    const horaInicio = document.getElementById('hora_inicio').value; // Hora de inicio
    const horaFin = document.getElementById('hora_fin').value; // Hora de fin
    //  VERIFICA QUE LOS CAMPOS DE HORA INICO Y FIN TIENNE UN HORA SLEECIONADA--------IMPORTANTE
    if (!horaInicio || !horaFin) {
        // Si alguna de las horas no está seleccionada, mostramos una alerta
        alert('Por favor, selecciona una hora de inicio y una hora de fin');
        return; // Evita el envío del formulario
    }
    // Creamos un objeto FormData para enviar los datos
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('apellido', apellido);
    formData.append('correo', correo);
    formData.append('fecha', fecha);
    formData.append('hora_inicio', horaInicio);
    formData.append('hora_fin', horaFin);

    // Envío de los datos al servidor
    //  ahora uso el documento enviar_correo en vez de reservas.php para alamcenar y hacer la llamada a mi php email_config
    fetch('../php/enviar_correo.php', {
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
            // Recargar la página después de mostrar el mensaje
            window.location.reload();
        })
        .catch(error => {
            console.error('Error:', error); // Manejar errores
            alert('Error al enviar la solicitud');
        });
});


// Función para el botón de "Cancelar" (para el nuevo botón)

document.getElementById('cancelarR').addEventListener('click', function () {
    console.log('Cancelando la selección de horas.');

    // Restaurar horas seleccionadas a su estado original
    const horasSeleccionadasElementos = document.querySelectorAll('.hora[style="background-color: blue; color: white;"]');
    horasSeleccionadasElementos.forEach(horaElemento => {
        horaElemento.style.backgroundColor = ''; // Restaurar color original
        horaElemento.style.color = '';          // Restaurar texto original
    });

    // Actualizar la bandera para habilitar horas rojas
    deshabilitarHorasRojas = false;

    // Habilitar las horas rojas IMPORTANTE!!
    toggleHorasRojas();

    // Ocultar el formulario y restablecerlo
    const formulario = document.getElementById('formularioReserva');
    if (formulario) {
        formulario.style.display = 'none';
        formulario.reset();
    }

    // Limpiar variables globales si es necesario
    idReservaSeleccionada = null;
    nombreReservaSeleccionada = null;
    horaInicioSeleccionada = null;
    horaFinSeleccionada = null;
    eliminarFechaHoraSeleccionada();

    console.log('Formulario cancelado y estado de clic restaurado.');
});


// POSIBLE ELIMINACION PERO SOLO EN ADMIN2------
slccionMes.addEventListener('change', (event) => {
    mesSeleccionado = parseInt(event.target.value); // Actualiza el mes seleccionado
    generarCalendario(mesSeleccionado, añoSeleccionado); // Genera el calendario con el mes seleccionado
});

slccionAño.addEventListener('change', (event) => {
    añoSeleccionado = parseInt(event.target.value); // Actualiza el año seleccionado
    generarCalendario(mesSeleccionado, añoSeleccionado); // Genera el calendario con el año seleccionado
});

// Inicializa la aplicacióN TO FIX: HACE QUE LOS SELECTORES SE DUPLIQUEN ASI QUE HAY QUE DESCATIVARLO
// FIXED: COMENTAR LA LLAMADA A LA FUNCION
//initializeSelectors(); // Llama a la función para inicializar los select
// FUNCION PARA OCULTAR LOS FORMULARIOS DE AÑADIR O MODIFICAR--------------------------//////////
function ocultarFormulario() {
    document.getElementById('formularioReserva').style.display = 'none';
    document.getElementById('formularioModificarReserva').style.display = 'none';
}

// FUNCION PARA ELIMINAR CON BOTON RESERVAD ELA BASDE DE DATOS------------/////////////
document.getElementById('eliminarReserva').addEventListener('click', async function () {
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
            // Recargar la página después de mostrar el mensaje
            window.location.reload();
        } else {
            alert("Hubo un problema al eliminar la reserva.");
        }
    } catch (error) {
        console.error("Error al intentar eliminar la reserva:", error);
        alert("Error al intentar eliminar la reserva.");
    }
});

// FUNCION PARA MODIFICAR RESERVA---------------------////////////

// Función para mostrar el formulario con los datos de la reserva seleccionada
document.getElementById('modificarReserva').addEventListener('click', function () {
    if (!idReservaSeleccionada) {
        alert("Por favor, selecciona una reserva marcada en rojo para modificar.");
        return;
    }

    // Llamar a la función para obtener los datos de la reserva seleccionada desde el servidor
    obtenerReservaPorId(idReservaSeleccionada); // Cambiar esta función por la que ya hemos creado
});

// Función para obtener los detalles de la reserva por su ID
async function obtenerReservaPorId(idReserva) {
    console.log("Iniciando la obtención de datos para la reserva con ID:", idReserva);

    try {
        const response = await fetch('../php/obtener_reservas_id.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: idReserva })  // Enviamos el ID de la reserva seleccionada
        });

        if (!response.ok) throw new Error("Error al obtener los detalles de la reserva");

        const reserva = await response.json();

        if (reserva.error) {
            throw new Error(reserva.error);
        }

        console.log("Reserva obtenida para modificación:", reserva);


        // Actualizar campo oculto con la hora de inicio de la reserva anterior
        document.getElementById('horaRanterior').value = reserva.hora_inicio;
        document.getElementById('horafinRanterior').value = reserva.hora_fin;
        document.getElementById('fechaRanterior').value = reserva.fecha;



        // Mostrar el formulario de modificación
        ocultarFormulario();  // Asegúrate de que esta función esté definida
        document.getElementById('formularioModificarReserva').style.display = 'block';

        // Actualizar la información de la reserva seleccionada en el contenedor
        const infoReserva = document.getElementById('infoReservaSeleccionada');
        infoReserva.style.display = 'block';
        infoReserva.textContent = `Datos Actuales en la BD: ${reserva.nombre}  ${reserva.fecha} - ${reserva.hora_inicio} - ${reserva.hora_fin}`;

        // Rellenar los campos con los valores de la reserva seleccionada
        document.getElementById('idReservaInput').value = reserva.id;
        document.getElementById('nombreModificar').value = reserva.nombre;
        document.getElementById('apellidoModificar').value = reserva.apellido;  // Asegúrate de que esta variable esté definida
        document.getElementById('correoModificar').value = reserva.correo;  // Asegúrate de que esta variable esté definida
        // document.getElementById('fechaModificar').value = reserva.fecha;  // Asegúrate de que esta variable esté definida

        // document.getElementById('hora_finModificar').value = reserva.hora_fin;

    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al obtener los detalles de la reserva.');
    }
}

// Función para enviar los datos modificados al servidor
document.getElementById('formularioModificarReserva').addEventListener('submit', function (event) {
    event.preventDefault();  // Evita el envío normal del formulario


    // Actualizar el campo oculto con la hora de inicio de la reserva anterior
    // document.getElementById('horaRanterior').value = reserva.hora_inicio;

    const formData = new FormData();

    // Recogemos los datos solo si han sido modificados
    const nombre = document.getElementById('nombreModificar').value;
    const apellido = document.getElementById('apellidoModificar').value;
    const correo = document.getElementById('correoModificar').value;
    const fecha = document.getElementById('fechaModificar').value;
    const horaInicio = document.getElementById('hora_inicioModificar').value;
    const horaFin = document.getElementById('hora_finModificar').value;

    // Añadimos solo los campos modificados
    if (nombre !== "") formData.append('nombre', nombre);
    if (apellido !== "") formData.append('apellido', apellido);
    if (correo !== "") formData.append('correo', correo);
    if (fecha !== "") formData.append('fecha', fecha);
    if (horaInicio !== "") formData.append('hora_inicio', horaInicio);
    if (horaFin !== "") formData.append('hora_fin', horaFin);

    // Enviar el ID de la reserva
    formData.append('id', document.getElementById('idReservaInput').value);
    //  enviar el valor del campo oculto 
    formData.append('hora_ranterior', document.getElementById('horaRanterior').value);
    //  enviar el valor del campo oculto 
    formData.append('horafin_ranterior', document.getElementById('horafinRanterior').value);
    // enviar el valor del campo oculto 
    formData.append('fecha_Ranterior', document.getElementById('fechaRanterior').value);

    // Enviar los datos al servidor
    fetch('../php/modificar_reserva_dos.php', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.text())
        .then(data => {
            console.log(data);  // Puedes ver la respuesta del servidor
            alert(data);  // Mostrar mensaje de éxito o error
            // Recargar la página después de mostrar el mensaje
            window.location.reload();
        })
        .catch(error => {
            console.error('Error:', error);  // Manejar errores
            alert('Error al enviar la solicitud');
        });
});

// esyto vaaa
document.getElementById('cancelarReserva').addEventListener('click', async function () {
    console.log('Cancelando la selección de horas.');

    // Obtener todas las celdas que contienen las horas en la tabla
    const horas = document.querySelectorAll('#calendarioFull .hora');

    // Iterar sobre cada hora para restaurar su estado original
    horas.forEach(horaElemento => {
        // Si el estilo de fondo es azul (seleccionado) y contiene "Ocupada por"
        if (horaElemento.style.backgroundColor === 'blue' && horaElemento.textContent.includes('Ocupada por')) {
            // Restaurar al fondo rojo (ocupado)
            horaElemento.style.backgroundColor = 'red';
            horaElemento.style.color = 'white';
        }
        // Si el estilo de fondo es azul (seleccionado) y no está ocupada
        else if (horaElemento.style.backgroundColor === 'blue') {
            // Restaurar al fondo original (sin fondo)
            horaElemento.style.backgroundColor = '';
            horaElemento.style.color = '';
        }
        // Si no tiene fondo (estilo vacío), verificar si está ocupada y restaurar al fondo rojo
        else if (!horaElemento.style.backgroundColor && horaElemento.textContent.includes('Ocupada por')) {
            horaElemento.style.backgroundColor = 'red'; // Restaurar al rojo para horas ocupadas
            horaElemento.style.color = 'white'; // Cambiar texto a blanco
        }
    });

    // Limpiar el array de horas seleccionadas
    horasSeleccionadas.length = 0;

    // Ocultar y limpiar el formulario de modificación
    const formulario = document.getElementById('formularioModificarReserva');
    if (formulario) {
        formulario.style.display = 'none';
        formulario.reset(); // Limpiar el formulario
    }

    // Vaciar las variables globales relacionadas con la selección
    idReservaSeleccionada = null;
    nombreReservaSeleccionada = null;
    horaInicioSeleccionada = null;
    horaFinSeleccionada = null;
    eliminarFechaHoraSeleccionada();

    console.log('Selección de horas cancelada, formulario restablecido, y colores restaurados.');
});


