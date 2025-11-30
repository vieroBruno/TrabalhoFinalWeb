import ProductsRow from "../table/ProductsRow";
import styles from '../table/Table.module.css'
import TableHead from "../table/TableHead";
export default function ProductTable({products,deleteProducts}){
    let nameHeaders=['Code','Amount','Product','Price','Category','Action']
 
    return(
        <>
                    <table >
                        <thead>
                            <tr>
                             <TableHead headers={nameHeaders}/>
                            </tr>
                        </thead>
                        <tbody>
                            <ProductsRow products={products} deleteProducts={deleteProducts}/>
                        </tbody>
                    </table>
                </>
    )
}