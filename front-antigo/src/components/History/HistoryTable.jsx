import TableHead from "../table/TableHead";
import HistoryRow from '../table/HistoryRow'

export default function HistoryTable({history,handleOpen}){
    const headers = ['Code','Tax','Total','Action']
    return (
        <>
                <table >
                    <thead>
                        <tr>
                            <TableHead headers={headers}/>
                        </tr>
                    </thead>
                    <tbody>
                             <HistoryRow history={history} handleOpen={handleOpen}/>
                    </tbody>
                </table>
        </>
    )
}