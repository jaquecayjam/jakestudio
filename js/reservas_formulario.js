// script me muestra desplegable con horas de 9:00 a 18:00 para BD jakestudio_v1;
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