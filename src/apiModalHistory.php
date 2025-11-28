<?php

require_once('config.php');
header(header:'Access-Control-Allow-Origin: *');
header(header:'Access-Control-Allow-Headers: *');
header(header:'Access-Control-Allow-Methods: *');

class ModalHistory {

    private static ?object $myPDO = null;

    private static function startConnection(): void {
        
        self::$myPDO = DataBaseConnection::getConnection();
    
    }

    public static function handleModal(){
        self::startConnection();
        $method = $_SERVER['REQUEST_METHOD'];
        error_log('$method -> ' . $method);
         if ($method === 'GET') {
            return self::getModal();
        } 

    }

    public static function getModal(){
        $code = $_GET['index'];
            try{
        $stmt = self::$myPDO->prepare(" SELECT 	OD.CODE AS ORDER_CODE,
                                                ODI.CODE AS ODI_CODE,
                                                TO_CHAR(OD.DATE_ORDER, 'dd/mm/YYYY') as DATE_ORDER,
                                                P.CODE AS ITEM_CODE,
                                                P.NAME AS P_NAME,
                                                C.NAME AS C_NAME,
                                                TRUNC((ODI.TAX/100) * ODI.AMOUNT *ODI.PRICE,2) AS TAX,
                                                (ODI.AMOUNT * ODI.PRICE) AS TOTAL   
                                        FROM ORDERS AS OD
                                        LEFT JOIN ORDER_ITEM AS ODI ON OD.CODE = ODI.ORDER_CODE
                                        LEFT JOIN PRODUCTS AS P ON P.CODE = ODI.PRODUCT_CODE
                                        LEFT JOIN CATEGORIES AS C ON C.CODE = P.CATEGORY_CODE
                                        WHERE 1=1
                                        AND OD.STATUS = 0 
                                        AND OD.CODE = :code
                                        ORDER BY ITEM_CODE ASC");
                $stmt->bindParam(':code',$code);
                $stmt->execute();
                $modal = $stmt->fetchALL(PDO::FETCH_ASSOC);
        
                header(header:'Access-Control-Allow-Origin: *');
        
                echo json_encode($modal);
                
        
            }catch(PDOException $e){
                echo json_encode(['error' => $e->getMessage()]);
            }
    }

}
echo ModalHistory::handleModal();
