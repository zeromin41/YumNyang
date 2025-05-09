import React from 'react'
import css from './Tag.module.css'
import tag from '../assets/delete.svg'

const Tag = ({ text = 'tag', onDelete }) => {
    return (
        <div className={css.tagCon}>
            <span>{text}</span>
            <i onClick={onDelete}>
                <img src={tag} alt="삭제" />
            </i>
        </div>
    )
}

export default Tag
