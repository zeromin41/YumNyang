import React from 'react'
import css from './RecipeStepCard.module.css'
import TTSComponent from './TTSComponent'
import playImg from '../assets/volume-06.svg'
import defaultImg from '../assets/defaultImg.svg'
const RecipeStepCard = ({ number, instruction, image, btnkey }) => {
    return (
        <div className={css.mainContainer}>
            <div className={css.recipeImgWrap}>
                <img
                    src={image || defaultImg}
                    alt="이미지"
                    onError={(e) => {
                        e.target.onerror = null // 무한 루프 방지
                        e.target.src = defaultImg
                    }}
                />
            </div>
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
