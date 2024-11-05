async function obtenerReservas() {
    console.log("Iniciando la obtención de datos...");
    try {
        const response = await fetch('./php/obtenerReservas.php'); // Ajusta la ruta si es necesario
        if (!response.ok) throw new Error("Error al cargar las reservas");
        const reservas = await response.json(); // Las reservas en formato [{ fecha: "YYYY-MM-DD", hora: "HH:MM - HH:MM" }]
        return reservas;
    } catch (error) {
        console.error("Error al obtener reservas:", error);
        return [];
    }
}

// Ejemplo de uso de la función
obtenerReservas().then(reservas => {
    console.log("Reservas obtenidas:", reservas);
    // Aquí puedes procesar las reservas, como marcarlas en el calendario
});