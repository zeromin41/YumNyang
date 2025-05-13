import React, { useState, useEffect } from 'react'
import axios from 'axios'
import RecipeStepCard from '../components/RecipeStepCard'
import css from './RecipeDetailPage.module.css'
import TTSComponent from '../components/TTSComponent'
import playImg from '../assets/play-03.svg'
import Comment from '../components/Comment'
import Nutritional from './../components/Nutritional'

const BASE_URL = 'https://seungwoo.i234.me:3333'

const RecipeDetailPage = () => {
    const [recipeData, setRecipeData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await axios.get(`${BASE_URL}/getRecipe/9`)
                setRecipeData(response.data)
                console.log('데이터 받아오기 성공', response.data)
            } catch (error) {
                console.log('데이터 받아오기 실패', error)
                setError('데이터를 불러오는데 실패했습니다.')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    // 로딩 중 표시
    if (loading) {
        return <div>로딩 중...</div>
    }

    // 에러 표시
    if (error) {
        return <div>오류 발생: {error}</div>
    }

    // 데이터가 없거나 형식이 예상과 다른 경우
    if (!recipeData || !recipeData.description || !Array.isArray(recipeData.description)) {
        console.log('데이터 형식 오류:', recipeData)
        return <div>레시피 데이터가 올바른 형식이 아닙니다.</div>
    }

    // 전체 레시피 텍스트
    const allDescriptions = recipeData.description.map((step) => step.DESCRIPTION)

    return (
        <>
            {/* 내용 전체재생 */}
            <div className={css.ttsWrap}>
                <TTSComponent text={allDescriptions} playBtnImg={playImg} />
                <span className={css.btnTitle}>전체레시피 읽어주기</span>
            </div>

            {/* 레시피 단계별 카드 */}
            {recipeData.description.map((step, index) => (
                <RecipeStepCard
                    key={index}
                    number={step.FLOW || index + 1}
                    instruction={step.DESCRIPTION}
                    image={step.IMAGE_URL}
                    btnkey={index}
                />
            ))}
            <Nutritional />
            <Comment />
        </>
    )
}

export default RecipeDetailPage
