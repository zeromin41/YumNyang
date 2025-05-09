import React from 'react'
import css from './Button.module.css'
const Button = ({ text = '버튼', color = 'accent', size, onClick }) => {
    return (
        <button className={`${css.btn} ${css[color]} ${css[size]}`} onClick={onClick}>
            {text}
        </button>
    )
}

export default Button
