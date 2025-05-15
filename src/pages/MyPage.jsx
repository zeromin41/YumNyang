import React, { useState } from 'react'
import css from './MyPage.module.css'
import RecipeCardSwiper from '../components/RecipeCardSwiper'

const SKELETON_COUNT = 4
const dummySkeletonData = Array.from({ length: SKELETON_COUNT }, (_, i) => ({
    id: `skeleton-${i}`,
}))

const MyPage = () => {
    const [favoriteRecipes, setRecentRecipes] = useState([])
    const [myRecipes, setMyRecipes] = useState([])
    const [myReviews, setMyReviews] = useState([])
    const [isLoadingFavorite, setIsLoadingFavorite] = useState(true)
    const [isLoadingMyRecipes, setIsLoadingMyRecipes] = useState(true)
    const [isLoadingMyReviews, setIsLoadingMyReviews] = useState(true)

    const isLoggedIn = false // TODO: 실제 로그인 상태로 교체
    const userId = 1

    const handleCardClick = (recipeId) => {
        alert('클릭된 레시피 ID (상세페이지로 이동):', recipeId)
    }

    return (
        <main className={css.myPageCon}>
            <section className={css.userInfo}>
                <span className={css.nickname}>{'사용자 닉네임'}</span>
                <div className={css.petInfo}>
                    <span>반려동물 정보: </span>
                    <span>뽀삐</span>
                </div>
                <div className={css.actionItem}>정보 수정</div>
            </section>
            <section className={css.myContentsCon}>
                <div className={css.myContentsWrapper}>
                    <h2 className={css.title}>찜한 레시피</h2>
                    {isLoadingFavorite ? (
                        <RecipeCardSwiper data={dummySkeletonData} isSkeleton={true} />
                    ) : favoriteRecipes.length > 0 ? (
                        <RecipeCardSwiper
                            data={favoriteRecipes}
                            onCardClick={handleCardClick}
                            isLoggedIn={isLoggedIn}
                            userId={userId}
                        />
                    ) : (
                        <p>찜한 레시피가 없습니다.</p>
                    )}
                </div>
                <div className={css.myContentsWrapper}>
                    <h2 className={css.title}>내가 작성한 레시피</h2>
                    {isLoadingMyRecipes ? (
                        <RecipeCardSwiper data={dummySkeletonData} isSkeleton={true} />
                    ) : myRecipes.length > 0 ? (
                        <RecipeCardSwiper
                            data={myRecipes}
                            onCardClick={handleCardClick}
                            isLoggedIn={isLoggedIn}
                            userId={userId}
                        />
                    ) : (
                        <p>내가 작성한 레시피가 없습니다.</p>
                    )}
                </div>
                <div className={css.myContentsWrapper}>
                    <h2 className={css.title}>내가 작성한 리뷰</h2>
                    {isLoadingMyReviews ? (
                        <RecipeCardSwiper
                            data={dummySkeletonData}
                            isSkeleton={true}
                            isReview={true}
                        />
                    ) : myReviews.length > 0 ? (
                        <RecipeCardSwiper
                            data={myReviews}
                            onCardClick={handleCardClick}
                            isLoggedIn={isLoggedIn}
                            userId={userId}
                        />
                    ) : (
                        <p>찜한 레시피가 없습니다.</p>
                    )}
                </div>
            </section>
            <section className={css.accountActions}>
                <div className={css.actionItem}>로그아웃</div>
                <div className={css.actionItem}>회원탈퇴</div>
            </section>
        </main>
    )
}

export default MyPage
