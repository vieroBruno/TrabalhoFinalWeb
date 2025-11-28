<?php

require_once( 'config.php');
header(header:'Access-Control-Allow-Origin: *');
header(header:'Access-Control-Allow-Headers: *');
header(header:'Access-Control-Allow-Methods: *');

class DeleteStore {
        private static ?object $myPDO = null;

        private static function startConnection(): void {
            self::$myPDO = DataBaseConnection::getConnection();
        }

        public static function handleDelete(){
            self::startConnection();
            $method = $_SERVER['REQUEST_METHOD'];
            error_log('$method -> ' . $method);
             if ($method === 'DELETE') {
                return self::deleteStore();
            } 
    
        }

        public static function deleteStore(){
            $data = json_decode(file_get_contents('php://input'),true);

            $order_code = $data['order_code'];

            try{
                $stmt = self::$myPDO->prepare('DELETE FROM ORDER_ITEM WHERE ORDER_CODE = :order_code');
                $stmt->bindParam(':order_code',$order_code);
                $stmt->execute();

            }catch(PDOException $e){
                    echo json_encode(['error'=> $e->getMessage()]);
            }

            try{
                $stmt2 = self::$myPDO->prepare('DELETE FROM ORDERS WHERE CODE = :order_code');
                $stmt2->bindParam(':order_code',$order_code);
                $stmt2->execute();
                
                echo json_encode(['success' => true]);
            }catch(PDOException $e){
                echo json_encode(['error' => $e->getMessage()]);
            }
        }

}
echo DeleteStore::handleDelete();


