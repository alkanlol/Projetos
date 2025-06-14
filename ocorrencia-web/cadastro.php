<?php
include 'conexao.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nome = $_POST['cadastroNome'];
    $email = $_POST['cadastroEmail'];
    $telefone = $_POST['cadastroTelefone'];
    $cpf = $_POST['cadastroCPF'];
    $endereco = $_POST['cadastroEndereco'];
    $cidade = $_POST['cadastroCidade'];
    $estado = $_POST['cadastroEstado'];
    $senha = $_POST['cadastroSenha'];
    $confirmaSenha = $_POST['cadastroConfirmaSenha'];

    if ($senha !== $confirmaSenha) {
        echo "<script>alert('As senhas não coincidem!'); history.back();</script>";
        exit();
    }

    $sql = "INSERT INTO usuarios (nome, email, telefone, cpf, endereco, cidade, estado, senha)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssssss", $nome, $email, $telefone, $cpf, $endereco, $cidade, $estado, $senha);

    if ($stmt->execute()) {
        echo "<script>alert('Cadastro realizado com sucesso!'); window.location.href='login.html';</script>";
    } else {
        echo "<script>alert('Erro ao cadastrar: " . $conn->error . "'); history.back();</script>";
    }

    $stmt->close();
    $conn->close();
} else {
    echo "Acesso inválido.";
}
?>
