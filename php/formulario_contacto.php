<?php
// Incluir archivo de conexión
require 'db_connection.php'; // Asegúrate de que este archivo contiene la conexión $conn correctamente configurada

// Verificar que los datos hayan sido enviados mediante POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Guardar datos del formulario en variables
    $nombre = $_POST['nombre'] ?? '';
    $apellido = $_POST['apellido'] ?? '';
    $email = $_POST['email'] ?? '';
    $mensaje = $_POST['mensaje'] ?? '';

    // Validar que los campos no estén vacíos
    if (empty($nombre) || empty($apellido) || empty($email) || empty($mensaje)) {
        echo "Por favor, completa todos los campos.";
        exit;
    }

    // Preparar la declaración SQL
    $stmt = $conn->prepare("INSERT INTO contacto (nombre, apellido, email, mensaje) VALUES (?, ?, ?, ?)");
    // Vincular parámetros (las "s" indican que los valores son cadenas)
    $stmt->bind_param("ssss", $nombre, $apellido, $email, $mensaje);

    // Ejecutar la declaración
    if ($stmt->execute()) {
        echo "Mensaje guardado con éxito.";
        // Incluir envío de correo si es necesario
        // include 'email_config.php';
    } else {
        echo "Error al guardar el mensaje: " . $stmt->error;
    }

    // Cerrar la declaración y la conexión
    $stmt->close();
    $conn->close();
} else {
    echo "Método no permitido.";
}
