<?php

// LLAMADA SOLO AL ARCHIVO PHP_CONENCTION:
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Incluir archivo de conexión
require 'db_connection.php';


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Recibimos los datos del formulario
    $id = $_POST['id'];
    $nombre = isset($_POST['nombre']) ? $_POST['nombre'] : null;
    $apellido = isset($_POST['apellido']) ? $_POST['apellido'] : null;
    $correo = isset($_POST['correo']) ? $_POST['correo'] : null;
    $fecha = isset($_POST['fecha']) ? $_POST['fecha'] : null;
    $hora_inicio = isset($_POST['hora_inicio']) ? $_POST['hora_inicio'] : null;
    $hora_fin = isset($_POST['hora_fin']) ? $_POST['hora_fin'] : null;

    // Recibimos los datos de la nueva reserva seleccionada
   $horaInicioSeleccionada = $_POST['hora_ranterior'] ?? '';
    $horaFinSeleccionada = $_POST['horafin_ranterior'] ??'';
    $fechaRanterior = $_POST['fecha_Ranterior'] ??'';

    // Preparamos la consulta de actualización
    $query = "UPDATE reservas SET
        nombre = COALESCE(?, nombre),
        apellido = COALESCE(?, apellido),
        correo = COALESCE(?, correo),
        fecha = COALESCE(?, fecha),
        hora_inicio = COALESCE(?, hora_inicio),
        hora_fin = COALESCE(?, hora_fin)
        WHERE id = ?";

    // Preparamos y ejecutamos la consulta
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ssssssi", $nombre, $apellido, $correo, $fecha, $hora_inicio, $hora_fin, $id);

    if ($stmt->execute()) {
        // Llamamos al archivo de envío de correo y le pasamos los datos adicionales
        include 'email_conf_modificar.php';
        echo "Reserva modificada con éxito.";
    } else {
        echo "Error al modificar la reserva: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}

?>
