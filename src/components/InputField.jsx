import React from 'react'
import css from './InputField.module.css'

const InputField = ({
    label,
    id,
    type = 'text',
    value,
    onChange,
    rightElement,
    errorMsg,
    successMsg,
}) => {
    return (
        <div className={css.inputFieldCon}>
            <label className={css.label} htmlFor={id}>
                {label}
            </label>
            <div className={css.inputWrapper}>
                <input id={id} type={type} value={value} onChange={onChange} />
                {rightElement && <div>{rightElement}</div>}
            </div>
            {errorMsg && <span className={`${css.msg} ${css.error}`}>{errorMsg}</span>}
            {successMsg && <span className={`${css.msg} ${css.success}`}>{successMsg}</span>}
        </div>
    )
}

export default InputField
