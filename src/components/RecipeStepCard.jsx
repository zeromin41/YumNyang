import React from 'react'
import css from './RecipeStepCard.module.css'
const RecipeStepCard = ({ number, instruction, image }) => {
    return (
        <div>
            <div className={css.recipeImg}>{image && <img src={image} alt="이미지" />}</div>
            <div className={css.desContainer}>
                <p className={css.description}>
                    {number}. {instruction}
                </p>
                <button>
                    <img src="/images/play-03.svg" alt="" />
                </button>
            </div>
        </div>
    )
}

export default RecipeStepCard
