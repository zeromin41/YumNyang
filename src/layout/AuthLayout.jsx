import React from 'react'
import { Outlet } from 'react-router-dom'
import css from './AuthLayout.module.css'

const AuthLayout = ({ title, image }) => {
    return (
        <main className={css.authLayout}>
            <header className={css.header}>
                <h1>{title}</h1>
                <div className={css.imgWrapper}>
                    <img src={image} alt={title} />
                </div>
            </header>
            <Outlet />
        </main>
    )
}

export default AuthLayout
