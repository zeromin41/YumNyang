import React, { useState, useRef } from 'react'
import Button from '../components/Button'
import Tag from '../components/Tag'
import Input from '../components/Input'
import DropDown from '../components/DropDown'
import Modal from '../components/Modal'
import { getRequest, postRequest } from '../apis/api'
import style from './AdditionBasicInfo.module.css'
import plus from '../assets/plus.svg'
import HourglassIcon from '../assets/hourglass.svg'
import IngredientModal from './IngredientModal'

const AdditionBasicInfo = ({
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
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef(null)

    const inputMainImage = (e) => {
        if (e.target.files && e.target.files[0]) {
            setMainImage(e.target.files[0])
        }
    }

    const targetInput = () => {
        if (targetType !== '') {
            setTarget(prev => [...prev, targetType])
            setTargetType('')
        }
    }

    const deleteTarget = (index) => {
        setTarget((prev) => prev.filter((item, idx) => idx !== index))
    }

    const deleteIngredient = (item, index) => {
        setIngredient(prev => prev.filter((_, idx) => idx !== index))
    }

    return (
        <div className={style.container}>
            <h2 className={style.sectionHeader}>기본 정보</h2>

            <div className={style.section}>
                <div className={style.subHeader}>대표 사진</div>
                <div
                    className={`${style.imageUploadArea} ${isDragging ? style.highlight : ''}`}
                    onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={e => { e.preventDefault(); setIsDragging(false) }}
                    onDrop={e => {
                        e.preventDefault()
                        setIsDragging(false)
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            setMainImage(e.dataTransfer.files[0])
                        }
                    }}
                    onClick={() => fileInputRef.current.click()}
                >
                    {mainImage
                        ? <img src={URL.createObjectURL(mainImage)} alt="Preview" />
                        : <p>Drag & Drop 또는 클릭하여 업로드</p>
                    }
                    <input
                        ref={fileInputRef}
                        className={style.hiddenInput}
                        type="file"
                        accept="image/*"
                        onChange={inputMainImage}
                    />
                </div>
            </div>

            <div className={style.section}>
                <div className={style.subHeader}>권장 대상</div>
                <div className={style.fieldRow}>
                    <Input
                        type="text"
                        value={targetType}
                        onChange={e => setTargetType(e.target.value)}
                        placeholder="입력해주세요."
                    />
                    <Button text="등록" size="sm" onClick={targetInput} />
                </div>
                <div className={style.tagList}>
                    {target.map((e, idx) => (
                        <Tag key={idx} text={e} onDelete={() => deleteTarget(idx)} />
                    ))}
                </div>
            </div>

            <div className={style.section}>
                <div className={`${style.fieldRow} ${style.subHeader}`}>
                    <img src={HourglassIcon} className={style.icon} alt="시간 아이콘" />
                    <span>요리시간</span>
                </div>
                <div className={style.fieldRow}>
                    <Input
                        type="number"
                        value={time}
                        onChange={e => setTime(e.target.value)}
                        placeholder="입력해주세요."
                    />
                    <DropDown
                        options={[
                            { value: 'hour', label: '시간' },
                            { value: 'min', label: '분' },
                            { value: 'sec', label: '초' }
                        ]}
                        onSelect={e => setTimeType(e.value)}
                        placeholder="시간"
                    />
                    <DropDown
                        options={[
                            { value: 'easy', label: '쉬움' },
                            { value: 'normal', label: '보통' },
                            { value: 'hard', label: '어려움' }
                        ]}
                        onSelect={e => setLevel(e.value)}
                        placeholder="난이도 선택"
                    />
                </div>
            </div>

            <div className={`${style.section}`}>
                <div className={style.kcal}>
                    <div className={style.subHeader}>칼로리</div>
                    <div className={style.fieldRow}>
                        <Input
                            type="number"
                            value={calorie}
                            onChange={e => setCalorie(e.target.value)}
                            placeholder="입력해주세요."
                        />
                        <span>Kcal</span>
                    </div>
                </div>
                <div className={style.kcal}>
                    <div className={style.subHeader}>1회 급여량</div>
                    <div className={style.fieldRow}>
                        <Input
                            type="number"
                            value={ration}
                            onChange={e => setRation(e.target.value)}
                            placeholder="입력해주세요."
                        />
                        <DropDown
                            options={[
                                { value: 'g', label: 'g' },
                                { value: 'kg', label: 'kg' },
                                { value: 'ml', label: 'ml' },
                                { value: 'L', label: 'L' }
                            ]}
                            onSelect={e => setRationType(e.value)}
                            placeholder="g"
                        />
                    </div>
                </div>
                <div className={style.subHeader}>재료</div>
                <div className={style.fieldRow}>
                    <input
                        className={style.inputField}
                        readOnly
                        placeholder="재료 검색"
                        onClick={() => setIsModalOpen(true)}
                    />
                </div>
                <div className={style.tagList}>
                    {ingredient.map((e, idx) => (
                        <Tag
                            key={idx}
                            text={`${e.feedNm} ${e.capacity}${e.capacityType}`}
                            onDelete={() => deleteIngredient(e, idx)}
                        />
                    ))}
                </div>
            </div>

            {isModalOpen && (
                <Modal>
                    <IngredientModal
                        ingredient={ingredient}
                        setIngredient={setIngredient}
                        setIsModalOpen={setIsModalOpen}
                    />
                </Modal>
            )}
        </div>
    )
}
export default AdditionBasicInfo