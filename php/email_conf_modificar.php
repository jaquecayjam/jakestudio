<?php
// Habilitar errores para depuración
error_reporting(E_ALL);
ini_set('display_errors', 1);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Incluir los archivos de PHPMailer
require 'PhpMailer/src/PHPMailer.php';
require 'PhpMailer/src/SMTP.php';
require 'PhpMailer/src/Exception.php';

// Crear el contenido del correo
$contenido = "
    <h2>Reserva Anterior</h2>
      <p><strong>Nombre de la Reserva:</strong> $nombre</p>
    <p><strong>Hora de Inicio de la anterior Reserva:</strong> $horaInicioSeleccionada</p>
    <p><strong>Hora de Fin de la anterior Reserva:</strong> $horaFinSeleccionada</p>
    <p><strong>Fecha de Reserva Anterior Reserva :</strong> $fechaRanterior</p>

     <h2>Nueva Reserva</h2>
    <p><strong>Nombre:</strong> $nombre</p>
    <p><strong>Apellido:</strong> $apellido</p>
    <p><strong>Correo Electrónico:</strong> $correo</p>
    <p><strong>Fecha:</strong> $fecha</p>
    <p><strong>Hora de Inicio:</strong> $hora_inicio</p>
    <p><strong>Hora de Fin:</strong> $hora_fin</p>
";

// Enviar el correo utilizando PHPMailer
$mail = new PHPMailer(true);

try {
    // Configuración de PHPMailer
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';  // Servidor SMTP de Gmail
    $mail->SMTPAuth = true;
    $mail->Username = '';  // Tu correo
    $mail->Password = '';  // Tu contraseña de correo
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    $mail->setFrom('', '');
    $mail->addAddress($correo, "$nombre $apellido");  // Correo de la persona que hace la reserva

    $mail->Subject = 'Modificacion de Reserva';
    $mail->Body    = $contenido;
    $mail->isHTML(true);

    // Enviar el correo
    $mail->send();
} catch (Exception $e) {
    echo "Error al enviar el correo: {$mail->ErrorInfo}";
}
?>