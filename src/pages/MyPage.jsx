import React, { useState, useEffect } from 'react'
import css from './MyPage.module.css'
import RecipeCardSwiper from '../components/RecipeCardSwiper'

const SKELETON_COUNT = 4
const dummySkeletonData = Array.from({ length: SKELETON_COUNT }, (_, i) => ({
    id: `skeleton-${i}`,
}))

const MyPage = () => {
    const [favoriteRecipes, setFavoriteRecipes] = useState([])
    const [myRecipes, setMyRecipes] = useState([])
    const [myReviews, setMyReviews] = useState([])

    const [isLoadingFavorite, setIsLoadingFavorite] = useState(true)
    const [isLoadingMyRecipes, setIsLoadingMyRecipes] = useState(true)
    const [isLoadingMyReviews, setIsLoadingMyReviews] = useState(true)

    const isLoggedIn = false // TODO: 실제 로그인 상태와 연동
    const userId = 1 // TODO: 실제 사용자 ID와 연동

    const handleCardClick = (recipeId) => {
        console.log('클릭된 레시피 ID:', recipeId)
    }

    const renderRecipeSection = (title, data, isLoading, isReview = false) => (
        <div className={css.myContentsWrapper}>
            <h2 className={css.title}>{title}</h2>
            {isLoading ? (
                <RecipeCardSwiper data={dummySkeletonData} isSkeleton />
            ) : data.length > 0 ? (
                <RecipeCardSwiper
                    data={data}
                    onCardClick={handleCardClick}
                    isLoggedIn={isLoggedIn}
                    userId={userId}
                    isReview={isReview}
                />
            ) : (
                <p>{`${title}가 없습니다.`}</p>
            )}
        </div>
    )

    return (
        <main className={css.myPageCon}>
            <section className={css.userInfo}>
                <span className={css.nickname}>사용자 닉네임</span>
                <div className={css.petInfo}>
                    <span>반려동물 정보: </span>
                    <span>뽀삐</span>
                </div>
                <div className={css.actionItem}>정보 수정</div>
            </section>

            <section className={css.myContentsCon}>
                {renderRecipeSection('찜한 레시피', favoriteRecipes, isLoadingFavorite)}
                {renderRecipeSection('내가 작성한 레시피', myRecipes, isLoadingMyRecipes)}
                {renderRecipeSection('내가 작성한 리뷰', myReviews, isLoadingMyReviews, true)}
            </section>

            <section className={css.accountActions}>
                <div className={css.actionItem}>로그아웃</div>
                <div className={css.actionItem}>회원탈퇴</div>
            </section>
        </main>
    )
}

export default MyPage
