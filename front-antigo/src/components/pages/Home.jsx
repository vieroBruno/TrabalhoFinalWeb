import { useEffect, useState } from 'react'
import HomeForm from '../home/HomeForm'
import styles from './Home.module.css'
import HomeTable from '../home/HomeTable'
import Input from '../form/Input'
import SubmitButton from '../form/SubmitButton'

const urlProductsAvailable = 'http://localhost/apiProductsAvailable.php'
const urlApiProducts = "http://localhost/apiProducts.php"
const urlApiProductsStore = "http://localhost/apiProductsStore.php";
const urlApiStore = 'http://localhost/apiStore.php';
const urlDeleteStore = "http://localhost/apiDeleteStore.php"
const urlApiSumOrder = "http://localhost/apiSumOrder.php";



export default function Home() {
    const [products, setProducts] = useState([])
    const [productsStore, setProductsStore] = useState([])
    const [orderCode, setOrderCode] = useState(0)
    const [total,setTotal] = useState(0)
    const [totalTax,setTotalTax] = useState(0)


    async function getOrderCode(url){
        try{
            const resp = await fetch(url)
            const data = await resp.json()
            if(data.length > 0){
                setOrderCode(data[0].code)
            }
        }catch(e){
            console.log(e)
        }
        
    }
    async function getProductsAvailable(url){
        try{
            const resp = await fetch(url)
            const data = await resp.json()
                setProducts(data)
        }catch(e){
            console.log(e)
        }
    
    }

    async function getProductsStore(url){

        try{
            const resp = await fetch(url)
            const data = await resp.json()
                setProductsStore(data)
        }catch(e){
            console.log(e)
        }
    
    }

    async function apiOptions(url,body,method){
        await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        })   
    }
    async function controlStock(body){
        const dataUpdate={
            product_code:body.product_code,
            amount:body.amount,
        }
        await apiOptions(urlProductsAvailable,dataUpdate,"PUT")
    }

    async function verifyStock(code){
        for(let i = 0 ; i < products.length ; i++){
            if(products[i].code == code){
                return parseFloat(products[i].amount)
            }
        }

        return 0;
    }
    async function verifyStore(code){
        let codeStore = 0
        productsStore.forEach((element) => {
            if(element.product_code == code){
                codeStore = element.code
                return codeStore
            }
        })
        return codeStore
    }
    async function createPost(productsStore){
        const body = {...productsStore, order_code: orderCode}

        let available = await verifyStock(body.product_code)
        let validStore = await verifyStore(body.product_code)
        let valiAmount = validateNumber(body.amount)
        let validProduct = await verifiedProduct(body.product_code)

        const dataUpdate = {
            product_code:body.product_code,
            amount:body.amount
        }
        if(valiAmount === 0 || validProduct === 0){
            return;
            
        }else if(validStore !== 0 && available >= body.amount){
            await apiOptions(urlApiStore,dataUpdate,"PUT");
            await controlStock(body)
            await apiOptions(urlApiSumOrder,body,"PUT")
            alert("Produto já existente,quantia adicionada com sucesso!");
        }else if(available >= body.amount){
            await apiOptions(urlApiStore,body,"POST")
            await controlStock(body)
            alert("Produto adicionado com sucesso!")
        }else{
           alert("Quantidade não disponivel no estoque! \nQuantidade disponivel: " +available);
        }

        await getProductsAvailable(urlProductsAvailable)
        await getProductsStore(urlApiProductsStore)
        await getOrderCode(urlApiStore)

    }
    
    async function deleteProductStore(code,amount,total_row,tax_row,product_code){
        
        if(window.confirm("Deseja deletar esse produto?")){

            const data = {
                code:code,
                total_row:total_row,
                tax_row:tax_row
            }
            
            await apiOptions(urlApiProductsStore,data,"DELETE")
            await sumStock(product_code,amount)
        
        }else return;
        getProductsStore(urlApiProductsStore)
        getProductsAvailable(urlProductsAvailable)

    }
    async function sumStock(code,amount) {
       const data ={
        product_code:code,
        amount:amount
       }
       await apiOptions(urlApiProducts, data,"PUT");
 
    }
    async function finishStore(){
        const data = {
            order_code:orderCode
        }
        if(productsStore.length === 0){
            alert("Nenhum produto no carrinho!");
            return
        }
        await apiOptions(urlApiProductsStore,  data,"PUT");
        alert("Compra efetuada com sucesso!")
        await getOrderCode(urlApiStore)
        getProductsStore(urlApiProductsStore)

    }
    async function cancelStore(){
        let option = window.confirm("Você tem certeza que deseja cancelar a compra?")
        if(option){
            if(productsStore.length === 0){
                alert("Nenhum produto no carrinho!");
                return
            }
            await sumStockCancel();
            const data ={
                order_code:orderCode,
            };
            await apiOptions(urlDeleteStore,data,"DELETE");
            await getOrderCode(urlApiStore)
            await getProductsStore(urlApiProductsStore)

        }else return;
    }
    async function sumStockCancel() {             
        for(let i = 0 ; i < productsStore.length; i++){
            await sumStock(productsStore[i].product_code,productsStore[i].amount)
        }
    }

    function validateNumber(number){
        if (number.length > 8) {
            alert("Valor máximo excedido!");
            return 0;
          } else if (number == "" || number < 0 || isNaN(number) || number == 0) {
            alert("Válor inválido");
            return 0;
          }
          return 1;
    }

    async function verifiedProduct(code) {      
        for (let i = 0; i < products.length; i++) {
          if (products[i].code == code) {
            return 1;
          }
        }
        alert("Nenhum produto foi selecionado ou produto não existe!");
        return 0;
      }

    useEffect(() => {
        getProductsAvailable(urlProductsAvailable)
        getOrderCode(urlApiStore)
        getProductsStore(urlApiProductsStore)

    }, [])

    useEffect(() => {
       const total = productsStore[0]?.total
       const taxTotal = productsStore[0]?.tax_total
       setTotal(total)
       setTotalTax(taxTotal)

    }, [productsStore])



    return (
    <div className={styles.home_container}>
        <section className={styles.first_column}>
                <h1>Add a product to store!</h1>
                <HomeForm btnText="Add Product" products={products} orderCode={orderCode} handleSubmit={createPost} handleOrder={getOrderCode}/>
        </section>
        <section className={styles.second_column}>
                <h1>Table</h1>
                <HomeTable productsStore={productsStore} deleteProductStore={deleteProductStore}/>
                <div className={styles.final_input}>
                    <Input 
                    text="Tax"
                    disabled='true'
                    variant='input'
                    value={totalTax == null ? 'R$0,00':'R$'+totalTax}/>
                    <Input 
                    text="Total"
                    disabled='true'
                    variant='input'
                    value={totalTax == null ? 'R$0,00':'R$'+total}/>
                </div>
                <div className={styles.final_button}>
                    <SubmitButton 
                    text='Cancel'
                    variant='cancel'
                    handleCancel={async() => await cancelStore()}/>
                    <SubmitButton
                    text='Finish'
                    variant='finish'
                    handleFinish={async() => await finishStore()}
                    />
                    <Input 
                    type="number" 
                    name="codeOrder"
                    variant='true'
                    />
                </div>
        </section>
        </div>

    )
}