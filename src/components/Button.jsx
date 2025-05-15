import React from 'react'
import css from './Button.module.css'
const Button = ({ text = '버튼', color = 'accent', size, flex, onClick, disabled }) => {
    return (
        <button
            className={`${css.btn} ${css[color]} ${css[size]}`}
            style={flex ? { flex } : undefined}
            onClick={onClick}
            disabled={disabled}
        >
            {text}
        </button>
    )
}

export default Button
