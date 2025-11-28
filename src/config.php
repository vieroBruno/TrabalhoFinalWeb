<?php 

class DataBaseConnection {
    private static string $host,$db,$user,$pw;

    private static function start(): void{

        if(!isset(self::$host)){
            self::$host = 'temquemudar';
            self::$db = 'temquemudar';
            self::$user = 'temquemudar';
            self::$pw = 'temquemudar';
        }

    }

    public static function getConnection(): ?object{
        self::start();

        try { 
            $myPDO = new PDO('pgsql:host=' . self::$host . ';dbname=' . self::$db, self::$user,self::$pw);
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
