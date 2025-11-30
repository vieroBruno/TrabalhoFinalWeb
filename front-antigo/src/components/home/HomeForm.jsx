import Input from "../form/Input";
import SubmitButton from "../form/SubmitButton";
import styles from '../form/Form.module.css'
import Select from "../form/Select";
import { useEffect, useState } from "react";
const urlApiStore = 'http://localhost/apiStore.php';


export default function HomeForm({products,btnText,storeData,handleSubmit,orderCode,handleOrder}){
    const [productsStore, setProductsStore] = useState(orderCode || [])
    const [tax, setTax] = useState(0);
    const [price, setPrice] = useState(0);

    const submit = (e) =>{
        e.preventDefault()
        handleSubmit({...productsStore, tax, price})
    }

     useEffect(() => {
        if (!productsStore || !products) {
            return;
        }
        const selectedProduct = products.find((p) => p.code == productsStore?.product_code);
        setTax(selectedProduct?.tax);
        setPrice(selectedProduct?.price);
    }, [productsStore])


    function handleChange(e){
        setProductsStore({...productsStore,[e.target.name]:e.target.options[e.target.selectedIndex].value})
    }

    function handleChangeInputs(e){
        setProductsStore({...productsStore,[e.target.name]:e.target.value})
    }
    
    return (
            <form  onSubmit={submit} className={styles.form}>
                 <Select 
                    name="product_code"
                    text="Product"
                    options={products}
                    handleOnChange={handleChange}
                    />
                <Input 
                    type="number" 
                    text="Amount" 
                    name="amount" 
                    placeholder="Enter a amount"
                    handleOnChange={handleChangeInputs}
                />
                <Input 
                    type="text" 
                    text="Tax" 
                    name="tax" 
                    placeholder="Tax"
                    disabled='true'
                    value={tax == null ? '0%':tax+'%'}
                    handleOnChange={handleChangeInputs}
                />
                <Input 
                    type="text" 
                    text="Price" 
                    name="price" 
                    placeholder="Price"
                    disabled='true'
                    value={price == null ? 'R$0,00':'R$'+price}
                    handleOnChange={handleChangeInputs}
                />
                <SubmitButton text={btnText}/>
            </form>
    )
}