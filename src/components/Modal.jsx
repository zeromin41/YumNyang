import React from 'react'
import css from './Modal.module.css'

const Modal = ({ children }) => {
    return (
        <div className={css.modal}>
            <div className={css.modalCon}>{children}</div>
        </div>
    )
}

export default Modal
