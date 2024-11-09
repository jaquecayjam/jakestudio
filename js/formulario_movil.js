document.getElementById('elegir-fecha').addEventListener('click', function () {
    const modal = document.getElementById('calendario-modal');
    const isMobile = window.innerWidth <= 768;

    // Mostrar el modal
    modal.style.display = "block";

    // Ocultar ambas vistas primero
    document.getElementById('mobile-calendar').style.display = "none";
    document.getElementById('desktop-calendar').style.display = "none";

    // Mostrar la vista apropiada según el dispositivo
    if (isMobile) {
        // Mostrar solo el día actual con las horas para móviles
        showCurrentDayAndHours();
    } else {
        // Mostrar calendario completo para escritorio
        showFullCalendar();
    }
});

// Cerrar el modal cuando se hace clic en la "X"
document.getElementsByClassName('close')[0].addEventListener('click', function () {
    const modal = document.getElementById('calendario-modal');
    modal.style.display = "none";
});

function showCurrentDayAndHours() {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();

    // Mostrar el título con el día actual
    document.getElementById('current-day-title').innerText = `Día ${currentDay}`;

    // Crear las celdas de las horas
    const hoursContainer = document.getElementById('hours-container');
    const hours = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];
    hoursContainer.innerHTML = ''; // Limpiar contenedor
    hours.forEach(hour => {
        const hourDiv = document.createElement("div");
        hourDiv.classList.add("hour-cell");
        hourDiv.innerText = hour;
        hoursContainer.appendChild(hourDiv);
    });

    // Mostrar solo la sección móvil
    document.getElementById('mobile-calendar').style.display = "block";
}

function showFullCalendar() {
    // Aquí puedes agregar el código para generar un calendario completo.
    // Este código depende de cómo estás generando el calendario (puedes usar librerías o hacerlo manualmente)
    document.getElementById('desktop-calendar').style.display = "block";
}
