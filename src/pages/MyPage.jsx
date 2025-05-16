import React, { useState, useEffect, useCallback } from 'react'
import css from './MyPage.module.css'
import RecipeCardSwiper from '../components/RecipeCardSwiper'
import Modal from '../components/Modal'
import UserEditForm from '../components/UserEditForm'
import { fetchMyPageData } from '../apis/myPage'

const SKELETON_COUNT = 4
const dummySkeletonData = Array.from({ length: SKELETON_COUNT }, (_, i) => ({
    id: `skeleton-${i}`,
}))

const MyPage = () => {
    const [userId, setUserId] = useState(null)
    const [nickname, setNickname] = useState('')
    const [petInfo, setPetInfo] = useState({})

    const [favoriteRecipes, setFavoriteRecipes] = useState([])
    const [myRecipes, setMyRecipes] = useState([])
    const [myReviews, setMyReviews] = useState([])

    const [isLoading, setIsLoading] = useState({
        favorite: true,
        myRecipes: true,
        myReviews: true,
    })

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [updateSuccessMsg, setUpdateSuccessMsg] = useState('')

    const isLoggedIn = false // TODO: 실제 로그인 상태와 연동

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId')
        if (storedUserId) setUserId(Number(storedUserId))
    }, [])

    const loadMyPageData = useCallback(async () => {
        if (!userId) return

        try {
            const { nickname, petInfo, favoriteRecipes, myRecipes, myReviews } =
                await fetchMyPageData(userId)

            setNickname(nickname?.nickname?.NICKNAME)
            setPetInfo(petInfo?.pets?.[0] || {})

            setFavoriteRecipes(favoriteRecipes)
            setMyRecipes(myRecipes)
            setMyReviews(myReviews)
        } catch (err) {
            console.error(err.message)
        } finally {
            setIsLoading({ favorite: false, myRecipes: false, myReviews: false })
        }
    }, [userId])

    useEffect(() => {
        loadMyPageData()
    }, [loadMyPageData])

    useEffect(() => {
        if (updateSuccessMsg) {
            const timer = setTimeout(() => setUpdateSuccessMsg(''), 3000)
            return () => clearTimeout(timer)
        }
    }, [updateSuccessMsg])

    const handleUpdate = (message) => {
        loadMyPageData() // 데이터 리로드
        setUpdateSuccessMsg(message)
        setIsModalOpen(false)
    }

    const handleCardClick = (recipeId) => {
        alert(`클릭된 레시피 ID: ${recipeId}`)
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
            {updateSuccessMsg && <div className={css.updateSuccessMsg}>{updateSuccessMsg}</div>}
            <section className={css.userInfo}>
                <span className={css.nickname}>{nickname}</span>
                <div className={css.petInfo}>
                    <span>반려동물 정보: </span>
                    <span>{petInfo.NAME}</span>
                </div>
                <div className={css.actionItem} onClick={() => setIsModalOpen(true)}>
                    정보 수정
                </div>
            </section>

            <section className={css.myContentsCon}>
                {renderRecipeSection('찜한 레시피', favoriteRecipes, isLoading.favorite)}
                {renderRecipeSection('내가 작성한 레시피', myRecipes, isLoading.myRecipes)}
                {renderRecipeSection('내가 작성한 리뷰', myReviews, isLoading.myReviews, true)}
            </section>

            <section className={css.accountActions}>
                <div className={css.actionItem}>로그아웃</div>
                <div className={css.actionItem}>회원탈퇴</div>
            </section>

            {isModalOpen && (
                <Modal>
                    <UserEditForm
                        userId={userId}
                        nickname={nickname}
                        petInfo={petInfo}
                        onUpdate={handleUpdate}
                        onClose={() => setIsModalOpen(false)}
                    />
                </Modal>
            )}
        </main>
    )
}

export default MyPage
