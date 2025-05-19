import React, { useEffect } from 'react'
import css from './Modal.module.css'

const Modal = ({ children }) => {
    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow
        document.body.style.overflow = 'hidden' // 스크롤 막기

        return () => {
            document.body.style.overflow = originalStyle // 모달이 닫히면 복구
        }
    }, [])

    return (
        <div className={css.modal}>
            <div className={css.modalCon}>{children}</div>
        </div>
    )
}

export default Modal
