import styles from './Categories.module.css'
import CategoriesForm from '../categories/CategoriesForm'
import CategoriesTable from '../categories/CategoriesTable'

import { useEffect, useState } from 'react'

const urlCategory = "http://localhost/apiCategory.php"
const urlProducts = "http://localhost/apiProducts.php"



export default function Categories() {
    const [categories, setCategories] = useState([])
    const [products, setProducts] = useState([])


    async function verifyCategoryProducts(code){
        let boolean = 0 
        products.forEach((element) =>{
            if(element.category_code === code){
                boolean = 1
                return boolean;
            }
        })
        return boolean;
    }

    async function verifyCategory(name){
        let boolean = 0 
        categories.forEach((element) => {
            if(element.name == name){
                boolean = 1
                alert("Categoria já cadastrada")
                return boolean
            }
        })
        return boolean

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
    
    const fetchProducts = async (url) => {
        try {
            const res = await fetch(url);
            const data = await res.json();
            setProducts(data);
        } catch (e) {
            console.error(e)
        }
    }


    const fetchCategories = async (url) => {
        try {
            const res = await fetch(url);
            const data = await res.json();
            setCategories(data);
        } catch (e) {
            console.error(e)
        }
    }

    function validateString(string) {
        let limit = 30;
      
        if (string == "" || string == null) {
          alert("Categoria não pode ser vazia!");
          return 0;
        } else if (string.length > limit) {
          alert("Limite de caracteres para a categoria excedido!");
          return 0;
        }
        return 1;
    }

    function validateNumber(number) {
        if (number > 100) {
          alert("Taxa máxima : 100%");
          return 0;
        } else if (number == "" || number < 0 || isNaN(number)) {
          alert("Válor inválido!");
          return 0;
        }
        return 1;
    }

    function validation(name,tax){
        let validString = validateString(name?.trim());
        let verifyTax = validateNumber(tax);
      
        if(validString === 1 && verifyTax === 1){
            return 1
        }else
            return 0
        
      }

    async function createPost(category) {
        let verifyCat = await verifyCategory(category.name);
        let valid = validation(category.name,category.tax)

        if(verifyCat === 0 && valid === 1){
            await apiOptions(urlCategory,category,"POST")
            alert("Categoria cadastrada com sucesso!")
            await fetchCategories(urlCategory);
        }else{
            return;
        }

        await fetchCategories(urlCategory);
    }

    async function deleteCategory(code){
        let option = window.confirm("Deseja deletar essa categoria?");
        let verify = await verifyCategoryProducts(code);

        if(option){
            if(verify === 0){

                const data = {
                    code:code
                }
                await apiOptions(urlCategory,data,"DELETE")
                alert("Categoria deletada com sucesso!")
                await fetchCategories(urlCategory)
            } else{
                alert("Não foi possível excluir pois existe um produto cadastrado com essa categoria!")
            }
            
        }else return;
        await fetchCategories(urlCategory)

    
    }

    useEffect(() => {
        fetchCategories(urlCategory)
        fetchProducts(urlProducts)
    }, [])


    return (
        <div className={styles.categories_container}>
            <section className={styles.first_column}>
                <h1>Add a new category!</h1>
                <CategoriesForm handleSubmit={createPost} btnText="Add Category" />
            </section>
            <section className={styles.second_column}>
                <h1>Table</h1>
                <CategoriesTable categories={categories} deleteCategory={deleteCategory}/>
            </section>
        </div>
    )
}