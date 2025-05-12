import React from 'react'
import css from './RecipeStepCard.module.css'
import TTSComponent from './TTSComponent'
const RecipeStepCard = ({ number, instruction, image, btnkey }) => {
    return (
        <div>
            <div className={css.recipeImg}>{image && <img src={image} alt="이미지" />}</div>
            <div className={css.desContainer}>
                <p className={css.description}>
                    {number}. {instruction}
                </p>

                <TTSComponent text={instruction} btnkey={btnkey} />
            </div>
        </div>
    )
}

export default RecipeStepCard
