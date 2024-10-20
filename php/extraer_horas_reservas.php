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

// Obtener la fecha desde la solicitud AJAX
$fecha = $_POST['fecha'];

// Consultar las horas reservadas para esa fecha
$sql = "SELECT hora_inicio, hora_fin FROM reservas WHERE fecha = '$fecha'";
$result = $conn->query($sql);

$horasReservadas = [];

if ($result->num_rows > 0) {
    // Recorrer los resultados y añadir las horas al array
    while($row = $result->fetch_assoc()) {
        $horasReservadas[] = [
            "hora_inicio" => $row["hora_inicio"],
            "hora_fin" => $row["hora_fin"]
        ];
    }
}

// Devolver las horas reservadas en formato JSON
echo json_encode($horasReservadas);

// Cerrar la conexión
$conn->close();
?>
