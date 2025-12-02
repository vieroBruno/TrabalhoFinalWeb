<?php

require_once( 'config.php');
header(header:'Access-Control-Allow-Origin: *');
header(header:'Access-Control-Allow-Methods: *');
header(header:'Access-Control-Allow-Headers: *');

class ProductsStore {
    private static ?object $myPDO = null;

    private static function startConnection(): void {
        
        self::$myPDO = DataBaseConnection::getConnection();
    
    }

    public static function handleProductsStore(){
        self::startConnection();
        $method = $_SERVER['REQUEST_METHOD'];
        error_log('$method -> ' . $method);
         if ($method === 'GET') {
            return self::getProductsStore();
        }  elseif ($method === 'DELETE') {
            return self::deleteProductStore();
        } elseif ($method === 'PUT'){
            return self::finishOrder();
        }

    }

    public static function getProductsStore(){
       
        try{
            $stmt = self::$myPDO->query('SELECT P.NAME,
                                            ODI.CODE,
                                            PRODUCT_CODE,
                                            ODI.AMOUNT,
                                            ODI.PRICE,
                                            ODI.TAX,
                                            ((ODI.TAX/100 * ODI.PRICE) * ODI.AMOUNT) AS TAX_ROW,
                                            (ODI.AMOUNT * ODI.PRICE) AS TOTAL_ROW,
                                            OD.TOTAL AS TOTAL,
                                            OD.TAX AS TAX_TOTAL,
                                            OD.CODE AS ORDER_CODE
                                    FROM ORDER_ITEM ODI
                                    LEFT JOIN ORDERS AS OD ON OD.CODE = ODI.ORDER_CODE
                                    LEFT JOIN PRODUCTS AS P ON ODI.PRODUCT_CODE = P.CODE
                                    WHERE 1=1
                                    AND OD.STATUS = 1
                                    ORDER BY ODI.CODE ASC');
            $productStore = $stmt->fetchAll(PDO::FETCH_ASSOC);


            return json_encode($productStore);

        }catch(PDOException $e){

                echo json_encode(['error' => $e->getMessage()]);
        }

    }

    public static function deleteProductStore(){
        $data = json_decode(file_get_contents('php://input'),true);

            $code = $data['code'];
            $total_row = $data['total_row'];
            $tax_row = $data['tax_row'];
        
            $totalProduct = floatval($total_row) + floatval($tax_row);

            try{
                $stmt2 = self::$myPDO->prepare('UPDATE ORDERS AS OD 
                                                SET TOTAL = OD.TOTAL - :totalProduct ,
                                                    TAX = OD.TAX - :tax_row
                                                WHERE STATUS =1');
                $stmt2->bindParam(':totalProduct',$totalProduct);
                $stmt2->bindParam(':tax_row',$tax_row);
                $stmt2->execute();
        
            }catch(PDOException $e){
                echo json_encode(['error' => $e->getMessage()]);
        
            }

            try{
                $stmt = self::$myPDO->prepare('DELETE FROM ORDER_ITEM WHERE CODE = :code');
                $stmt->bindParam(':code',$code);
                $stmt->execute();
                echo json_encode(['success' => true]);
            } catch(PDOException $e){
                echo json_encode(['error' => $e->getMessage()]);
            }
        
    }

    public static function finishOrder(){

        $data = json_decode(file_get_contents('php://input'), true);
        
        $timezone = new DateTimeZone('America/Sao_Paulo');
        $data_order = date('Y/m/d');
        $order_code = $data['order_code'];
        
        try {
            $stmt = self::$myPDO->prepare('UPDATE ORDERS SET STATUS = 0,DATE_ORDER =:data_order WHERE code = :order_code');
            $stmt->bindParam(':order_code', $order_code);
            $stmt->bindParam(':data_order', $data_order);
            $stmt->execute();
            echo json_encode(['success' => true]);
        } catch(PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
        
    }
}

echo ProductsStore::handleProductsStore();

