import styles from './Select.module.css'

export default function Select({text,name,options,handleOnChange}){
    return (
       <div className={styles.form_control}>
        <label htmlFor={name}>{text}:</label>
        <select name={name}id={name} onChange={handleOnChange} defaultValue='default'>
            <option value='default' disabled>Select a {text}</option>
            {options.map((option) => (
                <option value={option.code} key={option.code}>
                    {option.name}
                </option>
            ))}
        </select>
       </div>
    )
}