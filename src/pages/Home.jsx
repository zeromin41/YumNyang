import React from 'react'

import RecipeCardSwiper from '../components/RecipeCardSwiper'
import CatCard from '../components/CatCard'
import './Home.css'
// 임시 더미 데이터
const dummyRecipeData = [
    {
        id: '1',
        imageSrc: 'https://via.placeholder.com/120x150/FFA07A/000000?text=Recipe1', // 예시 이미지 URL
        title: '맛있는 레시피 가나다라마바사사 1',
        altText: '첫 번째 레시피 이미지',
    },
    {
        id: '2',
        imageSrc: 'https://via.placeholder.com/120x150/98FB98/000000?text=Recipe2',
        title: '간단한 레시피 2',
        altText: '두 번째 레시피 이미지',
    },
    {
        id: '3',
        imageSrc: 'https://via.placeholder.com/120x150/ADD8E6/000000?text=Recipe3',
        title: '특별한 레시피 3',
        altText: '세 번째 레시피 이미지',
    },
    {
        id: '4',
        imageSrc: 'https://via.placeholder.com/120x150/FFB6C1/000000?text=Recipe4',
        title: '건강한 레시피 4',
        altText: '네 번째 레시피 이미지',
    },
    // 필요한 만큼 더미 데이터를 추가하세요.
]

const Home = () => {
    const handleCardClick = (recipeId) => {
        console.log('클릭된 레시피 ID:', recipeId)
        // navigate(`/recipe/${recipeId}`);
    }

    return (
        <div className="home-container">
            {/* 고양이 카드 섹션 */}
            <div className="cat-card-section">
                <CatCard />
            </div>
            <h2 style={{ fontFamily: 'Goyang', marginBottom: 30 }}>최근 본 레시피</h2>
            <RecipeCardSwiper data={dummyRecipeData} onCardClick={handleCardClick} />
            <h2 style={{ fontFamily: 'Goyang', marginBottom: 30, marginTop: 10 }}>인기있는 레시피</h2>
            <RecipeCardSwiper data={dummyRecipeData} onCardClick={handleCardClick} />
        </div>
    )

}

export default Home
