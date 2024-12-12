document.getElementById('form_contacto').addEventListener('submit', function (event) {
    event.preventDefault(); // Evita el envío normal del formulario

    // Obtener los valores de los campos del formulario
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const email = document.getElementById('email').value;
    const mensaje = document.getElementById('mensaje').value;

    // Verificar que los campos no estén vacíos
    if (!nombre || !apellido || !email || !mensaje) {
        alert('Por favor, completa todos los campos');
        return;
    }

    // Crear un objeto FormData para enviar los datos
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('apellido', apellido);
    formData.append('email', email);
    formData.append('mensaje', mensaje);

    // Enviar los datos al servidor a través de un archivo PHP
    fetch('./php/formulario_contacto.php', {
        method: 'POST',
        body: formData,
    })
        .then(response => {
            if (response.ok) {
                return response.text(); // Obtener respuesta como texto
            }
            throw new Error('Error al enviar datos al servidor');
        })
        .then(data => {
            console.log(data); // Ver el mensaje de éxito o error del servidor
            alert(data); // Mostrar un mensaje al usuario
            // Recargar la página después de mostrar el mensaje
            window.location.reload();
        })
        .catch(error => {
            console.error('Error:', error); // Manejar errores
            alert('Error al enviar la solicitud');
        });
});
