import HomeRow from "../table/HomeRow"
import TableHead from "../table/TableHead"

export default function HomeTable({productsStore,deleteProductStore}){
const nameHeaders = ['Product','UnitPrice','Amount','Total','Action']
    return (
             <>
                <table >
                    <thead>
                        <tr>
                            <TableHead headers={nameHeaders}/>
                        </tr>
                    </thead>
                    <tbody>
                            <HomeRow store={productsStore} deleteProductStore={deleteProductStore}/>
                    </tbody>
                </table>
            </>
    )    

}