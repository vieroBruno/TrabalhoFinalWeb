export default function ModalRow({modal}){
    return (
          <>
                {
                    modal.map((curModal) => {
                        const {order_code,odi_code,item_code,date_order,p_name,c_name,tax,total} = curModal;
                        return (
                            <tr key={odi_code}>
                                <td>{item_code}</td>
                                <td>{date_order}</td>
                                <td>{p_name}</td>
                                <td>{c_name}</td>
                                <td>{'R$'+tax}</td>
                                <td>{'R$'+total}</td>
                            </tr>
                        )
                    })
                }
                </>
    )
}