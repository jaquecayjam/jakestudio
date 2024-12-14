<?php 

//  ACCESO CON LOGIN---------
 session_start(); // Iniciar la sesión

// Verificar si el usuario ha iniciado sesión
 if (!isset($_SESSION['usuario'])) {
    // Si no está logueado, redirigir al login
     header("Location: login.php");
     exit();
 }
 //  ACCESO CON LOGIN---------
 ?>
<!DOCTYPE html>
<html lang="es">

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
            <li><a href="/././index.html">Inicio</a></li>
            <li><a href="/././estudio.html">Estudio</a></li>
            <li><a href="/././contacto.html">Contacto</a></li>
        </ul>
    </nav>

<div id="calendario-container">
    <!-- BOTON PARA ELIMINAR JUNTO ID -->
<button id="eliminarReserva">Eliminar</button>
 <!-- BOTON PARA AÑADIR RESERVA -->
 <button id="añadirReserva">Añadir reserva</button>
 <!-- BOTON MODIFICAR RESERVA -->
 <button id="modificarReserva">Modificar reserva</button>

<!-- Formulario de reserva ESTA OCULTO HASTA QUE CLICK EN AÑADIR RESERVA -->
<!-- ELIMIANOMOS action="../php/reserva.php" method="POST" PORQUE PUEDE CAUSAR CONFLICTO YA QUE UTLIZAMOS FETCH EN NUESTRO JS -->
<form id="formularioReserva" style="display: none;">
    <h3>Introduce tus datos</h3>
    <p id="infoSeleccionada"></p>
    <input type="text" id="nombre" placeholder="Nombre">
    <input type="text" id="apellido" placeholder="Apellido">
    <input type="email" id="correo" placeholder="Correo electrónico">
        <!-- Campos ocultos para alamacenr fecha, hora_inicio , hora_fin -->
         <input type="hidden" id="fecha" name="fecha">
        <input type="hidden" id="hora_inicio" name="hora_inicio">
        <input type="hidden" id="hora_fin" name="hora_fin">
    <input type="submit" value= "Reserva">
        <!-- Botón cancelar -->
    <button type="button" id="cancelarR">Cancelar</button>
</form>

<!-- FORMULARIO MODIFICAR RESERVA -->
<!-- FORMULARIO MODIFICAR RESERVA -->
<form id="formularioModificarReserva" style="display: none;">
    <h3>Modificar Reserva</h3>

    <!-- Mostrar información de la reserva seleccionada -->
    <div id="infoReservaSeleccionada" style="display: none; font-weight: bold; margin-bottom: 10px;">
        <!-- Aquí se mostrará el nombre y la hora de la reserva seleccionada -->
    </div>

    <!-- Campo oculto para enviar el ID de la reserva seleccionada -->
    <input type="hidden" name="id" id="idReservaInput">
     <!-- Campo oculto para enviar datos reserva anterior  -->
     <input type="hidden" name="nombre_ranterior" id="nombReserP">
     <input type="hidden" name="hora_ranterior" id="horaRanterior">
     <input type="hidden" name="horafin_ranterior" id="horafinRanterior">
     <input type="hidden" name="fecha_Ranterior" id="fechaRanterior">
    <h3>Nueva Reserva</h3>

    <!-- Campos para modificar los datos -->
    <input type="text" name="nombre" id="nombreModificar" placeholder="Nombre" />
    <input type="text" name="apellido" id="apellidoModificar" placeholder="Apellido" />
    <input type="email" name="correo" id="correoModificar" placeholder="Correo" />
  <!-- Mostrar fecha y horas seleccionadas -->
    <input type="text" name="fechaModificar" id="fechaModificar" placeholder="Fecha seleccionada" readonly />
    <input type="text" name="hora_inicioModificar" id="hora_inicioModificar" placeholder="Hora inicio seleccionada" readonly />
    <input type="text" name="hora_finModificar" id="hora_finModificar" placeholder="Hora fin seleccionada" readonly />

    <!-- Botón para guardar cambios -->
    <input type="submit" value="Guardar cambios">
    <!-- Botón cancelar -->
    <button type="button" id="cancelarReserva">Cancelar</button>
</form>
<!-- FIN FORMULARIO MODIFICAR RESERVA -->
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

     
    <script src="../js/admin.js"></script>
    <div id="conte-cerrar">
    <a href="logout.php" id="cerrar-sesion">Cerrar sesión</a>
    </div>

    <input type="hidden" name="hora" value="">
    <div class="footer-container"> <!-- contenedor footer-->
        <footer>
            <p>&copy; JakeStudio 2024</p>
        </footer>
    </div>
</body>

</html>