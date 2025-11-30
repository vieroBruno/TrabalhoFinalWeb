import SubmitButton from "../form/SubmitButton";

export default function HomeRow({store,deleteProductStore}){
    return (
        <>
             {
                store.map((curProductStore)=> {
                    const {code,name,price,amount,total_row,tax_row,product_code} = curProductStore;
        
                        return (
                            <tr key={code}>
                                <td>{name}</td>
                                <td>R${price}</td>
                                <td>{amount}</td>
                                <td>R${total_row}</td>
                                <td><SubmitButton text="Delete" variant='delete' handleRemove={async() => await deleteProductStore(code,amount,total_row,tax_row,product_code)}/></td>
                            </tr>
                        )
                    })
                }
        </>
    )
}