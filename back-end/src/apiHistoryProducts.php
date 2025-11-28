<?php

require_once( 'config.php');
header(header:'Access-Control-Allow-Origin: *');
header(header:'Access-Control-Allow-Headers: *');
header(header:'Access-Control-Allow-Methods: *');


class ProductsHistory{
    private static ?object $myPDO = null;

    private static function startConnection(): void {
        
        self::$myPDO = DataBaseConnection::getConnection();
    
    }
    public static function handleProductsHistory(){
        self::startConnection();
        $method = $_SERVER['REQUEST_METHOD'];
        error_log('$method -> ' . $method);
         if ($method === 'GET') {
            return self::getProductsHistory();
        } 

    }

    public static function getProductsHistory(){

        try {

            $stmt = self::$myPDO->query("SELECT DISTINCT(P.CODE) AS CODE
                                    FROM PRODUCTS AS P
                                    JOIN ORDER_ITEM AS ODI ON ODI.PRODUCT_CODE = P.CODE ");
            $history = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return json_encode($history);      
            
        }catch(PDOException $e){
            echo json_encode(['error' => $e->getMessage()]);
        }
    }


}

echo ProductsHistory::handleProductsHistory();



