import React from 'react'
import css from './RecipeStepCard.module.css'
const RecipeStepCard = ({ number, instruction, image }) => {
    return (
        <div>
            <div>{image && <img src={image} alt="이미지" />}</div>
            <div>
                <p>
                    {number}. {instruction}
                </p>
            </div>
        </div>
    )
}

export default RecipeStepCard
