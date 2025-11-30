<?php

require_once( 'config.php');
header(header:'Access-Control-Allow-Origin: *');
header(header:'Access-Control-Allow-Headers: *');
header(header:'Access-Control-Allow-Methods: *');

class Products {
    private static ?object $myPDO = null;

    private static function startConnection(): void {
        
        self::$myPDO = DataBaseConnection::getConnection();
    
    }

    public static function handleProducts(){
        self::startConnection();
        $method = $_SERVER['REQUEST_METHOD'];
        error_log('$method -> ' . $method);
         if ($method === 'GET') {
            return self::getProducts();
        } elseif ($method === 'POST') {
            return self::insertProducts();
        } elseif ($method === 'DELETE') {
            return self::deleteProduct();
        } elseif ($method === 'PUT' && isset($_REQUEST['shouldUpdate'])) {
            return self::updateProduct();
        } else if ($method === 'PUT' && isset($_REQUEST['shouldUpdateAmount'])) {
            return self::updateAmountOfProduct();
        }

    }

    public static function getProducts(){
        $query = "SELECT 	
            P.CODE,
            P.NAME,
            AMOUNT,
            PRICE,
            C.NAME AS CATEGORY_NAME,
            CATEGORY_CODE
        FROM PRODUCTS AS P
        LEFT JOIN CATEGORIES AS C ON P.CATEGORY_CODE = C.CODE";

        if ( isset($_REQUEST['cdProduct']) ) {
            $code = $_REQUEST['cdProduct'];
            $where = " WHERE P.CODE = " . intval($code);
            $query .= $where;
        }

        $query .= " ORDER BY P.CODE ASC";

        try {
            $stmt = self::$myPDO->query($query);
            $products = $stmt->fetchAll(PDO::FETCH_ASSOC);    
            return json_encode($products);            
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public static function insertProducts(){
        $data = json_decode(file_get_contents('php://input'),true);

        $product = $data['name'];
        $amount = $data['amount'];
        $price = $data['price'];
        $category_code = $data['category_code'];

        try{
            $stmt = self::$myPDO->prepare('INSERT INTO PRODUCTS 
                                    (NAME,AMOUNT,PRICE,CATEGORY_CODE)
                                    VALUES (:product,:amount,:price,:category_code)');
            $stmt->bindParam(':product',$product);
            $stmt->bindParam(':amount',$amount);
            $stmt->bindParam(':price',$price);
            $stmt->bindParam(':category_code',$category_code);
            $stmt->execute();
            echo json_encode(['product' => $product , 'amount' => $amount , 'price' => $price , 'category_code' =>$category_code]);

        }catch(PDOException $e){
            echo json_encode(['error' => $e->getMessage()]);
        }

    }

    public static function deleteProduct(){

        $data = json_decode(file_get_contents('php://input'),true);

        $code = $data['code'];

        try{
            $stmt = self::$myPDO->prepare('DELETE FROM PRODUCTS WHERE CODE = :code');
            $stmt->bindParam(':code',$code);
            $stmt->execute();
            echo json_encode(['success' => true]);
        } catch(PDOException $e){
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public static function updateAmountOfProduct(){
        $data = json_decode(file_get_contents('php://input'), true);

        $product_code = $data['product_code'];
        $amount = $data['amount'];

        try {
            $stmt = self::$myPDO->prepare('UPDATE PRODUCTS AS P SET AMOUNT = P.AMOUNT + :amount WHERE code = :product_code');
            $stmt->bindParam(':amount', $amount);
            $stmt->bindParam(':product_code', $product_code);
            $stmt->execute();
            echo json_encode( ['success' => true]);
        } catch(PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public static function updateProduct(){
        $data = json_decode(file_get_contents('php://input'),true);

        $code = $data['product_code'];
        $name = $data['name'];
        $amount = $data['amount'];
        $price = $data['price'];
        $category_code = $data['category_code'];

        try{
            $stmt = self::$myPDO->prepare('UPDATE PRODUCTS 
                                    SET NAME = :name,
                                        AMOUNT = :amount,
                                        PRICE = :price,
                                        CATEGORY_CODE = :category_code
                                    WHERE CODE = :code');
            $stmt->bindParam(':name',$name);
            $stmt->bindParam(':amount',$amount);
            $stmt->bindParam(':price',$price);
            $stmt->bindParam(':category_code',$category_code);
            $stmt->bindParam(':code',$code);
            $stmt->execute();
            echo json_encode(['code' => $code , 'name' => $name , 'amount' => $amount , 'price' => $price , 'category_code' =>$category_code]);

        }catch(PDOException $e){
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

}

echo Products::handleProducts();





