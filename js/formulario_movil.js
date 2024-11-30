document.addEventListener('DOMContentLoaded', () => {
    let indiceFila = 0;
    if (window.innerWidth <= 768) { //  Para pantalla pequeña
        let fechaActual = new Date(); // Mantener la variable de la fecha actual
        // Ocultar el botón "Anterior día" al principio
    // BOTONNNNNNNN----------ANTERIOR
         const botonAnterior = document.getElementById('banterior');
        // botonAnterior.style.display = 'none'; // Ocultar   BOTON DIA ANTERIOR
        // Función para mostrar el día y ocultar las celdas no deseadas
        function actualizarCalendario(dia) {
            // Obtener el formato YYYY-MM-DD del día actual
            const diaFormato = dia.toISOString().split('T')[0];

            // Primero, mostrar todas las celdas de nuevo (para no dejar celdas ocultas)
            const allCeldas = document.querySelectorAll('td[data-fecha], td');
            // IMPORTANTE PARA QUE SE MUESTREN LAS CELDAS-----
            allCeldas.forEach(cell => {
                cell.style.display = ''; // Restablecer el estilo de visibilidad
                cell.classList.remove('current-day'); // Eliminar la clase 'current-day' de todas las celdas
                cell.style.backgroundColor = ''; // Eliminar cualquier color de fondo previo
            });

            // Busca la celda que tenga el atributo data-fecha igual al día actual
            const diasCeldas = document.querySelector(`td[data-fecha="${diaFormato}"]`);

            // Si existe la celda del día actual
            if (diasCeldas) {
                diasCeldas.classList.add('current-day'); // Marca el día actual con una clase Y EN CSS CAMBIA FONDO A VERDE

                // Si estamos en una pantalla pequeña, oculta las demás celdas REVISAR
                if (window.innerWidth <= 768) {
                    allCeldas.forEach(cell => {
                        // Oculta las celdas que no son del día actual o las celdas vacías
                        if (cell !== diasCeldas && cell.textContent.trim() === '') {
                            cell.style.display = 'none';
                        } else if (cell !== diasCeldas) {
                            cell.style.display = 'none';
                        }
                    });
                    //--------//
                    // Actualizar el título 
                    const diaActualFecha = dia.getDate();
                    const mesActual = dia.getMonth();
                    const añoActual = dia.getFullYear();

                    // Obtener el nombre del mes
                    const nombreMes = new Date(añoActual, mesActual).toLocaleString('es-ES', { month: 'long' });

                    //título para pantallas pequeñas
                    const tituloMesAño = document.getElementById('tituloMesAño');
                    const textoTitulo = `${diaActualFecha} ${nombreMes} ${añoActual}`;
                    tituloMesAño.textContent = textoTitulo;
                    //--------//  
                }
                // GENERA HORAS PERO REVISAR
                // Generar las horas para el día actual de forma automática
                // crearRangoHoras(dia.getDate(), dia.getMonth(), dia.getFullYear(), diasCeldas);
            }

            // Marcar sábado y domingo con fondo rojo
            marcarFinDeSemana();
            // Verificar si es el último día del mes o primer dia del mes
            verificarUltimoDiaMes();
            verificarPrimerDiaMes();

        }

        // Función para marcar el fin de semana (sábado y domingo) con fondo rojo REVISAR
        function marcarFinDeSemana() {
            const allCeldas = document.querySelectorAll('td[data-fecha], td');
            allCeldas.forEach(cell => {
                const fechaCelda = new Date(cell.getAttribute('data-fecha'));

                // Verificar si es sábado (6) o domingo (0)
                const diaSemana = fechaCelda.getDay();
                if (diaSemana === 0 || diaSemana === 6) {
                    cell.style.backgroundColor = 'red'; // Marcar en rojo el fondo

                    // Añadir el texto "NO DISPONIBLE" si no está ya presente
                    if (!cell.querySelector('.no-disponible')) {
                        const noDisponibleText = document.createElement('p');
                        noDisponibleText.textContent = 'NO DISPONIBLE';
                        noDisponibleText.classList.add('no-disponible'); // Añadir clase para controlar el estilo si es necesario REVISAR
                        cell.appendChild(noDisponibleText);
                    }
                }
            });
        }


        // FUNCION VERIFICAR ULTIMO DIA DEL MES---------------
        function verificarUltimoDiaMes() {
            const mesActual = fechaActual.getMonth();
            const ultimoDiaMes = new Date(fechaActual.getFullYear(), mesActual + 1, 0).getDate(); // Obtiene el último día del mes
            const botonSiguiente = document.getElementById('bsiguiente');
            // Si es el último día del mes, deshabilita el botón SIGUIENTE DIA
            if (fechaActual.getDate() === ultimoDiaMes) {
                botonSiguiente.disabled = true; // Deshabilitams botón Siguiente
                mostrarNotificacion("¡Has llegado al último día del mes! Cambie de mes.");
            } else {
                botonSiguiente.disabled = false; // Habilitar botón Siguiente
            }
        }
        // FUNCION VERIFICAR PRIMER DIA DEL MES---------------
        function verificarPrimerDiaMes() {
            const primerDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1); // Obtiene el primer día del mes
            const botonAnterior = document.getElementById('banterior');

            // Si es el primer día del mes, deshabilita el botón ANTERIOR DIA
            if (fechaActual.getDate() === primerDiaMes.getDate()) {
                botonAnterior.disabled = true; // Deshabilitar botón Anterior
                mostrarNotificacion("¡Estás en el primer día del mes! No puedes retroceder más.");
            } else {
                botonAnterior.disabled = false; // Habilitar botón Anterior
            }
        }
        // FUNCION PARA AVANZAR DIAS CON EL BOTON----------
        function avanzarDia() {
            const mesActual = fechaActual.getMonth();
            // Aumentar el día en 1
            fechaActual.setDate(fechaActual.getDate() + 1);
            // Verificar si hemos llegado al siguiente mes
            verificarUltimoDiaMes();
            // Actualizar el calendario para el siguiente día
            actualizarCalendario(fechaActual);
                // BOTONNNNNNNN----------ANTERIOR

            // Mostrar el botón "Anterior día" después de hacer clic en "Siguiente día"
            // const botonAnterior = document.getElementById('banterior');
            // botonAnterior.style.display = 'inline-block'; // Mostrar el botón "Anterior día"
        }

        // FUNCION PARA RETROCEDER DIAS CON EL BOTON----------
        function retrocederDia() {
            
            // Verificar si estamos en el primer día del mes
            verificarPrimerDiaMes();
            // Restar 1 al día (retroceder un día)
            fechaActual.setDate(fechaActual.getDate() - 1);
            // Reactivar el botón "Anterior día" si no estamos en el primer día
                // BOTONNNNNNNN----------ANTERIOR

            // const botonAnterior = document.getElementById('banterior');
            // botonAnterior.disabled = false;
            // Actualizar el calendario para el día anterior
            actualizarCalendario(fechaActual);
        }

// FUNCION AVANZAR UNA SEMANA--------------------------------------:
// ESTA FUNCIO TODO OK:
function avanzarSemana() {
    // Obtener todos los `tr` del calendario
    const filas = document.querySelectorAll('#calendario-full tr');
    // Buscar el `td` actual con la clase `current-day`
    let tdActual = document.querySelector('td.current-day');
    if (!tdActual) {
        alert("No se encontró un día marcado como 'current-day'.");
        return;
    }
    // Obtener la fila (`tr`) en la que está el `td` actual
    let filaActual = tdActual.closest('tr');
    // Buscar el siguiente `tr`
    const siguienteFila = filaActual.nextElementSibling;
    if (!siguienteFila) {
        alert("¡Ya estás en la última semana!");
        return;
    }
    // Buscar el primer día válido (celda con contenido) en la fila siguiente
    const primerDiaValido = Array.from(siguienteFila.children).find(celda => celda.textContent.trim() !== '');
    if (!primerDiaValido) {
        alert("No hay días válidos en la siguiente semana.");
        return;
    }
    // Mover la clase `current-day` al nuevo `td`
    tdActual.classList.remove('current-day');
    primerDiaValido.classList.add('current-day');
    // Actualizar la fecha actual usando el atributo `data-fecha` del nuevo `td`
    const nuevaFecha = new Date(primerDiaValido.getAttribute('data-fecha'));
    if (!isNaN(nuevaFecha)) {
        fechaActual = nuevaFecha; // Actualizar la fecha actual
    }
    // Opcional: Actualizar el calendario si es necesario
    actualizarCalendario(fechaActual);
}

// FUNCION RETROCEDER SEMANA-----------------------:
function retrocederSemana() {
    // Obtener todos los `tr` del calendario
    const filas = document.querySelectorAll('#calendario-full tr');

    // Buscar el `td` actual con la clase `current-day`
    let tdActual = document.querySelector('td.current-day');
    if (!tdActual) {
        alert("No se encontró un día marcado como 'current-day'.");
        return;
    }

    // Obtener la fila (`tr`) en la que está el `td` actual
    let filaActual = tdActual.closest('tr');

    // Buscar el `tr` anterior
    const filaAnterior = filaActual.previousElementSibling;
    if (!filaAnterior) {
        alert("¡Ya estás en la primera semana!");
        return;
    }
    // Buscar el primer día válido (celda con contenido) en la fila anterior
    const primerDiaValido = Array.from(filaAnterior.children).find(celda => celda.textContent.trim() !== '');
    if (!primerDiaValido) {
        alert("No hay días válidos en la semana anterior.");
        return;
    }

    // Mover la clase `current-day` al nuevo `td`
    tdActual.classList.remove('current-day');
    primerDiaValido.classList.add('current-day');

    // Actualizar la fecha actual usando el atributo `data-fecha` del nuevo `td`
    const nuevaFecha = new Date(primerDiaValido.getAttribute('data-fecha'));
    if (!isNaN(nuevaFecha)) {
        fechaActual = nuevaFecha; // Actualizar la fecha actual
    }

    // Opcional: Actualizar el calendario si es necesario
    actualizarCalendario(fechaActual);
}


// Función para mostrar una notificación (esto es opcional)
function mostrarNotificacion(mensaje) {
    alert(mensaje); // Este es un ejemplo, puedes usar un modal o una notificación más estilizada.
}

        // FUNCION PARA MOSTRAR MENSAJE SEGUN PRIMER O ULTIMO DIA DE MES-------------------
        function mostrarNotificacion(mensaje) {
            const modalNotificacion = document.getElementById("modal-notificacion");
            const mensajeNotificacion = document.getElementById("modal-notificacion-mensaje");
            mensajeNotificacion.textContent = mensaje; 
            modalNotificacion.style.display = "block"; // Muestra la notificación
            modalNotificacion.classList.add("mostrar");
            // Ocultar automáticamente después de 3 segundos
            setTimeout(() => {
                modalNotificacion.style.display = "none";
                modalNotificacion.classList.remove("mostrar");
            }, 3000);
        }

        // IMPORTANTE PARA QUE SE CREEN LAS CELDAS AL CAMBIAR DE MES O AÑO ----------------
        // elegir mes
        document.getElementById('elegir-mes').addEventListener('change', (event) => {
            const mesSeleccionado = parseInt(event.target.value, 10); // Obtener el mes seleccionado
            fechaActual.setMonth(mesSeleccionado);
            fechaActual.setDate(1); // Asegurarse de que sea el primer día del mes
            actualizarCalendario(fechaActual); // Actualizar el calendario al mes seleccionado
        });

        // elegir año
        document.getElementById('elegir-año').addEventListener('change', (event) => {
            const añoSeleccionado = parseInt(event.target.value, 10); // Obtener el año seleccionado
            fechaActual.setFullYear(añoSeleccionado);
            fechaActual.setDate(1); // Asegurarse de que sea el primer día del mes
            actualizarCalendario(fechaActual); // Actualizar el calendario al año seleccionado
        });
        // ----------------////////////////////
        // Llamar la función ACTULIZARCALENDARIO para actualizar el calendario al cargar la página (con la fecha actual)
        actualizarCalendario(fechaActual);

        // Asignar el evento al botón deBOTON DIA SIGUIENTE:-------------------
        document.getElementById('bsiguiente').addEventListener('click', avanzarDia);
        // Asignar el evento al botón de BOTON DIA ANTERIOR---------------
        botonAnterior.addEventListener('click', retrocederDia);
        //Assiganar evento al boton de AVANZAR SEMANA------
        document.getElementById('btnextsemana').addEventListener('click', avanzarSemana);
         //Assiganar evento al boton de RETROCEDER SEMANA------
        document.getElementById('btlastsemana').addEventListener('click', retrocederSemana);


    }
});
