import SubmitButton from "../form/SubmitButton";

export default function HistoryRow({history,handleOpen}){
    return(
        <>
        {
            history.map((curHistory) => {
                const {order_code,tax,total} = curHistory;
                return (
                    <tr key={order_code}>
                        <td>{order_code}</td>
                        <td>{'R$'+tax}</td>
                        <td>{'R$'+total}</td>
                        <td><SubmitButton text="View" variant='view' handleOpen={() => handleOpen(order_code)}/></td>
                    </tr>
                )
            })
        }
        </>
    )
}