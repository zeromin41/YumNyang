import React from 'react'
import Menu from './components/Menu'
import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import styles from './Default.module.css'
const Default = () => {
    return (
        <>
            <Header />
            <div className={styles.pageContentWrapper}>
                <Outlet />
            </div>
            <Menu />
        </>
    )
}

export default Default
