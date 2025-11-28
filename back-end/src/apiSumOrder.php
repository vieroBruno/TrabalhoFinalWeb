<?php

require_once( 'config.php');
header(header:'Access-Control-Allow-Origin: *');
header(header:'Access-Control-Allow-Headers: *');
header(header:'Access-Control-Allow-Methods: *');

class SumOrder {
    private static ?object $myPDO = null;

    private static function startConnection(): void {
        
        self::$myPDO = DataBaseConnection::getConnection();
    
    }

    public static function handleSumOrder(){
        self::startConnection();
        $method = $_SERVER['REQUEST_METHOD'];
        error_log('$method -> ' . $method);
          if ($method === 'PUT'){
            return self::updateProductOrder();
        }

    }

    public static function updateProductOrder(){
        $data = json_decode(file_get_contents('php://input'), true);
        $amount = $data['amount'];
        $price = $data['price'];
        $tax = $data['tax'];

        $total = (floatval($amount) * floatval($price));
        //calcula o total de cada linha 
        $taxTotal = (floatval($tax)/100 * floatval($total));
        //calcula a taxa total em valor de cada linha

        try{
            $stmtUpdate = self::$myPDO->prepare('UPDATE ORDERS AS OD 
                                            SET TOTAL = OD.TOTAL + :total +:taxTotal,
                                                TAX = OD.TAX + :taxTotal
                                            WHERE STATUS =1');
            $stmtUpdate->bindParam(':total',$total);
            $stmtUpdate->bindParam(':taxTotal',$taxTotal);
            $stmtUpdate->execute();
            echo json_encode(['success' => true]);
            
        }catch(PDOException $e){
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}

echo SumOrder::handleSumOrder();


