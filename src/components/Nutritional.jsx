import React from 'react'
import style from './Nutritional.module.css'
import chartImg from '../assets/chart.svg'
const Nutritional = ({ recipeData }) => {
    // 영양소 명, 이전 변수명 : title
    const ingredientName = [
        '칼슘',
        '탄수화물',
        '지방',
        '식이섬유',
        '수분',
        '인',
        '단백질',
        '나트륨',
        '칼륨',
    ]

    //영양소 양, 이전 변수명 : rating,  undefined, null일 경우 0
    const amount = [
        recipeData.recipe.NUTRITIONAL_INFO_CALCIUM_G ?? 0,
        recipeData.recipe.NUTRITIONAL_INFO_CARBS_G ?? 0,
        recipeData.recipe.NUTRITIONAL_INFO_FAT_G ?? 0,
        recipeData.recipe.NUTRITIONAL_INFO_FIBER_G ?? 0,
        recipeData.recipe.NUTRITIONAL_INFO_MOISTURE_PERCENT ?? 0,
        recipeData.recipe.NUTRITIONAL_INFO_PHOSPHORUS_G ?? 0,
        recipeData.recipe.NUTRITIONAL_INFO_PROTEIN_G ?? 0,
        recipeData.recipe.NUTRITIONAL_INFO_NACL_G ?? 0,
        recipeData.recipe.NUTRITIONAL_INFO_PTSS_G ?? 0,
    ]

    return (
        <div>
            <h3>
                <li className={style.titleRow}>
                    <img src={chartImg} />
                    <span>영양 정보</span>
                </li>
                {ingredientName.map((t, index) => (
                    <ProgressBar key={index} title={t} rating={amount[index]} />
                ))}
            </h3>
        </div>
    )
}

const ProgressBar = ({ title, rating }) => {
    return (
        <div className={style.progressRow}>
            <span className={style.progressTitle}>{title}</span>
            <div className={style.progressContainer}>
                <progress className={style.progress} value={rating} max="100"></progress>
                <span
                    className={style.progressText}
                    style={{ left: `${rating > 100 ? 100 : rating}%` }}
                >
                    {rating.toFixed(2)}%
                </span>
            </div>
        </div>
    )
}

export default Nutritional
