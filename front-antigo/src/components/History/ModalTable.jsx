import ModalRow from "../table/ModalRow";
import TableHead from "../table/TableHead";

export default function ModalTable({modal}){
    const headers = ['Code','Data','Product','Categoria','Tax','Total']
    return(
        <>
            <table >
                    <thead>
                        <tr>
                            <TableHead headers={headers}/>
                        </tr>
                    </thead>
                    <tbody>
                            <ModalRow modal={modal}/>
                    </tbody>
                </table>
        </>
    )
}