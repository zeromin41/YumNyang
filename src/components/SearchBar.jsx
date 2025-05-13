import React from 'react'
import css from './SearchBar.module.css'
import Input from './Input'

const SearchBar = ({ value, mode, placeholder, onChange, onOpenModal }) => {
    const handleClick = () => {
        if (mode === 'modal') {
            onOpenModal?.()
        }
    }

    const handleChange = (e) => {
        if (mode === 'search') {
            onChange?.(e.target.value)
        }
    }

    return (
        <div className={css.searchBar} onClick={handleClick}>
            <Input
                value={value}
                onChange={handleChange}
                readOnly={mode === 'modal'}
                placeholder={placeholder}
            />
            <svg
                width="20"
                height="20"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={css.searchIcon}
            >
                <path
                    d="M19.748 19.88L23.8 23.8M22.4933 13.3467C22.4933 18.3982 18.3982 22.4933 13.3466 22.4933C8.29505 22.4933 4.19995 18.3982 4.19995 13.3467C4.19995 8.29511 8.29505 4.20001 13.3466 4.20001C18.3982 4.20001 22.4933 8.29511 22.4933 13.3467Z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{ stroke: 'var(--neutral-colors-sand-brown)' }}
                />
            </svg>
        </div>
    )
}

export default SearchBar
