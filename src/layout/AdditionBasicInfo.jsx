import React, { useEffect, useState } from 'react'
import Button from '../components/Button'
import Tag from '../components/Tag'
import InputField from '../components/InputField'
import Input from '../components/Input'
import DropDown from '../components/DropDown'
import Modal from '../components/Modal'

const AdditionBasicInfo = ({
    title,
    setTitle,
    mainImage,
    setMainImage,
    target,
    setTarget,
    time,
    setTime,
    timeType,
    setTimeType,
    level,
    setLevel,
    calorie,
    setCalorie,
    ration,
    setRation,
    rationType,
    setRationType,
    ingredient,
    setIngredient
}) => {
    const [targetType, setTargetType] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const mainImageUpload = (e) => {
        setMainImage(e.target.files[0]);
    }

    const targetInput = () => {
        if(targetType !== ''){
            setTarget((prev) => [...prev, targetType]);
            setTargetType('');    
        }
    }
  return (
    <>
        <input placeholder='제목을 입력해주세요' />
        <p>기본정보</p>
        <div>
            <span>대표 사진</span>
            <input type='image/*' onChange={mainImageUpload} />
        </div>
        <p>권장 대상</p>
        <Input
             type='text'
             value={targetType}
             onChange={(e) => setTargetType(e.target.value)}
             readOnly={false}
        />
        <Button text='등록' size='sm' onClick={targetInput}/>
        {
            target.map( (e)=>(
                <Tag text={e}/>
            ))
        }

        <div>
            <div>
                요리시간
            </div>
            <Input
                type='number'
                value={time}
                onChange={(e) => setTime(e.target.value)}
                readOnly={false}
            />
            <DropDown
                options={[
                    { value : "hour", label : "시간" },
                    { value : "min",  label : "분" },
                    { value : "sec",  label : "초"}
                ]}
                onSelect={(e) => setTimeType(e.value) }
                placeholder='시간'
            />
            <DropDown
                options={[
                    { value : "easy", label : "쉬움" },
                    { value : "normal",  label : "보통" },
                    { value : "hard",  label : "어려움"}
                ]}
                onSelect={(e) => setTimeType(e.value) }
                placeholder='난이도'
            />
        </div>

        <div>
            <div>
                <span>칼로리</span>
                <Input
                    type='number'
                    value={calorie}
                    onChange={(e) => setCalorie(e.target.value)}
                    readOnly={false}
                />
                <span>Kcal</span>
            </div>

            <div>
                <span>1회 급여량</span>
                <Input
                    type='number'
                    value={ration}
                    onChange={(e) => setRation(e.target.value)}
                    readOnly={false}
                />
                <DropDown
                    options={[
                        { value : 'g', label : 'g' },
                        { value : 'kg', label : 'kg'},
                        { value : 'ml', label : 'ml'},
                        { value : 'L', label : 'L'}
                    ]}
                    onSelect={(e) => setRationType(e.value)}
                    placeholder='g'
                />
            </div>
            <div>
                <span>재료</span>
                <Input
                    readOnly={true}
                    onClick={() => setIsModalOpen(true)}
                />
            </div>
        </div>
        {isModalOpen &&(
            <Modal
                children={
                    <IngredientModal
                        ingredient={ingredient}
                        setIngredient={setIngredient} 
                    />
                }
            />
        )}
    </>
  )
}

const IngredientModal = async ({
    ingredient,
    setIngredient
}) => {
    useEffect({
    }, []);
    return(
        <>
            <DropDown
            />
        </>
    );
}

export default AdditionBasicInfo