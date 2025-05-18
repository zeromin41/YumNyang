import React, { useState } from 'react'
import AdditionBasicInfo from '../layout/AdditionBasicInfo';
import style from './Addition.module.css'
import arrowLeft from '../assets/arrow-left-contained-01.svg'
import arrowRight from '../assets/arrow-right-contained-01.svg'
import Button from '../components/Button';
import AdditionStep from '../layout/AdditionStep';
import Input from '../components/Input';
import axios from 'axios';

const Addition = () => {
    const [title, setTitle] = useState('');
    const [mainImage, setMainImage] = useState('');
    const [target, setTarget] = useState([]);
    const [time, setTime] = useState(0);
    const [timeType, setTimeType] = useState('hour');
    const [level, setLevel] = useState('');
    const [calorie, setCalorie] = useState(0);
    const [ration, setRation] = useState(0);
    const [rationType, setRationType] = useState('g');
    const [ingredient, setIngredient] = useState([]);
    const [description, setDescription] = useState([{ description : '', image : '' }]);
    const [page, setPage] = useState(1)

    const pageLeft = () => {
        setPage((prev) => prev - 1)
    }

    const pageRight = () => {
        setPage((prev) => prev + 1)
    }

    const uploadRecipes = async () => {
        const formData = new FormData()
        formData.append('title', title)
        if (mainImage) {
            formData.append('images', mainImage)
        }
        formData.append('targetPetType', target)
        //formData.append()// ? 카테고리?

         description.forEach((step, idx) => {
             formData.append('images', step.image)
         })

        await axios.post('https://seungwoo.i234.me:3333/AddRecipe', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    }

    return (
        <div className={style.Addition}>
            <div className={style.header}>
                <Input
                    type='text'
                    value={title}
                    placeholder='제목을 입력해주세요'
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className={style.content}>
                {page === 1 ? (
                    <AdditionBasicInfo
                        mainImage={mainImage}
                        setMainImage={setMainImage}
                        target={target}
                        setTarget={setTarget}
                        time={time}
                        setTime={setTime}
                        timeType={timeType}
                        setTimeType={setTimeType}
                        level={level}
                        setLevel={setLevel}
                        calorie={calorie}
                        setCalorie={setCalorie}
                        ration={ration}
                        setRation={setRation}
                        rationType={rationType}
                        setRationType={setRationType}
                        ingredient={ingredient}
                        setIngredient={setIngredient}
                    />
                ) : page === 2 ? (
                    <AdditionStep
                        description={description}
                        setDescription={setDescription}
                    />
                ) : (
                    <>
                        <button onClick={uploadRecipes}>
                            전송
                        </button>
                    </>
                )}
            </div>
            <div className={style.navigation}>
                {
                    page === 1 ? <button style={{display : 'hidden'}}></button> : page === 3 ? '' :
                    <button onClick={pageLeft}>
                        <img src={arrowLeft} alt="Previous"/>
                    </button>
                }
                {
                    page === 3 ? "" :
                    <button onClick={pageRight}>
                        <img src={arrowRight} alt="Next"/>
                    </button>
                }
            </div>
            <menu />
        </div>
    )
}

export default Addition