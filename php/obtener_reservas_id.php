<?php
// Configuración para mostrar errores (solo para desarrollo)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Incluir archivo de conexión
require 'db_connection.php';

// Obtener el ID de la reserva desde la solicitud (json)
$data = json_decode(file_get_contents('php://input'), true);
$idReserva = $data['id'] ?? null;

if (!$idReserva) {
    echo json_encode(["error" => "ID de reserva no proporcionado"]);
    exit;
}

// Consulta para obtener los detalles de la reserva con el ID
$sql = "SELECT id, nombre, apellido, correo, fecha, hora_inicio, hora_fin FROM reservas WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $idReserva);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Recuperamos los datos de la reserva
    $reserva = $result->fetch_assoc();
    echo json_encode($reserva);  // Devolvemos los datos de la reserva en formato JSON
} else {
    echo json_encode(["error" => "No se encontró la reserva"]);
}

// Cerrar conexión
$conn->close();
?>
