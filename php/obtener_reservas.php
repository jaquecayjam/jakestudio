<?php

// LLAMADA SOLO AL ARCHIVO PHP_CONENCTION:
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Incluir archivo de conexión
require 'db_connection.php';

// Consulta para obtener todos los datos, incluyendo el id
$sql = "SELECT id, fecha, hora_inicio, hora_fin, nombre FROM reservas";
$result = $conn->query($sql);

$reservas = [];

if ($result && $result->num_rows > 0) {
    // Recorrer los resultados y añadir cada registro al array
    while ($row = $result->fetch_assoc()) {
        $reservas[] = [
            "id" => $row["id"],
            "fecha" => $row["fecha"],
            "hora_inicio" => $row["hora_inicio"],
            "hora_fin" => $row["hora_fin"],
            "nombre" => $row["nombre"]
        ];
    }
} elseif (!$result) {
    // Si la consulta falla, enviar un mensaje de error en JSON
    header('Content-Type: application/json');
    echo json_encode(["error" => "Error en la consulta SQL: " . $conn->error]);
    exit;
}

// Retornar todos los datos de reservas como JSON
header('Content-Type: application/json');
echo json_encode($reservas);

// Cerrar conexión
$conn->close();
?>
