import { useState } from 'react'
import Input from '../form/Input'
import Select from '../form/Select'
import SubmitButton from '../form/SubmitButton'
import styles from './ProductForm.module.css'

export default function ProductForm({btnText,categories,handleSubmit,productData}){
    const [products,setProducts] = useState(productData || {})

    const submit = (e) => {
        e.preventDefault()
        handleSubmit(products)
    }

    function handleChange(e){
        setProducts({...products,[e.target.name]: e.target.value.trim()})
    }

    function handleCategory(e){
        setProducts({...products,[e.target.name]:e.target.options[e.target.selectedIndex].value})
    }

    function checkChar(e) {
        const char = String.fromCharCode(e.keyCode);
        const pattern = "[a-zA-Z0-9- ]";
  
        if (char.match(pattern) || e.keyCode == 8 || e.keyCode == 9) {
          return true
        }else{
          e.preventDefault()
        }
      }
    return (
            <form onSubmit={submit} className={styles.form}>
                <Input 
                    type="text" 
                    text="Product" 
                    name="name" 
                    placeholder="Enter a product"
                    handleOnChange={handleChange}
                    keyPressed={checkChar}
                />
                <Input 
                    type="number" 
                    text="Price" 
                    name="price" 
                    placeholder="Enter a price"
                    handleOnChange={handleChange}
                />
                <Input 
                    type="number" 
                    text="Amount" 
                    name="amount" 
                    placeholder="Enter a amount"
                    handleOnChange={handleChange}
                />
                <Select 
                    name="category_code"
                    text="Category"
                    options={categories}
                    handleOnChange={handleCategory}
                    />
                <SubmitButton text={btnText}/>
            </form>
        )
} 