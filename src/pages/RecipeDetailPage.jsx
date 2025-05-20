// RecipeDetailPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getRequest, postRequest } from '../apis/api'
import { useSelector } from 'react-redux' // useSelector 임포트

import RecipeStepCard from '../components/RecipeStepCard'
import TTSComponent from '../components/TTSComponent'
import Comment from '../components/Comment'
import Nutritional from '../components/Nutritional'
import Timer from '../components/Timer'
import FloatingButton from '../components/FloatingButton'
import { formatDate } from '../utils/feature'

// 이미지 임포트
import playImg from '../assets/play-03.svg'
import starImg from '../assets/full-star.svg'
import heartImg from '../assets/view.svg'
import watchImg from '../assets/stopwatch-03.svg'
import trashImg from '../assets/trash.svg'

// 스타일 임포트
import css from './RecipeDetailPage.module.css'
import RecipeDetailLayout from '../layout/RecipeDetailLayout'

const RecipeDetailPage = () => {
    const { recipeId } = useParams()
    const navigate = useNavigate()
    const [recipeData, setRecipeData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeTab, setActiveTab] = useState(0)
    const [showTimer, setShowTimer] = useState(false)
    const [starAverage, setStarAverage] = useState(0)
    const loggedInUserId = useSelector((state) => state.user.userId)

    // 데이터 가져오기
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

    // 최근 본 레시피 기록
    useEffect(() => {
        const recordRecentlyViewed = async () => {
            if (loggedInUserId && recipeId && recipeData && !loading && !error) {
                try {
                    const responseMessage = await postRequest('/addRecentlyView', {
                        userId: loggedInUserId, // Redux store에서 가져온 userId 사용
                        recipeId: parseInt(recipeId, 10),
                    })
                } catch (err) {
                    console.error('최근 본 레시피 기록 API 오류:', err.message)
                }
            }
        }

        if (recipeData) {
            recordRecentlyViewed()
        }
    }, [recipeData, recipeId, loading, error, loggedInUserId])

    // 레시피 삭제 함수
    const handleDeleteRecipe = async () => {
        if (!recipeData || !recipeData.recipe || !recipeData.recipe.ID) {
            console.error('레시피 정보가 없어 삭제할 수 없습니다.')
            return
        }

        // eslint-disable-next-line no-restricted-globals
        if (confirm('이 레시피를 삭제하시겠습니까?')) {
            try {
                const response = await getRequest(`/removeRecipe/${recipeData.recipe.ID}`)
                alert(response.message || '레시피가 성공적으로 삭제되었습니다.')
                navigate('/')
            } catch (err) {
                console.error('레시피 삭제 API 오류:', err.message)
                alert(err.response?.data?.error || '레시피 삭제에 실패했습니다.')
            }
        }
    }

    // 로딩 상태의 텍스트 컴포넌트
    const loadingComponent = (
        <div className={css.loadingWrapper}>
            레시피 <span className={css.loadingDots}>불러오는 중</span>
        </div>
    )

    // 데이터 검증
    if (
        !loading &&
        !error &&
        (!recipeData || !recipeData.description || !Array.isArray(recipeData.description))
    ) {
        console.log('데이터 형식 오류:', recipeData)
        return <div>레시피 데이터가 올바른 형식이 아닙니다.</div>
    }

    // 작성자 정보 컴포넌트
    const WriterInfo = () =>
        recipeData && (
            <div className={css.writerInfoContainer}>
                <div className={css.writerNicknameWrap}>
                    <span>작성자: {recipeData.recipe.NICKNAME}</span>
                </div>
                <div className={css.postDateWrap}>
                    <span>{formatDate(recipeData.recipe.CREATE_AT)}</span>
                </div>
                <div className={css.starWrap}>
                    <img src={starImg} alt="별" />
                    <span>{starAverage.toFixed(2)}</span>
                </div>
                <div className={css.likeWrap}>
                    <img src={heartImg} alt="하트" />
                    <span>{recipeData.recipe.VIEW_COUNT || 0}</span>
                </div>
                {recipeData.recipe.USER_ID == Number(loggedInUserId) && (
                    <div
                        className={css.deleteWrap}
                        onClick={handleDeleteRecipe}
                    >
                        <img
                            src={trashImg}
                            alt="삭제"
                        />
                    </div>
                )}
            </div>
        )

    // 기본 정보 목록 컴포넌트
    const BasicInfoList = () =>
        recipeData && (
            <div className={css.infoListWrap}>
                <ul>
                    <li>
                        <span>추천 대상:</span> {recipeData.recipe?.TARGET_PET_TYPE || '정보없음'}
                    </li>
                    <li>
                        <span>조리 시간:</span>{' '}
                        {recipeData.recipe?.COOKING_TIME_LIMIT || '정보없음'} / <span>난이도</span>:{' '}
                        {recipeData.recipe?.LEVEL || '정보없음'}
                    </li>
                    <li>
                        <span>칼로리</span>: {recipeData.recipe?.CALORIES_PER_SERVING || '정보없음'}
                        kcal /<span>1회 급여량</span>: {recipeData.ingredient[0]?.QUANTITY_AMOUNT}
                        {recipeData.ingredient[0]?.QUANTITY_UNIT}
                    </li>
                </ul>
            </div>
        )

    // 재료 목록 컴포넌트
    const IngredientList = () =>
        recipeData && (
            <>
                <span className={css.ingredentTitle}>🐾&nbsp;&nbsp;재료</span>
                <div className={css.infoListWrap}>
                    <ul>
                        {recipeData.ingredient.map((data, index) => (
                            <li key={index}>
                                &nbsp;{data.INGREDIENT_NAME}&nbsp;
                                {data.QUANTITY_AMOUNT}
                                {data.QUANTITY_UNIT}
                            </li>
                        ))}
                    </ul>
                </div>
            </>
        )

    // 레시피 단계 컴포넌트
    const RecipeSteps = () => {
        if (!recipeData) return null

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
                        number={step.FLOW + 1}
                        instruction={step.DESCRIPTION}
                        image={step.IMAGE_URL}
                        btnkey={index}
                    />
                ))}
            </>
        )
    }

    // 타이머 플로팅 버튼 클릭 핸들러
    const handleTimerButtonClick = () => {
        setShowTimer(!showTimer)
    }

    // 플로팅 버튼 (타이머)
    const floatingButtonElement = (
        <>
            <FloatingButton iconSrc={watchImg} onClick={handleTimerButtonClick} />
            {showTimer && <Timer />}
        </>
    )

    // 기본 정보 탭 컴포넌트
    const BasicInfo = () =>
        recipeData && (
            <>
                <BasicInfoList />
                <IngredientList />
                <Nutritional recipeData={recipeData} />
            </>
        )

    // 탭 내용 결정
    const tabContent = activeTab === 0 ? <BasicInfo /> : <RecipeSteps />

    return (
        <RecipeDetailLayout
            title={recipeData?.recipe.TITLE}
            headerContent={<WriterInfo />}
            mainImage={recipeData?.recipe.MAIN_IMAGE_URL}
            tabs={['기본 정보', '조리법']}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabContent={tabContent}
            footerContent={<Comment recipeId={recipeId} setStarAverage={setStarAverage} />}
            floatingButton={floatingButtonElement}
            isLoading={loading}
            error={error}
            loadingComponent={loadingComponent}
        />
    )
}

export default RecipeDetailPage
