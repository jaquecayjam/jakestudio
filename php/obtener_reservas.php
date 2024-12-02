<?php
// modificacion para obtener reservas deBD nube
// modificacion por error, revisar
// Habilitar errores para depuración
// error_reporting(E_ALL);
// ini_set('display_errors', 1);
// $servername = "";
// $username = "";
// $password = "";
// $dbname = "w";

// // añado campo nombre y id para que admin lo pueda utilizar tambien:
// // Crear conexión
// $conn = new mysqli($servername, $username, $password, $dbname);

// // Comprobar la conexión
// if ($conn->connect_error) {
//     // Establecemos el tipo de contenido JSON
//     header('Content-Type: application/json');
//     // Enviar un JSON de error en lugar de un mensaje HTML
//     echo json_encode(["error" => "Conexión fallida: " . $conn->connect_error]);
//     exit;  // Salimos para no ejecutar el resto del código
// }
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
