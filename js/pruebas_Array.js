// este script solo funciona con array NO conexion BD---------------------------------------
// // Obtener referencias a los elementos del DOM
// const fechaInput = document.getElementById('fecha');
// const horasNecesariasInput = document.getElementById('horas-necesarias');
// const horariosDiv = document.getElementById('horarios');
// const resumenDiv = document.getElementById('resumen-seleccion');
// const resumenTexto = document.getElementById('resumen-texto');

// let horaSeleccionada = null;
// let fechaSeleccionada = null;

// // Definir el array de disponibilidad
// const disponibilidad = [
//     { fecha: '2024-10-15', horas: [9, 10, 11, 12, 13, 14, 15, 16, 17] }, // 15 de octubre tiene horas disponibles
//     { fecha: '2024-10-16', horas: [9, 10, 11, 12] },                     // 16 de octubre tiene horas disponibles
//     { fecha: '2024-10-17', horas: [10, 11, 14, 15, 16] },       // 17 de octubre tiene horas disponibles
//     { fecha: '2024-10-18', horas: [9, 10] },                             // 18 de octubre tiene horas limitadas
//     { fecha: '2024-10-19', horas: [9, 10,11,17,18] },
// ];

// // Función para generar y mostrar las horas disponibles
// // la funcion llama a otra funcion, en este caso llama a la funcion generarHorarios
// fechaInput.addEventListener('change', function() {
//     generarHorarios();
// });

// horasNecesariasInput.addEventListener('change', function() {
//     generarHorarios();
// });

// function generarHorarios() {
//     // Limpiar el div de horarios cuando se cambia la fecha o las horas necesarias
//     horariosDiv.innerHTML = '';

//     // Almacenar la fecha seleccionada
//     fechaSeleccionada = fechaInput.value;

//     // Obtener la cantidad de horas necesarias seleccionadas
//     const horasNecesarias = parseInt(horasNecesariasInput.value);

//     // Mostrar solo las horas consecutivas disponibles
//     const horasDisponibles = disponibilidadDia.horas;
//     debugger;
//     // Buscar la disponibilidad para la fecha seleccionada
//     if (horasNecesarias > horasDisponibles) {
//         let alertaNoHorasDisponible = document.createElement('div');
//         alertaNoHorasDisponible.textContent = "No hay horas disponibles";
//         horariosDiv.insertAdjacentElement('afterend', alertaNoHorasDisponible);
//     }

//     for (let i = 0; i <= horasDisponibles.length - horasNecesarias; i++) {
//         const horaInicio = horasDisponibles[i];
        
//         // Verificar si todas las horas en el rango están disponibles
//         const rangoHoras = [];
//         for (let j = 0; j < horasNecesarias; j++) {
//             rangoHoras.push(horaInicio + j);
//         }

//         // Comprobar si todas las horas del rango están disponibles
//         const todasDisponibles = rangoHoras.every(hora => horasDisponibles.includes(hora));

//         if (todasDisponibles) {
//             const horaDiv = document.createElement('div');
//             horaDiv.classList.add('hora');
//             horaDiv.textContent = `${horaInicio}:00 - ${horaInicio + horasNecesarias}:00`;

//             // Añadir evento para seleccionar la hora
//             horaDiv.addEventListener('click', function() {
//                 seleccionarHora(horaDiv, horaInicio, horasNecesarias);
//             });

//             // Añadir la hora generada al contenedor de horarios
//             horariosDiv.appendChild(horaDiv);
//         }
//     }
// }

// // Función para seleccionar una hora
// function seleccionarHora(elemento, hora, horasNecesarias) {
//     // Si ya hay una hora seleccionada, deseleccionarla
//     if (horaSeleccionada) {
//         horaSeleccionada.classList.remove('selected');
//     }

//     // Marcar la nueva hora seleccionada con el color naranja
//     elemento.classList.add('selected');
//     horaSeleccionada = elemento;

//     // Mostrar el resumen con la fecha y hora seleccionada
//     actualizarResumen(hora, horasNecesarias);
// }

// // Función para actualizar el resumen y mostrarlo
// function actualizarResumen(hora, horasNecesarias) {
//     const fechaFormateada = new Date(fechaSeleccionada).toLocaleDateString(); // Formato de fecha
//     resumenTexto.textContent = `Has seleccionado el día ${fechaFormateada} y las horas ${hora}:00 - ${hora + horasNecesarias}:00.`;

//     // Mostrar el div de resumen
//     resumenDiv.style.display = 'block';
// }
// fin de este script solo funciona con array---------------------------------------

// script me muestra desplegable con horas de 9:00 a 18:00
    function mostrarHoras() {
        const horariosSelect = document.getElementById('horarios');
        horariosSelect.innerHTML = ''; // Cuando el user, seleccion una nueva fecha, se vacia, y tiene que seleccionar una nueva hora

        const horasDisponibles = [
            '09:00', '10:00', '11:00', '12:00', 
            '13:00', '14:00', '15:00', '16:00', 
            '17:00', '18:00'
        ];

        // Agregar las horas disponibles al select
        horasDisponibles.forEach(hora => {
            const option = document.createElement('option');
            option.value = hora;
            option.textContent = hora;
            horariosSelect.appendChild(option);
        });
    }