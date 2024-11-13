<?php
// // Configuración de la base de datos
// $servername = "localhost";
// $username = "root";
// $password = "root1234_";
// $dbname = "jakestudio_v2";
// // Conexión a la base de datos diferente:CAMBIAR
// // Crear conexión
// $conn = new mysqli($servername, $username, $password, $dbname);

// // Comprobar la conexión
// if ($conn->connect_error) {
//     die("Conexión fallida: " . $conn->connect_error);
// }

// // Consulta para obtener todos los datos de la tabla reservas
// $sql = "SELECT fecha, hora_inicio, hora_fin FROM reservas";
// $result = $conn->query($sql);

// // Verificar si hay resultados
// $reservas = [];
// if ($result->num_rows > 0) {
//     // Recorrer los resultados y añadir cada registro al array
//     while ($row = $result->fetch_assoc()) {
//         $reservas[] = [
          
//             "fecha" => $row["fecha"],
//             "hora_inicio" => $row["hora_inicio"],
//             "hora_fin" => $row["hora_fin"]
//         ];
//     }
// }

// // Retornar todos los datos de reservas como JSON
// header('Content-Type: application/json');
// echo json_encode($reservas);

// // Cerrar conexión
// $conn->close();
// anterio codigo con base mysql y solo obtiene fehca, hora, hora fin^

// Configuración de la base de datos
// $servername = "localhost";
// $username = "root";
// $password = "root1234_";
// $dbname = "jakestudio_v2";

// // Crear conexión
// $conn = new mysqli($servername, $username, $password, $dbname);

// // Comprobar la conexión
// if ($conn->connect_error) {
//     die("Conexión fallida: " . $conn->connect_error);
// }

// // Consulta para obtener todos los datos, incluyendo el nombre
// $sql = "SELECT fecha, hora_inicio, hora_fin, nombre FROM reservas";
// $result = $conn->query($sql);

// // Verificar si hay resultados
// $reservas = [];
// if ($result->num_rows > 0) {
//     // Recorrer los resultados y añadir cada registro al array
//     while ($row = $result->fetch_assoc()) {
//         $reservas[] = [
//             "fecha" => $row["fecha"],
//             "hora_inicio" => $row["hora_inicio"],
//             "hora_fin" => $row["hora_fin"],
//             "nombre" => $row["nombre"] // El campo nombre se incluye, pero el JS no lo necesita
//         ];
//     }
// }

// // Retornar todos los datos de reservas como JSON
// header('Content-Type: application/json');
// echo json_encode($reservas);

// // Cerrar conexión
// $conn->close();
// ----//////////-----------
// $conn = new mysqli($servername, $username, $password, $dbname);

// // Comprobar la conexión
// if ($conn->connect_error) {
//     die("Conexión fallida: " . $conn->connect_error);
// }

// // Consulta para obtener todos los datos, incluyendo el nombre
// $sql = "SELECT fecha, hora_inicio, hora_fin, nombre FROM reservas";
// $result = $conn->query($sql);

// // Verificar si hay resultados
// $reservas = [];
// if ($result->num_rows > 0) {
//     // Recorrer los resultados y añadir cada registro al array
//     while ($row = $result->fetch_assoc()) {
//         $reservas[] = [
//             "fecha" => $row["fecha"],
//             "hora_inicio" => $row["hora_inicio"],
//             "hora_fin" => $row["hora_fin"],
//             "nombre" => $row["nombre"] // El campo nombre se incluye, pero el JS no lo necesita
//         ];
//     }
// }

// // Retornar todos los datos de reservas como JSON
// header('Content-Type: application/json');
// echo json_encode($reservas);

// // Cerrar conexión
// $conn->close();
// anterio codigo  con conf de base de datos mysql y nube solo obtiene fehca, hora, hora fin nombre, para js de admin^

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Comprobar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Consulta para obtener todos los datos, incluyendo el id
$sql = "SELECT id, fecha, hora_inicio, hora_fin, nombre FROM reservas";
$result = $conn->query($sql);

// Verificar si hay resultados
$reservas = [];
if ($result->num_rows > 0) {
    // Recorrer los resultados y añadir cada registro al array
    while ($row = $result->fetch_assoc()) {
        $reservas[] = [
            "id" => $row["id"],                // Agregamos el id a cada reserva
            "fecha" => $row["fecha"],
            "hora_inicio" => $row["hora_inicio"],
            "hora_fin" => $row["hora_fin"],
            "nombre" => $row["nombre"]
        ];
    }
}

// Retornar todos los datos de reservas como JSON
header('Content-Type: application/json');
echo json_encode($reservas);

// Cerrar conexión
$conn->close();

?>
