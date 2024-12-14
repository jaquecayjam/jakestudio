<?php
// Habilitar errores para depuración
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Configuración de la base de datos
$servername = "sql210.infinityfree.com";
$username = "if0_37677093";
$password = "Z8GBOE8Sn4IFCR";
$dbname = "if0_37677093_jakestudio";

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
