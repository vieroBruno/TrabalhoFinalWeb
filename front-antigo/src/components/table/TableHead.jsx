import styles from './TableHead.module.css'
export default function TableHead({quantity,headers}){
    return (
        <>
             {
                headers.map((curHeaders)=> {

                    return (
                        <th key={curHeaders}>{curHeaders}</th>
                    )
                })
            }  
        </>
    )
}