import React, { useState, useRef, useEffect } from 'react'
import Tag from '../components/Tag'
import Input from '../components/Input'
import DropDown from '../components/DropDown'
import Modal from '../components/Modal'
import style from './AdditionBasicInfo.module.css'
import HourglassIcon from '../assets/hourglass.svg'
import IngredientModal from './IngredientModal'

const AdditionBasicInfo = ({
    mainImage,
    setMainImage,
    target,
    setTarget,
    category,
    setCategory,
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
    setIngredient,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [individualCal, setIndividualCal] = useState([])
    const fileInputRef = useRef(null)

    const inputMainImage = (e) => {
        if (e.target.files && e.target.files[0]) {
            if(e.target.files[0].size > 5 * 1024 * 1024) {
                alert("이미지는 5MB까지 등록 가능합니다.")
                return;
            }
            setMainImage(e.target.files[0])
        }
    }

    const deleteIngredient = (_, index) => {
        setIngredient(prev => prev.filter((_, idx) => idx !== index))
    }

    useEffect(() => {
        setIndividualCal([])
        ingredient.map((e) => {
            const crbQy = e.crbQy > 0 ? e.crbQy : 0
            const protQy = e.protQy > 0 ? e.protQy : 0
            const fatQy = e.fatQy > 0 ? e.fatQy : 0
            setIndividualCal((p) => [...p, 4 * crbQy + 4 * protQy + 9 * fatQy]) // 4 * 탄수화물 + 4 * 단백질 + 9 * 지방
        })
    }, [ingredient])

    useEffect(() => {
        const totalCalorie = individualCal.reduce((acc, curr) => {
            return (acc += curr)
        }, 0)
        setCalorie(totalCalorie)
    }, [individualCal])

    return (
        <div className={style.container}>
            <h2 className={style.sectionHeader}>기본 정보</h2>

            <div className={style.section}>
                <div className={style.subHeader}>대표 사진</div>
                <div
                    className={`${style.imageUploadArea} ${isDragging ? style.highlight : ''}`}
                    onDragOver={(e) => {
                        e.preventDefault()
                        setIsDragging(true)
                    }}
                    onDragLeave={(e) => {
                        e.preventDefault()
                        setIsDragging(false)
                    }}
                    onDrop={(e) => {
                        e.preventDefault()
                        setIsDragging(false)
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            if(e.dataTransfer.files[0].size > 5 * 1024 * 1024) {
                                alert("이미지는 5MB까지 등록 가능합니다.")
                                return;
                            }
                            setMainImage(e.dataTransfer.files[0])
                        }
                    }}
                    onClick={() => fileInputRef.current.click()}
                >
                    {mainImage ? (
                        <img src={URL.createObjectURL(mainImage)} alt="Preview" />
                    ) : (
                        <p>Drag & Drop 또는 클릭하여 업로드</p>
                    )}
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
                    <DropDown
                        value={target}
                        options={[
                            { value: '강아지', label: '강아지' },
                            { value: '고양이', label: '고양이' },
                        ]}
                        onSelect={(e) => setTarget(e.value)}
                        placeholder="선택해주세요"
                    />
                </div>
                {/* 육류, 생선, 곡물, 간식, 기타 */}
                <div className={style.subHeader}>카테고리</div>
                <div className={style.fieldRow}>
                    <DropDown
                        value={category}
                        options={[
                            { value: 'meat', label: '육류' },
                            { value: 'fish', label: '생선' },
                            { value: 'grain', label: '곡물' },
                            { value: 'snack', label: '간식' },
                            { value: 'others', label: '기타' },
                        ]}
                        onSelect={(e) => setCategory(e.value)}
                        placeholder="선택해주세요"
                    />
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
                        onChange={(e) => {
                            if(e.target.value >= 0) setTime(e.target.value.replace(/^0+(?=\d)/, ''));
                        }}
                        placeholder="입력해주세요."
                    />
                    <DropDown
                        value={timeType}
                        options={[
                            { value: '시간', label: '시간' },
                            { value: '분', label: '분' },
                            { value: '초', label: '초' },
                        ]}
                        onSelect={(e) => setTimeType(e.value)}
                        placeholder="시간"
                    />
                    <DropDown
                        value={level}
                        options={[
                            { value: '쉬움', label: '쉬움' },
                            { value: '보통', label: '보통' },
                            { value: '어려움', label: '어려움' },
                        ]}
                        onSelect={(e) => setLevel(e.value)}
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
                            value={Math.floor(calorie * 100) / 100}
                            readOnly
                            placeholder="자동 계산 중"
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
                            onChange={(e) => {
                                if(e.target.value >= 0) setRation(e.target.value.replace(/^0+(?=\d)/, ''))
                            }}
                            placeholder="입력해주세요."
                        />
                        <DropDown
                            value={rationType}
                            options={[
                                { value: 'g', label: 'g' },
                                { value: 'kg', label: 'kg' },
                                { value: 'ml', label: 'ml' },
                                { value: 'L', label: 'L' },
                            ]}
                            onSelect={(e) => setRationType(e.value)}
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
