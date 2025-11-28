<?php

require_once( 'config.php');
header(header:'Access-Control-Allow-Origin: *');
header(header:'Access-Control-Allow-Headers: *');
header(header:'Access-Control-Allow-Methods: *');

class History{
    private static ?object $myPDO = null;

    private static function startConnection(): void {
        
        self::$myPDO = DataBaseConnection::getConnection();
    
    }

    public static function handleHistory(){
        self::startConnection();
        $method = $_SERVER['REQUEST_METHOD'];
        error_log('$method -> ' . $method);
         if ($method === 'GET') {
            return self::getHistory();
        } 

    }

    private static function getHistory(){
        try{
                    $stmt = self::$myPDO->query("SELECT OD.CODE AS ORDER_CODE,
                                                  OD.TAX,
                                                  OD.TOTAL
                                            FROM ORDERS AS OD
                                            WHERE 1=1
                                            AND STATUS = 0
                                            ORDER BY ORDER_CODE ASC");
                    $history = $stmt->fetchALL(PDO::FETCH_ASSOC);
                    header(header:'Access-Control-Allow-Origin: *');
            
                    echo json_encode($history);
                    
            
                }catch(PDOException $e){
                    echo json_encode(['error' => $e->getMessage()]);
                }
    }
}

echo History::handleHistory();

