import React from 'react'
import css from './Tag.module.css'

const Tag = ({ text = 'tag', onDelete }) => {
    return (
        <div className={css.tagCon}>
            <span>{text}</span>
            <i onClick={onDelete}>
                <img src="icons/delete.svg" alt="삭제" />
            </i>
        </div>
    )
}

export default Tag
