// script me muestra desplegable con horas de 9:00 a 18:00 para BD jakestudio_v1-------;
// function mostrarHoras() {
//     const horariosSelect = document.getElementById('horarios');
//     horariosSelect.innerHTML = ''; // Cuando el user, seleccion una nueva fecha, se vacia, y tiene que seleccionar una nueva hora

//     const horasDisponibles = [
//         '09:00', '10:00', '11:00', '12:00', 
//         '13:00', '14:00', '15:00', '16:00', 
//         '17:00', '18:00'
//     ];

//     // Agregar las horas disponibles al select
//     horasDisponibles.forEach(hora => {
//         const option = document.createElement('option');
//         option.value = hora;
//         option.textContent = hora;
//         horariosSelect.appendChild(option);
//     });
// }
// script me muestra desplegable con horas de 9:00 a 18:00 para BD jakestudio_v2-------;
function mostrarHoras() {
    // Obtener los select donde se agregarán las horas
    const selectHoraInicio = document.getElementById("hora-inicio");
    const selectHoraFin = document.getElementById("hora-fin");

    // Limpiar el contenido previo de los select
    selectHoraInicio.innerHTML = '<option value="">Seleccione una hora de inicio</option>';
    selectHoraFin.innerHTML = '<option value="">Seleccione hasta que hora</option>';

    // Definir el rango de horas
    const horaInicio = 9; // 9:00 AM
    const horaFin = 18;   // 6:00 PM

    // Generar las opciones de horas
    for (let i = horaInicio; i <= horaFin; i++) {
        let hora = `${i}:00`;

        // Crear las opciones de horas de inicio
        let optionInicio = document.createElement("option");
        optionInicio.value = hora;
        optionInicio.text = hora;
        selectHoraInicio.appendChild(optionInicio);

        // Crear las opciones de horas de fin
        let optionFin = document.createElement("option");
        optionFin.value = hora;
        optionFin.text = hora;
        selectHoraFin.appendChild(optionFin);
    }
}
