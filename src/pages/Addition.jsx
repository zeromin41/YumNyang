import React, { useState } from 'react'
import AdditionBasicInfo from '../layout/AdditionBasicInfo';

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
    const [description, setDescription] = useState([]);

    return (
        <>
            <AdditionBasicInfo
                title={title}
                setTitle={setTitle}
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
            <menu/>
        </>
    )
}

export default Addition