<?php
// Habilitar errores para depuración
error_reporting(E_ALL);
ini_set('display_errors', 1);
$servername = "sql210.infinityfree.com";
$username = "if0_37677093";
$password = "Z8GBOE8Sn4IFCR";
$dbname = "if0_37677093_jakestudio";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

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
