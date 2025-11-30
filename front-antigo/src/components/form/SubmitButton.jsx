import styles from './SubmitButton.module.css'

export default function SubmitButton({text, variant,code,handleRemove,handleFinish,handleCancel,handleOpen}){
    
    const remove = (e) => {
        e.preventDefault()
        handleRemove(code)
    }

    const finish = (e) => {
        e.preventDefault()
        handleFinish()
    }

    const cancel = (e) => {
        e.preventDefault()
        handleCancel()
    }

    const openModal = (e) => {
        e.preventDefault()
        handleOpen()
    }

    return (
            <button className={styles.btn} 
            style={{backgroundColor: variant == 'delete' ? '#8E1616' : variant =='cancel' ? '#8E1616': variant == 'view' ? '#67AE6E' : '',width: variant == 'view' ? '80%' :''}}
            id={code}
            onClick= {variant =='delete' ? remove : variant == 'finish' ? finish : variant == 'cancel' ? cancel : variant == 'view' ?  openModal: undefined} >{text}</button>
    )
}