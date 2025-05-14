import React from 'react'
import css from './RecipeStepCard.module.css'
import TTSComponent from './TTSComponent'
import playImg from '../assets/volume-06.svg'
const RecipeStepCard = ({ number, instruction, image, btnkey }) => {
    return (
        <div className={css.mainContainer}>
            <div className={css.recipeImgWrap}>{image && <img src={image} alt="이미지" />}</div>
            <div className={css.desContainer}>
                <span className={css.des}>
                    {number}. {instruction}
                </span>

                <TTSComponent text={instruction} btnkey={btnkey} playBtnImg={playImg} />
            </div>
        </div>
    )
}

export default RecipeStepCard
