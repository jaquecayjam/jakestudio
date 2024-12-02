<?php
// Habilitar errores para depuración CONEXION CON BD NUBE
// error_reporting(E_ALL);
// ini_set('display_errors', 1);
// // Configuración de la base de datos
// $servername = "ww";
// $username = "ww";
// $password = "ww";
// $dbname = "ww";

// $conn = new mysqli($servername, $username, $password, $dbname);

// if ($conn->connect_error) {
//     die("Conexión fallida: " . $conn->connect_error);
// }
// LLAMADA SOLO AL ARCHIVO PHP_CONENCTION:
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Incluir archivo de conexión
require 'db_connection.php';

header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"), true);
$idReserva = $data['id'] ?? null;

if ($idReserva) {
    $stmt = $conn->prepare("DELETE FROM reservas WHERE id = ?");
    $stmt->bind_param("i", $idReserva);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $conn->error]);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'error' => 'ID de reserva no proporcionado']);
}

$conn->close();
?>