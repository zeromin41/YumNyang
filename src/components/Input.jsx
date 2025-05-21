import React from 'react'
import css from './Input.module.css'
import { handleNumberInput, handleNumberKeyDown } from '../utils/inputUtil'

const Input = ({ type = 'text', value, placeholder, onChange, onKeyUp, readOnly, min }) => {
    const onKeyDown = type === 'number' ? handleNumberKeyDown : undefined
    const onInput = type === 'number' ? handleNumberInput : undefined

    return (
        <input
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            onKeyUp={onKeyUp}
            readOnly={readOnly}
            className={css.input}
            onKeyDown={onKeyDown}
            onInput={onInput}
            min={min}
        />
    )
}

export default Input
