<?php
// Parámetros de conexión a MySQL
$servername = "localhost"; // Cambiar si es necesario
$username = "root";        // Cambiar si tienes otro usuario
$password = "";            // Cambiar a la contraseña correcta
$dbname = "reservas_db";   // Nombre de la base de datos

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Obtener los datos del formulario
$nombre = $_POST['nombre'];
$apellido = $_POST['apellido'];
$correo = $_POST['correo'];
$fecha_reserva = $_POST['fecha'];
$horas_necesarias = $_POST['horas-necesarias'];

// Preparar la consulta SQL
$stmt = $conn->prepare("INSERT INTO reservas (nombre, apellido, correo, fecha_reserva, horas_necesarias) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("ssssi", $nombre, $apellido, $correo, $fecha_reserva, $horas_necesarias);

// Ejecutar la consulta
if ($stmt->execute()) {
    echo "Reserva creada exitosamente.";
} else {
    echo "Error al crear la reserva: " . $stmt->error;
}

// Cerrar la conexión
$stmt->close();
$conn->close();
?>
