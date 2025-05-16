import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import RecipeCardSwiper from '../components/RecipeCardSwiper'
import CatCard from '../components/CatCard'
import './Home.css'
import { getRequest } from '../apis/api' // getRequest만 필요

const SKELETON_COUNT = 4
const dummySkeletonData = Array.from({ length: SKELETON_COUNT }, (_, i) => ({
    id: `skeleton-${i}`,
}))

const Home = () => {
    const [recentRecipes, setRecentRecipes] = useState([])
    const [popularRecipes, setPopularRecipes] = useState([])

    const [isLoadingRecent, setIsLoadingRecent] = useState(true)
    const [isLoadingPopular, setIsLoadingPopular] = useState(true)

    const outletContext = useOutletContext()
    const isUserLoggedIn = outletContext?.isLoggedIn || false
    const currentUserId = outletContext?.userId || null

    const navigate = useNavigate()


    const fetchRecipeDetails = useCallback(async (entries, idFieldName = 'RECIPE_ID') => {
        if (!entries || entries.length === 0) return []
        const recipeDetailPromises = entries.map((entry) =>
            getRequest(`/getRecipe/${entry[idFieldName]}`).catch((err) => {
                console.error(
                    `Home - Error fetching details for recipe ${entry[idFieldName]}:`,
                    err.message
                )
                return null
            })
        )
        const responses = await Promise.all(recipeDetailPromises)
        return responses
            .filter((response) => response && response.recipe)
            .map((response) => ({
                id: response.recipe.ID,
                title: response.recipe.TITLE,
                imageSrc: response.recipe.MAIN_IMAGE_URL,
            }))
    }, [])

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
                const recentEntriesData = await getRequest(`/getRecentlyView/${currentUserId}`)
                if (
                    recentEntriesData &&
                    recentEntriesData.recentlyView &&
                    recentEntriesData.recentlyView.length > 0
                ) {
                    const detailedRecipes = await fetchRecipeDetails(
                        recentEntriesData.recentlyView,
                        'RECIPE_ID'
                    )
                    setRecentRecipes(detailedRecipes)
                } else {
                    setRecentRecipes([])
                }
            } catch (error) {
                if (error.message && error.message.includes('최근 본 레시피가 없습니다')) {
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
    }, [isUserLoggedIn, currentUserId, fetchRecipeDetails])

    const handleCardClick = (recipeId) => {
        navigate(`/recipe/${recipeId}`)
    }

    const renderSkeletonSwiper = () => (
        <RecipeCardSwiper data={dummySkeletonData} isSkeleton={true} />
    )

    return (
        <div className="home-container">
            <div className="cat-card-section">
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
                            data={recentRecipes} // RecipeCard에 필요한 데이터 (id, title, imageSrc)
                            onCardClick={handleCardClick} // 상세 페이지 이동 핸들러
                            isLoggedIn={isUserLoggedIn} // RecipeCard에 전달하여 내부 즐겨찾기 로직에 사용
                            userId={currentUserId} // RecipeCard에 전달하여 내부 즐겨찾기 로직에 사용
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
        </div>
    )
}

export default Home
