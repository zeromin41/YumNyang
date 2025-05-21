import React, { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import RecipeCardSwiper from '../components/RecipeCardSwiper'
import CatCard from '../components/CatCard'
import css from './Home.module.css'
import FloatingButton from '../components/FloatingButton'
import plusIcon from '../assets/plus.svg'
import { getRequest } from '../apis/api' // getRequest만 필요
import { useSelector } from 'react-redux'

const SKELETON_COUNT = 4
const dummySkeletonData = Array.from({ length: SKELETON_COUNT }, (_, i) => ({
    id: `skeleton-${i}`,
}))

const Home = () => {
    const [recentRecipes, setRecentRecipes] = useState([])
    const MAX_RECENT_RECIPES = 5
    const [popularRecipes, setPopularRecipes] = useState([])

    const [isLoadingRecent, setIsLoadingRecent] = useState(true)
    const [isLoadingPopular, setIsLoadingPopular] = useState(true)

    const { userId: currentUserId, isLoggedIn: isUserLoggedIn } = useSelector((state) => state.user)

    const navigate = useNavigate()
    const location = useLocation()

    const [logoutSuccessMessage, setLogoutSuccessMessage] = useState('')

    useEffect(() => {
        if (location.state?.message) {
            setLogoutSuccessMessage(location.state.message)
            navigate(location.pathname, { replace: true })

            const timer = setTimeout(() => setLogoutSuccessMessage(''), 3000)
            return () => clearTimeout(timer)
        }
    }, [location.state])

    useEffect(() => {
        const fetchPopular = async () => {
            setIsLoadingPopular(true)
            try {
                const data = await getRequest('/getPopularity')
                if (data && data.popularity) {
                    const mappedData = data.popularity.map((recipe) => ({
                        id: recipe.ID,
                        imageSrc: recipe.MAIN_IMAGE_URL,
                        title: recipe.TITLE,
                    }))
                    setPopularRecipes(mappedData)
                } else {
                    setPopularRecipes([])
                }
            } catch (error) {
                console.error('Home - 인기 레시피 API 오류:', error.message)
                setPopularRecipes([])
            } finally {
                setIsLoadingPopular(false)
            }
        }
        fetchPopular()
    }, [])

    useEffect(() => {
        if (!isUserLoggedIn || !currentUserId) {
            setIsLoadingRecent(false)
            setRecentRecipes([])
            return
        }

        const fetchRecent = async () => {
            setIsLoadingRecent(true)
            try {
                const response = await getRequest(`/getRecentlyView/${currentUserId}`)

                if (response && response.recipes && response.recipes.length > 0) {
                    const mappedRecipes = response.recipes.map((recipe) => ({
                        id: recipe.ID,
                        title: recipe.TITLE,
                        imageSrc: recipe.MAIN_IMAGE_URL,
                    }))
                    setRecentRecipes(mappedRecipes.slice(0, MAX_RECENT_RECIPES))
                } else {
                    setRecentRecipes([])
                }
            } catch (error) {
                if (
                    error.response &&
                    error.response.status === 404 &&
                    error.response.data &&
                    error.response.data.message === '최근 본 레시피가 없습니다.'
                ) {
                    setRecentRecipes([]) 
                } else if (
                    (error.message &&
                        error.message.toLowerCase().includes('no recently viewed recipes')) ||
                    (error.response &&
                        error.response.data &&
                        error.response.data.error &&
                        error.response.data.error
                            .toLowerCase()
                            .includes('최근 본 레시피가 없습니다'))
                ) {
                    setRecentRecipes([]) 
                } else {
                    console.error('Home - 최근 본 레시피 API 오류:', error.message)
                    setRecentRecipes([]) 
                }
            } finally {
                setIsLoadingRecent(false)
            }
        }

        fetchRecent()
    }, [isUserLoggedIn, currentUserId, MAX_RECENT_RECIPES])

    const handleCardClick = (recipeId) => {
        navigate(`/recipe/${recipeId}`)
    }

    // FloatingButton 클릭 시 호출될 함수
    const handleFloatingButtonClick = () => {
        if (currentUserId && isUserLoggedIn) {
            navigate('/Addition')
        } else {
            alert('레시피를 작성하기위해서 로그인을 먼저 해주세요.')
            navigate('/login')
        }
    }

    const renderSkeletonSwiper = () => (
        <RecipeCardSwiper data={dummySkeletonData} isSkeleton={true} />
    )

    return (
        <div className={css.homeContainer}>
            {logoutSuccessMessage && (
                <div className={css.logoutSuccessMessage}>{logoutSuccessMessage}</div>
            )}

            <div className={css.catCardSection}>
                <CatCard />
            </div>

            {isUserLoggedIn && ( // 로그인한 경우에만 "최근 본 레시피" 섹션 표시
                <>
                    <h2 style={{ fontFamily: 'Goyang', marginBottom: 30, marginTop: 30 }}>
                        최근 본 레시피
                    </h2>
                    {isLoadingRecent ? (
                        renderSkeletonSwiper()
                    ) : recentRecipes.length > 0 ? (
                        <RecipeCardSwiper
                            data={recentRecipes} 
                            onCardClick={handleCardClick} 
                            isLoggedIn={isUserLoggedIn} 
                            userId={currentUserId} 
                        />
                    ) : (
                        <p className="no-recipes-message">최근 본 레시피가 없습니다.</p>
                    )}
                </>
            )}

            <h2
                style={{
                    fontFamily: 'Goyang',
                    marginBottom: 30,
                    marginTop:
                        isUserLoggedIn && recentRecipes.length > 0 ? 30 : isUserLoggedIn ? 30 : 10,
                }}
            >
                인기있는 레시피
            </h2>
            {isLoadingPopular ? (
                renderSkeletonSwiper()
            ) : popularRecipes.length > 0 ? (
                <RecipeCardSwiper
                    data={popularRecipes}
                    onCardClick={handleCardClick}
                    isLoggedIn={isUserLoggedIn}
                    userId={currentUserId}
                />
            ) : (
                <p className="no-recipes-message">인기 레시피가 없습니다.</p>
            )}
            <FloatingButton
                iconSrc={plusIcon} // import한 svg 아이콘
                alt="새 레시피 작성"
                onClick={handleFloatingButtonClick} // 클릭 핸들러 연결
            />
        </div>
    )
}

export default Home
