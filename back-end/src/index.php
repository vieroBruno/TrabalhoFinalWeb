<?php
require_once('config.php');

$conexao = DataBaseConnection::getConnection();


if ($conexao) {
    echo "<h3>Conexão bem-sucedida ao PostgreSQL!</h3>";
    echo "Status do objeto PDO: " . var_dump($conexao);
}