import React from 'react'
import { NavLink } from 'react-router-dom'
import style from './Menu.module.css'

const Menu = () => {
    return (
        <div className={style.menu}>
            <Nav page={<Home />} to="/" />
            <Nav page={<Search />} to="/search" />
            <Nav page={<MyPage />} to="/mypage" />
        </div>
    )
}

const Nav = ({ page, to }) => (
    <NavLink
        className={({ isActive }) =>
            isActive ? `${style.normal} ${style.active}` : `${style.normal}`
        }
        to={to}
    >
        {page}
    </NavLink>
)

const Home = () => {
    return (
        <>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9.41605C3 9.04665 3.18802 8.7001 3.50457 8.48603L11.3046 3.21117C11.7209 2.92961 12.2791 2.92961 12.6954 3.21117L20.4954 8.48603C20.812 8.70011 21 9.04665 21 9.41605V19.2882C21 20.2336 20.1941 21 19.2 21H4.8C3.80589 21 3 20.2336 3 19.2882V9.41605Z" />
            </svg>
            <span>home</span>
        </>
    )
}

const Search = () => {
    return (
        <>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.927 17.04L20.4001 20.4M19.2801 11.44C19.2801 15.7699 15.77 19.28 11.4401 19.28C7.11019 19.28 3.6001 15.7699 3.6001 11.44C3.6001 7.11006 7.11019 3.59998 11.4401 3.59998C15.77 3.59998 19.2801 7.11006 19.2801 11.44Z" />
            </svg>
            <span>search</span>
        </>
    )
}

const MyPage = () => {
    return (
        <>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.23779 19.5C4.5632 17.2892 7.46807 15.7762 12.0001 15.7762C16.5321 15.7762 19.4369 17.2892 20.7623 19.5M15.6001 8.1C15.6001 10.0882 13.9883 11.7 12.0001 11.7C10.0118 11.7 8.40007 10.0882 8.40007 8.1C8.40007 6.11177 10.0118 4.5 12.0001 4.5C13.9883 4.5 15.6001 6.11177 15.6001 8.1Z" />
            </svg>
            <span>myPage</span>
        </>
    )
}

export default Menu
