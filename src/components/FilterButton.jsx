import React from 'react'
import css from './FilterButton.module.css'

const FilterButton = ({ text = '필터', onClick }) => {
    return (
        <button className={css.filterBtn} onClick={onClick}>
            {text}
        </button>
    )
}

export default FilterButton
