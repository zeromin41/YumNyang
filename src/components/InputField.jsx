import React from 'react'
import css from './InputField.module.css'

const InputField = ({
    label,
    id,
    type = 'text',
    value,
    onChange,
    onKeyUp,
    rightElement,
    errorMsg,
    successMsg,
    min,
}) => {
    return (
        <div className={css.inputFieldCon}>
            <label className={css.label} htmlFor={id}>
                {label}
            </label>
            <div className={css.inputWrapper}>
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    onKeyUp={onKeyUp}
                    min={min}
                    onInput={(e) => {
                        if (type === 'number' && e.target.value < 0) e.target.value = 0
                    }}
                />
                {rightElement && <div>{rightElement}</div>}
            </div>
            {errorMsg && <span className={`${css.msg} ${css.error}`}>{errorMsg}</span>}
            {successMsg && <span className={`${css.msg} ${css.success}`}>{successMsg}</span>}
        </div>
    )
}

export default InputField
