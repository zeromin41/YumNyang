import React from 'react'
import css from './Input.module.css'

const Input = ({ type = 'text', value, placeholder, onChange, onKeyUp, readOnly }) => {
    return (
        <input
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            onKeyUp={onKeyUp}
            readOnly={readOnly}
            className={css.input}
        />
    )
}

export default Input
