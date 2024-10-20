
<?php
// Configuración de la base de datos
$servername = "localhost"; // 
$username = "root"; // usuario de MySQL
$password = "root1234_"; // contraseña de MySQL
$dbname = "jakestudio_v2"; // Nombre de la base de datos

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// comprobar si la conexion funciona
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Guardamos datos del formulario en la BD jakestudio_v1----------
// guardamos los datos del formulario en las variables
$nombre = $_POST['nombre'];
$apellido = $_POST['apellido'];
$correo = $_POST['correo'];
$fecha = $_POST['fecha'];
$hora_inicio = $_POST['hora_inicio'];
$hora_fin = $_POST['hora_fin'];
// $horas_necesarias = $_POST['horas-necesarias'];

//  $conn->prepare,sentencia,dentro tiene los insert que hara a cada value ????
$stmt = $conn->prepare("INSERT INTO reservas (nombre, apellido, correo, fecha, hora_inicio, hora_fin) VALUES (?, ?, ?, ?, ?, ?)");
// FIX: error en las horas al guardar: 00:00:12 Solucion: $stmt->bind_param("ssssss")
$stmt->bind_param("ssssss", $nombre, $apellido, $correo, $fecha, $hora_inicio, $hora_fin);

// Ejecutar la declaración
if ($stmt->execute()) {
    echo "Reserva guardada con éxito.";
} else {
    echo "Error: " . $stmt->error;
}
// FIN Guardamos datos del formulario en la BDjakestudio_v1----------
// Cerrar la declaración y la conexión
$stmt->close();
$conn->close();
?>
