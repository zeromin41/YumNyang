import React from 'react'
import css from './InputField.module.css'
import { handleNumberInput, handleNumberKeyDown } from '../utils/inputUtil'

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
    const onKeyDown = type === 'number' ? handleNumberKeyDown : undefined
    const onInput = type === 'number' ? handleNumberInput : undefined

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
                    onKeyDown={onKeyDown}
                    onInput={onInput}
                    min={min}
                />
                {rightElement && <div>{rightElement}</div>}
            </div>
            {errorMsg && <span className={`${css.msg} ${css.error}`}>{errorMsg}</span>}
            {successMsg && <span className={`${css.msg} ${css.success}`}>{successMsg}</span>}
        </div>
    )
}

export default InputField
