import React, { useState, useEffect } from 'react'
import axios from 'axios'
import RecipeStepCard from '../components/RecipeStepCard'
import css from './RecipeDetailPage.module.css'
import TTSComponent from '../components/TTSComponent'
import playImg from '../assets/play-03.svg'
import Comment from '../components/Comment'
import Nutritional from './../components/Nutritional'
import Header from '../components/Header'
import starImg from '../assets/full-star.svg'
import heartImg from '../assets/full-heart.svg'
import { formatDate } from './../utils/feature'
import Menu from '../components/Menu'

const BASE_URL = 'https://seungwoo.i234.me:3333'

const RecipeDetailPage = () => {
    const [recipeData, setRecipeData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeTab, setActiveTab] = useState(0) // 탭 상태를 최상위 컴포넌트로 이동
    const [postWriter, setPostWriter] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await axios.get(`${BASE_URL}/getRecipe/15`)
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

    //작성자,작성일,별점,좋아요
    const WriterInfo = () => (
        <div className={css.writerInfoContainer}>
            <div className={css.writerNicknameWrap}>
                <span>작성자: 닉네임</span>
            </div>
            <div className={css.postDateWrap}>
                <span>{formatDate(recipeData.recipe.CREATE_AT)}</span>
            </div>
            <div className={css.starWrap}>
                <img src={starImg} alt="별" />
                <span>4.5</span>
            </div>
            <div className={css.likeWrap}>
                <img src={heartImg} alt="하트" />
                <span>{recipeData.recipe.FAVORITES_COUNT}</span>
            </div>
        </div>
    )

    // 탭 컴포넌트
    const DetailTab = () => {
        const tabTiles = ['기본 정보', '조리법']

        return (
            <div className={css.tabBtn}>
                {tabTiles.map((title, index) => (
                    <button
                        key={index}
                        className={activeTab === index ? css.active : ''}
                        onClick={() => setActiveTab(index)}
                    >
                        {title}
                    </button>
                ))}
            </div>
        )
    }

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

    // 기본 정보 탭 내용
    const BasicInfo = () => (
        <>
            <BasicInfoList />
            <IngredientList />
            {/* 영양 정보 컴포넌트 */}
            <Nutritional recipeData={recipeData} />
        </>
    )

    //정보 카드 (추천 대상, 조리 시간, 칼로리)
    const BasicInfoList = () => (
        <div className={css.infoListWrap}>
            <ul style={{ marginTop: '12px' }}>
                <li>추천 대상: {recipeData.recipe?.TARGET_PET_TYPE || '정보없음'}</li>
                <li>
                    조리 시간: {recipeData.recipe?.COOKING_TIME_LIMIT || '정보없음'} / 난이도:{' '}
                    {recipeData.recipe?.LEVEL || '정보없음'}
                </li>
                <li>
                    칼로리: {recipeData.recipe?.CALORIES_PER_SERVING || '정보없음'}kcal / 1회
                    급여량: {recipeData.ingredient[0]?.QUANTITY_AMOUNT}
                    {recipeData.ingredient[0]?.QUANTITY_UNIT}
                </li>
            </ul>
        </div>
    )

    //재료
    const IngredientList = () => (
        <>
            <span className={css.ingredentTitle}>🐾&nbsp;&nbsp;재료</span>
            <div className={css.infoListWrap}>
                <ul style={{ marginTop: '12px' }}>
                    {recipeData.ingredient.map((data, index) => (
                        <li key={index}>
                            {data.INGREDIENT_NAME}&nbsp;{data.QUANTITY_AMOUNT}
                            {data.QUANTITY_UNIT}{' '}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )

    const ThumbnailImg = () => (
        <div className={css.imgContainer}>
            <img src={recipeData.recipe.MAIN_IMAGE_URL} alt="" />
        </div>
    )
    // 조리법 탭 내용
    const RecipeSteps = () => (
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
                    number={step.FLOW + 1}
                    instruction={step.DESCRIPTION}
                    image={step.IMAGE_URL}
                    btnkey={index}
                />
            ))}
        </>
    )

    return (
        <div className={css.recipeDetailContainer}>
            {/* 요리 제목  */}
            <div className={css.recipeTitle}>
                <span>{recipeData.recipe.TITLE}</span>
            </div>
            <WriterInfo />
            <ThumbnailImg />
            {/* 탭 버튼 */}
            <DetailTab />

            {/* 탭 내용 */}
            <div className={css.tabContent}>
                {activeTab === 0 ? <BasicInfo /> : <RecipeSteps />}
            </div>

            {/* 댓글 섹션은 항상 표시 */}
            {/* useParam으로 recipeId 받아와야함 */}
            <Comment recipeId={'15'} />
        </div>
    )
}

export default RecipeDetailPage
