<?php
include 'conexao.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $usuario = $_POST['loginUsuario'];
    $senha = $_POST['loginSenha'];

    $sql = "SELECT * FROM usuarios WHERE (email = ? OR nome = ?) AND senha = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sss", $usuario, $usuario, $senha);
    $stmt->execute();

    $resultado = $stmt->get_result();

    if ($resultado->num_rows > 0) {
        echo "<script>alert('Login bem-sucedido!'); window.location.href='index.html';</script>";
    } else {
        echo "<script>alert('Usuário ou senha inválidos!'); history.back();</script>";
    }

    $stmt->close();
    $conn->close();
}
?>
