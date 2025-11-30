import SubmitButton from "../form/SubmitButton";

export default function CategoriesRow({categories, deleteCategory}){
    return (
        < >
            {
                categories.map((curCategory)=> {
                    const {code,name,tax} = curCategory;

                    return (
                        <tr key={code}>
                            <td>{code}</td>
                            <td>{name}</td>
                            <td>{tax}%</td>
                            <td><SubmitButton text="Delete" variant='delete' code={code} handleRemove={() => deleteCategory(code)}/></td>
                        </tr>
                    )
                })
            }
        </>
    )   
}