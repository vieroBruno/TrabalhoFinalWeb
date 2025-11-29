<?php 

class DataBaseConnection {
    private static string $host,$db,$user,$pw;

    private static function start(): void{

        if(!isset(self::$host)){
            self::$host = '127.0.0.1';
            self::$db = 'ponto_venda';
            self::$user = 'postgres';
            self::$pw = '123456';
        }

    }

    public static function getConnection(): ?object{
        self::start();

        try { 
            $myPDO = new PDO('pgsql:host=' . self::$host . ';port=5433;dbname=' . self::$db, self::$user,self::$pw);
            $myPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            return $myPDO;
        } catch (PDOException $e){

            echo "Falhar ao conectar com o banco de dados. <br>";
            die($e->getMessage());
            error_log('Erro ao tentar acessar ao banco de dados');
            return null;
        }
    }
}
