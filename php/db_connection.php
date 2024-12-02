<?php
// Habilitar errores para depuración
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Configuración de la base de datos
$servername = "";
$username = "";
$password = "";
$dbname = "";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    // Enviar un JSON de error en caso de fallo
    header('Content-Type: application/json');
    echo json_encode(["error" => "Conexión fallida: " . $conn->connect_error]);
    exit;
}
?>
