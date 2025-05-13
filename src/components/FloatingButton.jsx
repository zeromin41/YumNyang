import React from 'react'
import css from './FloatingButton.module.css'

const FloatingButton = ({ iconSrc, alt = 'icon', onClick }) => {
    return (
        <div className={css.floatingBtnWrapper}>
            <button className={css.floatingBtn} onClick={onClick}>
                <img src={iconSrc} alt={alt} />
            </button>
        </div>
    )
}

export default FloatingButton
