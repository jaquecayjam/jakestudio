<?php
// Iniciar la sesión
session_start();

// Si ya está logueado, redirige al panel de administrador
if (isset($_SESSION['usuario'])) {
    header("Location: panel_admin.php");
    exit();
}

// Conexión a la base de datos diferente:CAMBIAR
$servername = "localhost";
$username = "root"; // Tu usuario de la base de datos
$password = "root1234_"; // Tu contraseña de la base de datos
$dbname = "jakestudio_v2"; // El nombre de tu base de datos

// Crear la conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar si hay errores en la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Verificar si el formulario fue enviado
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Extraogo el correo y la contraseña del formulario
    $email = $_POST['email'];
    $clave = $_POST['clave'];

    // Consulta para obtener el usuario
    $sql = "SELECT * FROM usuarios WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email); // 's' para indicar que el parámetro es una cadena/string
    $stmt->execute();
    $result = $stmt->get_result();

    // Verificar si el correo existe
    if ($result->num_rows > 0) {
        // El usuario existe, obtener los datos
        $row = $result->fetch_assoc();
        // Verificar si la contraseña es correcta
        if (password_verify($clave, $row['password'])) { // Compara la contraseña con la hash
            // Si la contraseña es correcta, inicia sesión
            $_SESSION['usuario'] = $row['email']; // Guarda el email del usuario en la sesión

            // Redirigir al panel de administración
            header("Location: panel_admin.php");
            exit();
        } else {
            echo "Contraseña incorrecta.";
        }
    } else {
        echo "El correo no está registrado.";
    }

    // Cerrar la conexión
    $stmt->close();
    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Iniciar sesión</title>
</head>
<body>
    <h2>Iniciar sesión</h2>
    <form action="login.php" method="POST">
        <label for="email">Correo electrónico:</label>
        <input type="email" name="email" id="email" required><br>

        <label for="clave">Contraseña:</label>
        <input type="password" name="clave" id="clave" required><br>

        <input type="submit" value="Iniciar sesión">
    </form>
</body>
</html>
