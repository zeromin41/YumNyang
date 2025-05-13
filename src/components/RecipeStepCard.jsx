import React from 'react'
import css from './RecipeStepCard.module.css'
import TTSComponent from './TTSComponent'
import playImg from '../assets/volume.png'
const RecipeStepCard = ({ number, instruction, image, btnkey }) => {
    return (
        <div>
            <div className={css.recipeImg}>{image && <img src={image} alt="이미지" />}</div>
            <div className={css.desContainer}>
                <p className={css.description}>
                    {number}. {instruction}
                </p>

                <TTSComponent text={instruction} btnkey={btnkey} playBtnImg={playImg} />
            </div>
        </div>
    )
}

export default RecipeStepCard
