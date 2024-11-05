<?php
// Configuración de la base de datos
$servername = "localhost";
$username = "root";
$password = "root1234_";
$dbname = "jakestudio_v2";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Comprobar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Consulta para obtener todos los datos de la tabla reservas
$sql = "SELECT id, nombre, apellido, correo, fecha, hora_inicio, hora_fin FROM reservas";
$result = $conn->query($sql);

// Verificar si hay resultados
$reservas = [];
if ($result->num_rows > 0) {
    // Recorrer los resultados y añadir cada registro al array
    while ($row = $result->fetch_assoc()) {
        $reservas[] = [
            "id" => $row["id"],
            "nombre" => $row["nombre"],
            "apellido" => $row["apellido"],
            "correo" => $row["correo"],
            "fecha" => $row["fecha"],
            "hora_inicio" => $row["hora_inicio"],
            "hora_fin" => $row["hora_fin"]
        ];
    }
}

// Retornar todos los datos de reservas como JSON
header('Content-Type: application/json');
echo json_encode($reservas);

// Cerrar conexión
$conn->close();
?>
