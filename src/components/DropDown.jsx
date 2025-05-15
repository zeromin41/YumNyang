import React, { useState, useRef, useEffect } from 'react'
import style from './DropDown.module.css'

const DropDown = ({ value, options = [], onSelect, placeholder = 'Select...' }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selected, setSelected] = useState(null)
    const ref = useRef()

    const toggleOpen = () => setIsOpen((prev) => !prev)

    const handleSelect = (option) => {
        setSelected(option)
        onSelect && onSelect(option)
        setIsOpen(false)
    }

    useEffect(() => {
        if (value != null) {
            const matchedOption = options.find((option) => option.value === value)
            setSelected(matchedOption || null)
        } else {
            setSelected(null)
        }
    }, [value, options])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className={style.dropdown} ref={ref}>
            <button type="button" className={style.dropdownToggle} onClick={toggleOpen}>
                {selected ? selected.label : placeholder}
            </button>
            {isOpen && (
                <ul className={style.dropdownMenu}>
                    {options.map((option) => (
                        <li
                            key={option.value}
                            className={style.dropdownItem}
                            onClick={() => handleSelect(option)}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default DropDown
