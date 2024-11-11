<?php
// Datos del administrador
$nombre = 'Administrador';
$email = 'adminadmin@jakeestudio.com';  // Usa tu correo de administrador
$password = 'admin123';  // La contraseña del administrador
$password_hash = password_hash($password, PASSWORD_DEFAULT);  // Encriptamos la contraseña


// Conexión a la base de datos
$mysqli = new mysqli('localhost', 'root', 'root1234_', 'jakestudio_v2');  // Cambia los datos de conexión a los tuyos

if ($mysqli->connect_error) {
    die('Error de conexión: ' . $mysqli->connect_error);
}

// Consulta para insertar al administrador
$query = "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)";
$stmt = $mysqli->prepare($query);
$stmt->bind_param('sss', $nombre, $email, $password_hash);

if ($stmt->execute()) {
    echo 'Usuario administrador creado correctamente';
} else {
    echo 'Error al crear usuario';
}

$stmt->close();
$mysqli->close();
?>
