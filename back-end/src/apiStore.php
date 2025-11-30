<?php

require_once( 'config.php');
header(header:'Access-Control-Allow-Origin: *');
header(header:'Access-Control-Allow-Headers: *');
header(header:'Access-Control-Allow-Methods: *');


class Store {
    private static ?object $myPDO = null;

    private static function startConnection(): void {        
        self::$myPDO = DataBaseConnection::getConnection();
    }

    public static function handleStore(){
        self::startConnection();
        $method = $_SERVER['REQUEST_METHOD'];
        error_log('$method -> ' . $method);
         if ($method === 'GET') {
            return self::getStore();
        } elseif ($method === 'POST') {
            return self::insertStore();
        } elseif ($method === 'PUT') {
            return self::updateItemStore();
        } 
    }

    public static function getStore(){
        try{
            $stmt = self::$myPDO->query(
                "SELECT CODE 
                 FROM ORDERS
                 WHERE STATUS = 1");
            $order = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return json_encode($order);        
            
        }catch(PDOException $e){
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public static function insertStore(){
            $data = json_decode(file_get_contents('php://input'),true);

            $order_code = $data['order_code'];
            $product_code = $data['product_code'];
            $amount = $data['amount'];
            $price = $data['price'];
            $tax = $data['tax'];
        
            $total = (floatval($amount) * floatval($price));
            //calcula o total de cada linha 
            $taxTotal = (floatval($tax)/100 * floatval($total));
            //calcula a taxa total em valor de cada linha
            try{
                $stmt1 = self::$myPDO->query('SELECT COUNT(*) 
                                              FROM ORDERS
                                              WHERE STATUS = 1');
                //Verifica se existe algum pedido de compra aberto
                $count = $stmt1->fetchColumn();
                //recebe a quantidade de linhas retornadas e se retornar 1 significa que já existe uma ordem de compra aberta
                //e se retornar 0 significa que não há nenhuma orderm ativa
            }catch(PDOException $e){
                echo json_encode(['error' => $e->getMessage()]);
            }
        
            if($count == 0){
                echo json_encode(['total' => $total , 'taxTotal' => $taxTotal ]);
                $total = $total + $taxTotal;
                //se não exister nenhuma ordem de compra, cria uma nova
                try{
                    $stmt2 = self::$myPDO->prepare('INSERT 
                                                    INTO ORDERS 
                                                    (TOTAL,TAX,STATUS)
                                                    VALUES (:total,:tax,1)');
                    $stmt2->bindParam(':total',$total);
                    $stmt2->bindParam(':tax',$taxTotal);
                    $stmt2 ->execute();
                }catch(PDOException  $e){
                    echo json_encode(['error' => $e->getMessage()]);
                }
                // seleciona o código da nova ordem de compra
                try{
                    $stmt3 = self::$myPDO->prepare('SELECT MAX(CODE) AS CODE
                                                    FROM ORDERS ');
                    $stmt3 ->execute();
                    $newOrder_code = $stmt3->fetchColumn();
                }catch(PDOException $e){
                    echo json_encode(['error' => $e->getMessage()]);
                }
                // insere o produto na tabela de itens da compra pegando o novo código da compra
                try{
                        $stmt4 = self::$myPDO->prepare('INSERT INTO ORDER_ITEM 
                                                        (ORDER_CODE,PRODUCT_CODE,AMOUNT,PRICE,TAX) 
                                                        VALUES(:newOrder_code,:product_code,:amount,:price,:tax)');
                        $stmt4->bindParam(':newOrder_code',$newOrder_code);
                        $stmt4->bindParam(':product_code',$product_code);
                        $stmt4->bindParam(':amount',$amount);
                        $stmt4->bindParam(':price',$price);
                        $stmt4->bindParam(':tax',$tax);
                        $stmt4->execute();
                       
                }catch(PDOException $e){
                    echo json_encode(['error' => $e->getMessage()]);
                }
        
            }else
        
            if($count != 0){
                echo json_encode(['order_code' => $order_code  ]);

                try {
                    $stmtOrder = self::$myPDO->query('SELECT CODE FROM ORDERS WHERE STATUS = 1 LIMIT 1');
                    $activeOrderCode = $stmtOrder->fetchColumn();
                    
                    if ($activeOrderCode) {
                        $order_code = $activeOrderCode;
                    }
                } catch(PDOException $e) {
                    echo json_encode(['error' => $e->getMessage()]);
                }

                try{
                        $stmt = self::$myPDO->prepare('
                        INSERT INTO ORDER_ITEM 
                        (ORDER_CODE, 
                         PRODUCT_CODE,
                         AMOUNT,
                         PRICE,
                         TAX) 
                        VALUES(:order_code,:product_code,:amount,:price,:tax)');
                    $stmt->bindParam(':order_code',$order_code);
                    $stmt->bindParam(':product_code',$product_code);
                    $stmt->bindParam(':amount',$amount);
                    $stmt->bindParam(':price',$price);
                    $stmt->bindParam(':tax',$tax);
                    $stmt->execute();
                   
                
                }catch(PDOException $e){
                    echo json_encode(['error' => $e->getMessage()]);
                }
                //atualiza os campos do total da compra e da taxa total acrescentado o valor registro por registro
               
        
                // echo json_encode(['total' => $total , 'taxTotal' => $taxTotal ]);
                try{
                    $stmtUpdate = self::$myPDO->prepare('UPDATE ORDERS AS OD 
                                                            SET TOTAL = OD.TOTAL + :total +:taxTotal,
                                                                TAX = OD.TAX + :taxTotal
                                                          WHERE STATUS =1');
                    $stmtUpdate->bindParam(':total',$total);
                    $stmtUpdate->bindParam(':taxTotal',$taxTotal);
                    $stmtUpdate->execute();
                    
                }catch(PDOException $e){
                    echo json_encode(['error' => $e->getMessage()]);
                }
            }
    }

    public static function updateItemStore(){
        $data = json_decode(file_get_contents('php://input'), true);    
        $product_code = $data['product_code'];
        $amount = $data['amount'];
        
        try {
                $stmt = self::$myPDO->prepare('UPDATE ORDER_ITEM AS ODI 
                                                  SET AMOUNT = ODI.AMOUNT + :amount
                                                WHERE PRODUCT_CODE = :product_code');
                $stmt->bindParam(':amount', $amount);
                $stmt->bindParam(':product_code', $product_code);
                $stmt->execute();
                echo json_encode(['success' => true]);
        } catch (PDOException $e) {
                echo json_encode(['error' => $e->getMessage()]);
            }             
    }

}
echo Store::handleStore();



