<?php
// pendiente cambiar 
error_reporting(E_ALL);
ini_set('display_errors', 1);
// Configuración de la base de datos
$servername = "ww";
$username = "ww";
$password = "ww";
$dbname = "ww";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// comprobar si la conexion funciona
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'];

    // Preparamos las variables con valores nulos por defecto
    $nombre = isset($_POST['nombre']) ? $_POST['nombre'] : null;
    $apellido = isset($_POST['apellido']) ? $_POST['apellido'] : null;
    $correo = isset($_POST['correo']) ? $_POST['correo'] : null;
    $fecha = isset($_POST['fecha']) ? $_POST['fecha'] : null;
    $hora_inicio = isset($_POST['hora_inicio']) ? $_POST['hora_inicio'] : null;
    $hora_fin = isset($_POST['hora_fin']) ? $_POST['hora_fin'] : null;

    // Preparamos la consulta de actualización
    $query = "UPDATE reservas SET
        nombre = COALESCE(?, nombre),
        apellido = COALESCE(?, apellido),
        correo = COALESCE(?, correo),
        fecha = COALESCE(?, fecha),
        hora_inicio = COALESCE(?, hora_inicio),
        hora_fin = COALESCE(?, hora_fin)
        WHERE id = ?";

    // Preparamos y ejecutamos la consulta
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ssssssi", $nombre, $apellido, $correo, $fecha, $hora_inicio, $hora_fin, $id);

    if ($stmt->execute()) {
        echo "Reserva modificada exitosamente";
    } else {
        echo "Error al modificar la reserva: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>