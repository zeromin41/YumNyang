import React from 'react'
import css from './FloatingButton.module.css'

const FloatingButton = () => {
    return (
        <div className={css.floatingBtnWrapper}>
            <button className={css.floatingBtn}>
                <img src="icons/plus.svg" alt="plus" />
            </button>
        </div>
    )
}

export default FloatingButton
