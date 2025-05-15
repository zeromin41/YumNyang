import React, { useState, useEffect } from 'react'
import RecipeCardSwiper from '../components/RecipeCardSwiper'
import CatCard from '../components/CatCard'
import './Home.css'

import { API_BASE_URL, API_REQUEST_OPTIONS } from '../utils/apiConfig.js'

const SKELETON_COUNT = 4
const dummySkeletonData = Array.from({ length: SKELETON_COUNT }, (_, i) => ({
    id: `skeleton-${i}`,
}))

const Home = () => {
    const [recentRecipes, setRecentRecipes] = useState([])
    const [popularRecipes, setPopularRecipes] = useState([])
    const [isLoadingRecent, setIsLoadingRecent] = useState(true)
    const [isLoadingPopular, setIsLoadingPopular] = useState(true)

    const isLoggedIn = false // TODO: 실제 로그인 상태로 교체
    const userId = 1

    useEffect(() => {
        const fetchPopularRecipes = async () => {
            setIsLoadingPopular(true)
            try {
                const response = await fetch(`${API_BASE_URL}/getPopularity`, {
                    ...API_REQUEST_OPTIONS, // 공통 GET 요청 옵션 사용
                })

                if (!response.ok) {
                    const errorData = await response
                        .json()
                        .catch(() => ({ message: `인기 레시피 로딩 실패: ${response.statusText}` }))
                    console.error('인기 레시피 로딩 실패:', errorData.message || response.status)
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const data = await response.json()
                // console.log('API 응답 원본 (인기 레시피):', JSON.stringify(data, null, 2));

                const mappedData = data.popularity.map((recipe) => ({
                    id: recipe.ID,
                    imageSrc: recipe.MAIN_IMAGE_URL,
                    title: recipe.TITLE,
                }))
                setPopularRecipes(mappedData)
            } catch (error) {
                console.error('인기 레시피 API 호출 중 오류:', error)
                setPopularRecipes([])
            } finally {
                setIsLoadingPopular(false)
            }
        }
        fetchPopularRecipes()
    }, [])

    useEffect(() => {
        if (!isLoggedIn || !userId) {
            setIsLoadingRecent(false)
            setRecentRecipes([])
            return
        }

        const fetchRecentRecipes = async () => {
            setIsLoadingRecent(true)
            try {
                const response = await fetch(`${API_BASE_URL}/getRecentlyView/${userId}`, {
                    ...API_REQUEST_OPTIONS, // 공통 GET 요청 옵션 사용 (쿠키 전송 필요)
                })

                if (response.status === 404) {
                    console.log('최근 본 레시피가 없습니다.')
                    setRecentRecipes([])
                    // 404도 정상 처리의 일환으로 finally에서 로딩 해제
                } else if (!response.ok) {
                    // 404가 아닌 다른 에러
                    const errorData = await response.json().catch(() => ({
                        message: `최근 본 레시피 로딩 실패: ${response.statusText}`,
                    }))
                    console.error('최근 본 레시피 로딩 실패:', errorData.message || response.status)
                    throw new Error(`HTTP error! status: ${response.status}`)
                } else {
                    // 성공 (200 OK)
                    const data = await response.json()
                    const mappedData = data.recentlyView.map((recipe) => ({
                        id: recipe.ID,
                        imageSrc: recipe.MAIN_IMAGE_URL,
                        title: recipe.TITLE,
                    }))
                    setRecentRecipes(mappedData)
                }
            } catch (error) {
                console.error('최근 본 레시피 API 호출 중 오류:', error)
                setRecentRecipes([])
            } finally {
                setIsLoadingRecent(false)
            }
        }
        fetchRecentRecipes()
    }, [isLoggedIn, userId])

    const handleCardClick = (recipeId) => {
        console.log('클릭된 레시피 ID (상세페이지로 이동):', recipeId)
        // 예: navigate(`/recipe/${recipeId}`); // useNavigate 훅을 Home 컴포넌트에도 선언해야 함
    }

    const renderSkeletonSwiper = () => (
        <RecipeCardSwiper data={dummySkeletonData} isSkeleton={true} />
    )

    return (
        <div className="home-container">
            <div className="cat-card-section">
                <CatCard />
            </div>

            <h2 style={{ fontFamily: 'Goyang', marginBottom: 30 }}>최근 본 레시피</h2>
            {isLoadingRecent ? (
                renderSkeletonSwiper()
            ) : recentRecipes.length > 0 ? (
                <RecipeCardSwiper
                    data={recentRecipes}
                    onCardClick={handleCardClick}
                    isLoggedIn={isLoggedIn}
                    userId={userId}
                />
            ) : (
                <p
                    style={{
                        textAlign: 'center',
                        fontFamily: 'Goyang',
                        color: '#888',
                        marginBottom: 30,
                    }}
                >
                    최근 본 레시피가 없습니다.
                </p>
            )}

            <h2 style={{ fontFamily: 'Goyang', marginBottom: 30, marginTop: 10 }}>
                인기있는 레시피
            </h2>
            {isLoadingPopular ? (
                renderSkeletonSwiper()
            ) : popularRecipes.length > 0 ? (
                <RecipeCardSwiper
                    data={popularRecipes}
                    onCardClick={handleCardClick}
                    isLoggedIn={isLoggedIn}
                    userId={userId}
                />
            ) : (
                <p
                    style={{
                        textAlign: 'center',
                        fontFamily: 'Goyang',
                        color: '#888',
                        marginBottom: 30,
                    }}
                >
                    인기 레시피가 없습니다.
                </p>
            )}
        </div>
    )
}

export default Home
