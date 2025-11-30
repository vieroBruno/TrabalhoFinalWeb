import { useEffect, useState } from 'react'
import ProductForm from '../product/ProductForm'
import styles from './Products.module.css'
import ProductTable from '../product/ProductTable'

const urlProducts= 'http://localhost/apiProducts.php'
const urlCategory= 'http://localhost/apiCategory.php'
const urlApiProductsHistory = "http://localhost/apiHistoryProducts.php"


export default function Products() {
        const [products, setProducts] = useState([])
        const [categories, setCategories] = useState([])
        const [history, setHistory] = useState([])

        async function getHistory(url) {
            try {
                const res = await fetch(url);
                const data = await res.json();
                setHistory(data);     
            } catch (e) {
                console.error(e)
            }
        }


        async function getCategories(url) {
            try {
                const res = await fetch(url);
                const data = await res.json();
                    setCategories(data);
            } catch (e) {
                console.error(e)
            }
        }
        async function getProducts(url) {
            try {
                const res = await fetch(url);
                const data = await res.json();
                    setProducts(data);
                
            } catch (e) {
                console.error(e)
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
        async function verifyProduct(name) {
            let code = 0;
            products.forEach((element) => {
              if (element.name === name) {
                code = element.code;
                return code;
              }
            });
          
            return code;
          }


        async function createPost(products) {
            let code = await verifyProduct(products.name)
            let valid = await validation(products)

            const dataUpdate = {
                product_code: code,
                amount:products.amount
            }

            if(code !== 0 && valid === 1){
                await apiOptions(urlProducts,dataUpdate,"PUT")
                alert("Produto já existente, quantia adicionada com sucesso");

            }else if(valid === 1){
                await apiOptions(urlProducts,products,"POST")
                alert("Produto cadastrado com sucesso!")
                await getProducts(urlProducts);
            }
            await getProducts(urlProducts);
        }

        async function verifyHistory(code){
            for(let i = 0 ; i < history.length ; i++){
                if(history[i].code == code){
                    alert("Erro ao excluir, produto existente do history ou no carrinho!")
                    return 0;
                }
          
            }
            return 1;
          
          }

        async function deleteProduct(code){
            const data = {
                code:code
            }
            let verify = await verifyHistory(code)
            if(verify === 1){
                await apiOptions(urlProducts,data,"DELETE")
                alert("Produto deletado com sucesso!")

            }
            await getProducts(urlProducts)
        }
    
    useEffect(() => {
        getProducts(urlProducts)
        getCategories(urlCategory)
        getHistory(urlApiProductsHistory)
    }, [])

    function validateString(string) {
        let limit = 30;
      
        if (string == "" || string == null) {
          alert("String não pode ser vazia!");
          return 0;
        } else if (string.length > limit) {
          alert("Limite de caracteres para o produto excedido!");
          return 0;
        }
        return 1;
      }

      function validateNumber(number) {
        if (number.length > 8) {
          alert("Valor máximo excedido!");
          return 0;
        } else if (number == "" || number < 0 || isNaN(number) || number == 0) {
          alert("Válor inválido");
          return 0;
        }
        return 1;
      }

      async function verifiedCategory(category_code) {      
        for (let i = 0; i < categories.length; i++) {
          if (categories[i].code == category_code) {
            return 1;
          }
        }
        alert("Categoria não existente!");
        return 0;
      }

      async function validation(products){
        let validProduct = validateString(products.name);
        let validAmount = validateNumber(products.amount);
        let validPrice = validateNumber(products.price);
        let validCategory = await verifiedCategory(products.category_code);
      
        if(validProduct === 1 && validAmount === 1 && validPrice ===1 && validCategory ===1){
            return 1
        }else
            return 0
        
      }
    return (
         <div className={styles.products_container}>
                <section className={styles.first_column}>
                        <h1>Add a product !</h1>
                        <ProductForm btnText="Add Product" categories={categories} handleSubmit={createPost}/>
                </section>
                <section className={styles.second_column}>
                        <h1>Table</h1>
                        <ProductTable products={products} deleteProducts={deleteProduct}/>
                </section>
        </div>

    )
}