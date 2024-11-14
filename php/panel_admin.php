<?php 
// session_start(); // Iniciar la sesión

// Verificar si el usuario ha iniciado sesión
// if (!isset($_SESSION['usuario'])) {
//     // Si no está logueado, redirigir al login
//     header("Location: login.php");
//     exit();
// }
 ?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel administrador</title>
    <link rel="stylesheet" href="../css/styles_admin.css">
</head>

<body>
    <nav>
        <ul>
            <li><a href="index.html">Inicio</a></li>
            <li><a href="estudio.html">Estudio</a></li>
            <li><a href="contacto.html">Contacto</a></li>
        </ul>
    </nav>

<div id="calendario-container">
    <!-- BOTON PARA ELIMINAR JUNTO ID -->
<button id="eliminarReserva">Eliminar</button>
 <!-- BOTON PARA AÑADIR RESERVA -->
 <button id="añadirReserva">Añadir reserva</button>

<!-- Formulario de reserva ESTA OCULTO HASTA QUE CLICK EN AÑADIR RESERVA -->
<form id="formularioReserva" action="../php/reserva.php" method="POST" style="display: none;">
    <h3>Introduce tus datos</h3>
    <input type="text" id="nombre" placeholder="Nombre">
    <input type="text" id="apellido" placeholder="Apellido">
    <input type="email" id="correo" placeholder="Correo electrónico">
        <!-- Campos ocultos para alamacenr fecha, hora_inicio , hora_fin -->
         <input type="hidden" id="fecha" name="fecha">
        <input type="hidden" id="hora_inicio" name="hora_inicio">
        <input type="hidden" id="hora_fin" name="hora_fin">
    <input type="submit" value= "Reserva">
</form>
    <!-- Titulo del mes y año -->
    <div id="tituloMesAño"></div>
    
    <!-- Selectores para mes y año -->
    <select id="elegir-mes"></select>
    <select id="elegir-año"></select>


    <!-- Calendario -->
    <table id="calendarioFull">
        <thead>
            <tr>
                <th>Lunes</th>
                <th>Martes</th>
                <th>Miércoles</th>
                <th>Jueves</th>
                <th>Viernes</th>
                <th class="fin-de-semana">Sábado</th>
                <th class="fin-de-semana">Domingo</th>
            </tr>
        </thead>
        <tbody id="calendario-full">
            <!-- El calendario se crea/muestra  -->
        </tbody>
    </table>
</div>

     
    <script src="../js/admin2.js"></script>

    <a href="logout.php">Cerrar sesión</a>
    <!-- <script src="./js/scroll-estudio.js"></script>  -->

    <input type="hidden" name="hora" value="">
    <div class="footer-container"> <!-- contenedor footer-->
        <footer>
            <p>&copy; JakeStudio 2024</p>
        </footer>
    </div>
</body>

</html>