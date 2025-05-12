import React from 'react'
import style from './Nutritional.module.css';

const Nutritional = () => {
    const title = [
        "탄수화물",
        "단백질",
        "지방",
        "수분",
        "칼슘",
        "인",
        "식이섬유"
    ];
    const rating = [
        "24",
        "70",
        "30",
        "80",
        "5",
        "64",
        "50"
    ]
  return (
    <div>
        <h3>
            <li className={style.titleRow}>
                <img src='./chart.svg'/>
                <span>영양 정보</span>
            </li>
            {title.map((t, index) => (
                <ProgressBar key={t} title={t} rating={rating[index]} />
            ))}
        </h3>
    </div>
  )
}

const ProgressBar = ({ title, rating }) => {
    return (
     <div className={style.progressRow}>
        <span className={style.progressTitle}>
            {title}
        </span>
        <div className={style.progressContainer}>
            <progress className={style.progress} value={rating} max="100"></progress>
            <span
            className={style.progressText}
            style={{ left: `${rating}%` }}
            >
            {rating}%
            </span>
        </div>
     </div>
    );
}

export default Nutritional