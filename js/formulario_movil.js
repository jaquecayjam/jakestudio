document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth <= 768) { //  Para pantalla pequeña
        let fechaActual = new Date(); // Mantener la variable de la fecha actual
        // Ocultar el botón "Anterior día" al principio
        const botonAnterior = document.getElementById('banterior');
        botonAnterior.style.display = 'none'; // Ocultar   BOTON DIA ANTERIOR
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
                        noDisponibleText.classList.add('no-disponible'); // Añadir clase para controlar el estilo si es necesario
                        cell.appendChild(noDisponibleText);
                    }
                }
            });
        }

        // Función para avanzar un día BOTON DIA SIGUIENTE:-------------------
        function avanzarDia() {
            // Aumentar el día en 1
            fechaActual.setDate(fechaActual.getDate() + 1);
            // Llamar a la función ACTULIZARCALENDARIO que actualiza el calendario para el siguiente día
            actualizarCalendario(fechaActual);
            // Mostrar el botón "Anterior día" después de hacer clic en "Siguiente día"
            botonAnterior.style.display = 'inline-block'; // Muestra el botón "Anterior día"
        }
        // ----------------
        // Función para retroceder un día BOTON DIA ANTERIOR----------
        function retrocederDia() {
            // Restar 1 al día
            fechaActual.setDate(fechaActual.getDate() - 1);
            // Llamar a la función  ACTULIZARCALENDARIO para actualizar el calendario para el día anterior
            actualizarCalendario(fechaActual);
        }

        // Llamar la función ACTULIZARCALENDARIO para actualizar el calendario al cargar la página (con la fecha actual)
        actualizarCalendario(fechaActual);

        // Asignar el evento al botón deBOTON DIA SIGUIENTE:-------------------
        document.getElementById('bsiguiente').addEventListener('click', avanzarDia);
        // Asignar el evento al botón de BOTON DIA ANTERIOR---------------
        botonAnterior.addEventListener('click', retrocederDia);
    }
});

