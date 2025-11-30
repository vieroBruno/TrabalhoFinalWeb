import SubmitButton from "../form/SubmitButton";

export default function ProductsRow({products, deleteProducts}){
    return (
        <>
            {
                products.map((curProducts)=> {
                    const {code,amount,name,price,category_name} = curProducts;

                    return (
                        <tr key={code}>
                            <td>{code}</td>
                            <td>{amount}</td>
                            <td>{name}</td>
                            <td>R${price}</td>
                            <td>{category_name}</td>
                            <td><SubmitButton text="Delete" variant='delete' handleRemove={() => deleteProducts(code)}/></td>
                        </tr>
                    )
                })
            }
        </>
    )
}