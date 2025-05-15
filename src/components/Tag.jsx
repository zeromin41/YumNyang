import React from 'react'
import css from './Tag.module.css'
import deleteSvg from '../assets/delete.svg'

const Tag = ({ text = 'tag', onDelete }) => {
    return (
        <div className={css.tagCon}>
            <span>{text}</span>
            <i onClick={onDelete}>
                <img src={deleteSvg} alt='삭제' />
            </i>
        </div>
    )
}

export default Tag
