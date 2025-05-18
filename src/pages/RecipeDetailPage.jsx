import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getRequest, postRequest } from '../apis/api'
import RecipeStepCard from '../components/RecipeStepCard'
import css from './RecipeDetailPage.module.css'
import TTSComponent from '../components/TTSComponent'
import playImg from '../assets/play-03.svg'
import Comment from '../components/Comment'
import Nutritional from './../components/Nutritional'
import starImg from '../assets/full-star.svg'
import heartImg from '../assets/full-heart.svg'
import { formatDate } from './../utils/feature'
import FloatingButton from '../components/FloatingButton'
import Timer from '../components/Timer'
import watchImg from '../assets/stopwatch-03.svg'

const RecipeDetailPage = () => {
    const { recipeId } = useParams()
    const [recipeData, setRecipeData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeTab, setActiveTab] = useState(0) // 탭 상태를 최상위 컴포넌트로 이동
    const [showTimer, setShowTimer] = useState(false)

    // fetchData 함수 수정
    useEffect(() => {
        const fetchData = async () => {
            if (!recipeId) return
            setLoading(true)
            setError(null)
            try {
                const responseData = await getRequest(`/getRecipe/${recipeId}`)
                setRecipeData(responseData)
            } catch (err) {
                setError(err.message || '데이터를 불러오는데 실패했습니다.')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [recipeId])

    // post 요청을 통해 최근 본 레시피 기록
    useEffect(() => {
        const recordRecentlyViewed = async () => {
            const currentUserId = localStorage.getItem('userId')

            if (currentUserId && recipeId && recipeData && !loading && !error) {
                try {
                    const responseMessage = await postRequest('/addRecentlyView', {
                        userId: parseInt(currentUserId, 10),
                        recipeId: parseInt(recipeId, 10),
                    })
                    console.log(
                        responseMessage.message ||
                            `최근 본 레시피 기록 성공: userId=<span class="math-inline">\{currentUserId\}, recipeId\=</span>{recipeId}`
                    )
                } catch (err) {
                    console.error('최근 본 레시피 기록 API 오류:', err.message)
                }
            }
        }

        if (recipeData) {
            // recipeData가 성공적으로 로드된 후에만 기록
            recordRecentlyViewed()
        }
    }, [recipeData, recipeId, loading, error]) // 의존성 배열 확인

    //작성자,작성일,별점,조회수
    const WriterInfo = () => (
        <div className={css.writerInfoContainer}>
            <div className={css.writerNicknameWrap}>
                <span>작성자: {recipeData.recipe.NICKNAME}</span>
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
                <span>{recipeData.recipe.VIEW_COUNT}</span>
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

    //플로팅 버튼(타이머)
    const clickFloatingBtn = () => {
        setShowTimer(!showTimer)
    }

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
            {/* useParam으로 recipeId 로 수정  */}
            <Comment recipeId={recipeId} />
            <FloatingButton iconSrc={watchImg} onClick={clickFloatingBtn} />
            {showTimer && <Timer />}
        </div>
    )
}

export default RecipeDetailPage
