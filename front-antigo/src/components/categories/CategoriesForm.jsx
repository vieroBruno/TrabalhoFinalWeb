import styles from './CategoriesForm.module.css'
import Input from '../form/Input'
import SubmitButton from '../form/SubmitButton'

import {useEffect, useState} from 'react'
import CategoriesTable from './CategoriesTable'
import CategoriesRow from '../table/CategoriesRow'

export default function CategoriesForm({handleSubmit,btnText,catData}){
    const [category,setCategory] = useState(catData || {})

    const submit = (e) => {
        e.preventDefault()
        handleSubmit(category)
    }

    function handleChange(e){
            setCategory({...category,[e.target.name]: e.target.value.trim()})
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
            <Input type="text" 
            text="Category" 
            name="name" 
            placeholder="Enter a category"
            handleOnChange={handleChange}
            keyPressed={checkChar}/>
            <Input type="number" 
            text="Tax" 
            name="tax" 
            placeholder="Enter a tax"
            handleOnChange={handleChange}/>

            <SubmitButton text={btnText}/>
        </form>
    )
}