import React, { useState, useEffect } from 'react'
import DropDown from '../components/DropDown'
import Input from '../components/Input'
import Button from '../components/Button'
import Tag from '../components/Tag'
import style from './IngredientModal.module.css'
import { getRequest, postRequest } from '../apis/api'
import deleteSvg from '../assets/delete.svg'

function IngredientModal({ ingredient, setIngredient, setIsModalOpen }) {
    const [categoryOptions, setCategoryOptions] = useState([])
    const [ingredients, setIngredients] = useState([])
    const [search, setSearch] = useState('')
    const [addIngredient, setAddIngredient] = useState([])
    const [modalIngredient, setModalIngredient] = useState([])
    const [showIngredientsList, setShowIngredientsList] = useState(false)

    useEffect(() => {
        setModalIngredient(ingredient || [])
    }, [ingredient])

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getRequest('/getCategory')
                if (response && Array.isArray(response.category)) {
                    const mappedCategories = response.category.map((e) => ({
                        value: e.code,
                        label: e.codeNm,
                    }))
                    setCategoryOptions([...mappedCategories, { value: null, label: '전체' }])
                } else {
                    console.warn('카테고리 응답이 없거나 형식이 올바르지 않습니다.', response)
                    setCategoryOptions([{ value: null, label: '전체' }]) // 기본값
                }
            } catch (error) {
                console.error('카테고리 로딩 중 오류 발생:', error)
                setCategoryOptions([{ value: null, label: '전체' }]) // 오류 발생 시 기본값
            }
        }
        fetchCategories()
    }, []) // 의존성 배열 비워서 마운트 시 한 번만 실행

    // 카테고리 선택 시 호출
    const categorySelect = async (selectedOption) => {
        if (!selectedOption || selectedOption.value === undefined) {
            if (
                selectedOption &&
                selectedOption.value === null &&
                selectedOption.label === '카테고리 선택'
            ) {
                setIngredients([])
                setShowIngredientsList(false)
                return
            }
        }

        const categoryValue = selectedOption.value // 실제 API로 보낼 값

        try {
            const response = await postRequest('/getIngredient', { upperListSel: categoryValue })
            if (response && response.ingredient) {
                const uniqueFeedNms = new Set()
                const filteredIngredients = response.ingredient.filter((item) => {
                    if (uniqueFeedNms.has(item.feedNm)) return false
                    uniqueFeedNms.add(item.feedNm)
                    return true
                })
                setIngredients(filteredIngredients)
                setShowIngredientsList(true)
                setSearch('') // 새 카테고리 선택 시 검색어 초기화
            } else {
                setIngredients([])
                setShowIngredientsList(false)
            }
        } catch (error) {
            console.error('재료 로딩 중 오류:', error)
            setIngredients([])
            setShowIngredientsList(false)
        }
    }

    const clickIngredient = (item) => {
        if (
            addIngredient.some((i) => i.feedNm === item.feedNm) ||
            modalIngredient.some((i) => i.feedNm === item.feedNm)
        ) {
            alert('이미 추가된 재료입니다.') // 사용자에게 알림
            return
        }
        setAddIngredient((prev) => [
            ...prev,
            { ...item, capacity: '', capacityType: 'g', isCustom: false },
        ])
        setShowIngredientsList(false) // 재료 목록 숨기기 (요청사항 3)
        setSearch('') // 검색어 초기화
    }

    const ingredientAdd = (item, index) => {
        if (!item.capacity || item.capacity <= 0) {
            console.log('재료가 적어도 1 이상이어야합니다.')
            return
        }
        setModalIngredient((prev) => {
            let nutritionCheck = item

            const volume =
                (nutritionCheck.capacity *
                    (nutritionCheck.capacityType === 'kg' || nutritionCheck.capacityType === 'L'
                        ? 1000
                        : 1)) /
                100

            nutritionCheck.mitrQy *= volume // 수분
            nutritionCheck.protQy *= volume // 단백질
            nutritionCheck.clciQy *= volume // 칼슘
            nutritionCheck.phphQy *= volume // 인
            nutritionCheck.fatQy *= volume // 지방
            nutritionCheck.crbQy *= volume // 탄수화물
            nutritionCheck.totEdblfibrQy *= volume // 총식이섬유
            nutritionCheck.naQy *= volume // 나트륨
            nutritionCheck.ptssQy *= volume // 칼륨

            return [...prev, nutritionCheck]
        })

        setAddIngredient((prev) => prev.filter((_, idx) => idx !== index))
    }

    // 직접 추가 버튼 클릭 시
    const directlyAdd = () => {
        setAddIngredient((prev) => [
            ...prev,
            { feedNm: '', capacity: '', capacityType: 'g', isCustom: true },
        ])
        setShowIngredientsList(false)
    }

    // 최종 추가된 재료(태그) 삭제
    const deleteIngredient = (item, index) => {
        setModalIngredient((prev) => prev.filter((_, idx) => idx !== index))
    }

    // 모달의 "추가하기" 버튼 (최종 내보내기)
    const exportIngredient = () => {
        setIngredient(modalIngredient)
        close()
    }

    // 모달 닫기
    const close = () => {
        setIsModalOpen(false)
    }

    const removeIngredient = (index) => {
        setAddIngredient((prev) => prev.filter((_, idx) => index !== idx))
    }

    const handleAddIngredientChange = (index, field, value) => {
        setAddIngredient((prev) =>
            prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
        )
    }

    return (
        <div className={style.modalBackdrop}>
            {' '}
            <div className={style.modalContent}>
                {' '}
                <DropDown
                    className={style.dropdownField}
                    options={categoryOptions}
                    onSelect={categorySelect}
                    placeholder="카테고리 선택"
                />
                {showIngredientsList && (
                    <>
                        <Input
                            className={style.inputField}
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="재료명 검색..."
                        />
                        <div className={style.ingredients}>
                            {' '}
                            {ingredients
                                .filter(
                                    (e) =>
                                        e.feedNm &&
                                        e.feedNm.toLowerCase().includes(search.toLowerCase())
                                )
                                .map((e) => (
                                    <div
                                        key={e.feedId || e.feedNm}
                                        onClick={() => clickIngredient(e)}
                                        style={{ padding: '8px', cursor: 'pointer' }}
                                    >
                                        {e.feedNm}
                                    </div>
                                ))}
                            {ingredients.filter(
                                (e) =>
                                    e.feedNm &&
                                    e.feedNm.toLowerCase().includes(search.toLowerCase())
                            ).length === 0 &&
                                search && (
                                    <div
                                        style={{
                                            padding: '8px',
                                            textAlign: 'center',
                                            color: '#777',
                                        }}
                                    >
                                        검색 결과가 없습니다.
                                    </div>
                                )}
                        </div>
                    </>
                )}
                <div className={style.infoRow}>
                    <div>
                        {' '}
                        <span>찾는 식재료가 없으신가요?</span>
                        <button onClick={directlyAdd}>
                            <span>+ 직접 추가하기</span>
                        </button>
                    </div>
                    <div className={style.infoText}>
                        직접 입력하신 식재료는 영양 정보 제공이 어려울 수 있습니다.
                    </div>
                </div>
                {addIngredient.map((e, index) => (
                    <div key={index} className={style.fieldRow}>
                        <Input
                            type="text"
                            value={e.feedNm}
                            onChange={(i) =>
                                handleAddIngredientChange(index, 'feedNm', i.target.value)
                            }
                            placeholder="재료명"
                            readOnly={e.isCustom === false}
                        />
                        <Input
                            type="number"
                            value={e.capacity}
                            min="0"
                            onChange={(i) =>
                                handleAddIngredientChange(index, 'capacity', i.target.value)
                            }
                            placeholder="양"
                        />
                        <DropDown
                            options={[
                                { value: 'g', label: 'g' },
                                { value: 'kg', label: 'kg' },
                                { value: 'ml', label: 'ml' },
                                { value: 'L', label: 'L' },
                            ]}
                            value={e.capacityType}
                            onSelect={(selected) =>
                                handleAddIngredientChange(index, 'capacityType', selected.value)
                            }
                            placeholder="단위"
                        />
                        <Button
                            text="추가"
                            color="sandBrown"
                            onClick={() => ingredientAdd(e, index)}
                        />
                        <button className={style.delete} onClick={() => removeIngredient(index)}>
                            <img src={deleteSvg} alt="삭제" />
                        </button>
                    </div>
                ))}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                    {modalIngredient.map((e, index) => (
                        <Tag
                            key={index} // 더 안정적인 key 사용 고려
                            text={`${e.feedNm} ${e.capacity}${e.capacityType}`}
                            onDelete={() => deleteIngredient(e, index)}
                        />
                    ))}
                </div>
                <div className={style.buttonGroup}>
                    <Button text="완료" color="brown" onClick={exportIngredient} />
                    <Button text="닫기" color="sandBrown" onClick={close} />
                </div>
            </div>
        </div>
    )
}

export default IngredientModal
