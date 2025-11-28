<?php

require 'config.php';
header(header:'Access-Control-Allow-Origin: *');
header(header:'Access-Control-Allow-Headers: *');
header(header:'Access-Control-Allow-Methods: *');

class ProductsAvailable{
    private static ?object $myPDO = null;

    private static function startConnection(): void {
        
        self::$myPDO = DataBaseConnection::getConnection();
    
    }

    public static function handleProductsAvailable(){
        self::startConnection();
        $method = $_SERVER['REQUEST_METHOD'];
        error_log('$method -> ' . $method);
         if ($method === 'GET') {
            return self::getProductsAvailable();
        } elseif ($method === 'PUT'){
            return self::updateProduct();
        }

    }

    public static function getProductsAvailable(){
        try{
            $stmt = self::$myPDO->query("SELECT 	
                                        P.CODE,
                                        P.NAME,
                                        AMOUNT,
                                        PRICE,
                                        C.NAME AS CATEGORY_NAME,
                                        CATEGORY_CODE,
                                        C.TAX
                                    FROM PRODUCTS AS P
                                    LEFT JOIN CATEGORIES AS C ON P.CATEGORY_CODE = C.CODE
                                    WHERE 1=1
                                    AND AMOUNT > 0
                                    ORDER BY P.CODE ASC");
            $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
            return json_encode($products);
        
            
        }catch(PDOException $e){
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public static function updateProduct(){
        $data = json_decode(file_get_contents('php://input'), true);

        $product_code = $data['product_code'];
        $amount = $data['amount'];

        try {
            $stmt = self::$myPDO->prepare('UPDATE PRODUCTS AS P SET AMOUNT = P.AMOUNT - :amount WHERE code = :product_code');
            $stmt->bindParam(':amount', $amount);
            $stmt->bindParam(':product_code', $product_code);
            $stmt->execute();
            echo json_encode(['success' => true]);
        } catch(PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}

echo ProductsAvailable::handleProductsAvailable();

