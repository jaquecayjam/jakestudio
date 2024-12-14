<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Incluir archivo de conexión
require 'db_connection.php';

// Datos del administrador
$nombre = 'Administrador_final';
$email = 'finaladminn@jakeestudio.com';  // Usa tu correo de administrador
$password = 'admin123';  // La contraseña del administrador
$password_hash = password_hash($password, PASSWORD_DEFAULT);  // Encriptacion de la contraseña

// Consulta para insertar al administrador
$query = "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)";

$stmt = $conn->prepare($query); // Usar $conn en lugar de $mysqli

if ($stmt === false) {
    die('Error al preparar la consulta: ' . $conn->error);
}

$stmt->bind_param('sss', $nombre, $email, $password_hash);

if ($stmt->execute()) {
    echo 'Usuario administrador creado correctamente';
} else {
    echo 'Error al crear usuario: ' . $stmt->error;
}

$stmt->close();
$conn->close();
?>
