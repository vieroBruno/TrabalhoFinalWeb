<?php

require_once('config.php');
header(header:'Access-Control-Allow-Origin: *');
header(header:'Access-Control-Allow-Headers: *');
header(header:'Access-Control-Allow-Methods: *');


class Categories {

    private static ?object $myPDO = null;

    private static function startConnection(): void {
        self::$myPDO = DataBaseConnection::getConnection();
    }

    public static function handleCategories(){
        self::startConnection();
        $method = $_SERVER['REQUEST_METHOD'];
        error_log('$method -> ' . $method);
         if ($method === 'GET') {
            return self::getCategories();
        } elseif ($method === 'POST') {
            return self::insertCategories();
        } elseif ($method === 'DELETE') {
            return self::deleteCategory();
        }

    }

    public static function getCategories(){

        try{
            $stmt = self::$myPDO->query("SELECT * FROM CATEGORIES");
            $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return json_encode($categories);
        }catch(PDOException $e){
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public static function insertCategories(){

        $data = json_decode(file_get_contents('php://input'),true);

        $category = $data['name'];
        $tax = $data['tax'];

        try{
            $stmt = self::$myPDO->prepare('INSERT INTO CATEGORIES (name,tax) VALUES(:category,:tax)');
            $stmt->bindParam(':category',$category);
            $stmt->bindParam(':tax',$tax);
            $stmt->execute();
            echo json_encode(['category' => $category , 'tax' => $tax]);

        }catch(PDOException $e){
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public static function deleteCategory(){
        $data = json_decode(file_get_contents('php://input'),true);

        $code = $data['code'];

         try{
             $stmt = self::$myPDO->prepare('DELETE FROM CATEGORIES WHERE CODE = :code');
             $stmt->bindParam(':code',$code);
             $stmt->execute();
             echo json_encode(['success' => true]);
        } catch(PDOException $e){
            echo json_encode(['error' => $e->getMessage()]);       

        }
    }

}

echo Categories::handleCategories();










