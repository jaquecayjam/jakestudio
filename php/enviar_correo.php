<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Incluir PHPMailer
require './PHPMailer/src/Exception.php';
require './PHPMailer/src/PHPMailer.php';
require './PHPMailer/src/SMTP.php';

function enviarCorreo($destinatarioCorreo, $destinatarioNombre, $detallesReserva) {
    $mail = new PHPMailer(true);

    try {
        // Configuración del servidor SMTP de Gmail
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';  // Servidor SMTP de Gmail
        $mail->SMTPAuth   = true;
        $mail->Username   = ''; // Tu correo de Gmail
        $mail->Password   = ''; // Contraseña de aplicación generada en Gmail
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        // Configuración del remitente y destinatario
        $mail->setFrom('', 'Tu Nombre o Empresa');  // Remitente
        $mail->addAddress($destinatarioCorreo, $destinatarioNombre); // Destinatario (correo y nombre del usuario)

        // Configuración del contenido del correo
        $mail->isHTML(true);
        $mail->Subject = 'Confirmación de Reserva';
        $mail->Body    = "
            <html>
            <head><title>Confirmación de Reserva</title></head>
            <body>
            <p>Hola {$detallesReserva['nombre']} {$detallesReserva['apellido']},</p>
            <p>Tu reserva ha sido confirmada con los siguientes detalles:</p>
            <ul>
                <li><strong>Fecha:</strong> {$detallesReserva['fecha']}</li>
                <li><strong>Hora de inicio:</strong> {$detallesReserva['hora_inicio']}</li>
                <li><strong>Hora de fin:</strong> {$detallesReserva['hora_fin']}</li>
            </ul>
            <p>Gracias por elegirnos.</p>
            </body>
            </html>
        ";

        // Enviar el correo
        $mail->send();
        return true;

    } catch (Exception $e) {
        error_log("Error al enviar el correo: {$mail->ErrorInfo}");
        return false;
    }
}
