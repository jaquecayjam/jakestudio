<?php
// Configuración de la base de datos
$servername = "localhost"; // Por ejemplo, "localhost"
$username = "root"; // Tu nombre de usuario de MySQL
$password = "root1234_"; // Tu contraseña de MySQL
$dbname = "pruebas_reservas"; // Nombre de la base de datos

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Obtener datos del formulario
$nombre = $_POST['nombre'];
$apellido = $_POST['apellido'];
$correo = $_POST['correo'];
$fecha = $_POST['fecha'];
$horas_necesarias = $_POST['horas-necesarias'];

// Preparar y vincular la declaración
$stmt = $conn->prepare("INSERT INTO reservas (nombre, apellido, correo, fecha, horas_necesarias) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("ssssi", $nombre, $apellido, $correo, $fecha, $horas_necesarias);

// Ejecutar la declaración
if ($stmt->execute()) {
    echo "Reserva guardada con éxito.";
} else {
    echo "Error: " . $stmt->error;
}

// Cerrar la declaración y la conexión
$stmt->close();
$conn->close();
?>
