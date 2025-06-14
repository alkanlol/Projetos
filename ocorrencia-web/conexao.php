<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ocorrencia_webb";  // <- trocado aqui

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}
?>
