import styles from '../table/Table.module.css'
import {useEffect, useState} from 'react'
import CategoriesRow from '../table/CategoriesRow'
import TableHead from '../table/TableHead'
const urlCategory = "http://localhost/apiCategory.php"

export default  function CategoriesTable({categories, deleteCategory}){
    const headers = ['Code','Category','Tax','Action']
    console.log(categories)
    
    return(
        <>
            <table >
                <thead>
                    <tr>
                       <TableHead headers={headers}/>
                    </tr>
                </thead>
                <tbody>
                    <CategoriesRow categories={categories} deleteCategory={deleteCategory}/>
                </tbody>
            </table>
        </>
    )
}