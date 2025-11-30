import styles from './Input.module.css'

export default function Input({keyPressed,type,text,name,placeholder,handleOnChange,value,disabled,variant}){
    return (
       <div className={styles.form_control} style={{flexDirection: variant =='input' ? 'inline' : 'column', float: variant == 'input' ? 'right' : 'none'}}>
        <label htmlFor={name} >{text}</label>
        <input type={type} 
        name={name}
        id={name}
        placeholder={placeholder}
        onChange={handleOnChange}
        value={value}
        hidden={variant == 'true' ? true:false}
        disabled={disabled == 'true' ? true : false }
        onKeyDown={keyPressed}
        style={{backgroundColor: disabled =='true' ? '#e2e2e2' : ''}}></input>
       </div>
    )
}