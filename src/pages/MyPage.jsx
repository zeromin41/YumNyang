import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import css from './MyPage.module.css'
import RecipeCardSwiper from '../components/RecipeCardSwiper'
import Modal from '../components/Modal'
import UserEditForm from '../components/UserEditForm'
import { fetchMyPageData } from '../apis/myPage'
import { fetchUserFavorites } from '../store/favoritesSlice'

const SKELETON_COUNT = 4
const dummySkeletonData = Array.from({ length: SKELETON_COUNT }, (_, i) => ({
    id: `skeleton-${i}`,
}))

const MyPage = () => {
    const dispatch = useDispatch()

    const [userId, setUserId] = useState(null)
    const [nickname, setNickname] = useState('')
    const [petInfo, setPetInfo] = useState({})
    const [myRecipes, setMyRecipes] = useState([])
    const [myReviews, setMyReviews] = useState([])

    const [isLoading, setIsLoading] = useState({
        myRecipes: true,
        myReviews: true,
    })

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [updateSuccessMsg, setUpdateSuccessMsg] = useState('')

    const isLoggedIn = true // TODO: 실제 로그인 상태와 연동

    // Redux 상태
    const favoriteRecipes = useSelector((state) => state.favorites.items.recipes ?? [])
    const favoriteStatus = useSelector((state) => state.favorites.status)
    const favoriteLoading = favoriteStatus === 'loading'
    const favoriteError = useSelector((state) => state.favorites.error)

    console.log(favoriteRecipes)
    // userId 초기화
    useEffect(() => {
        const storedUserId = localStorage.getItem('userId')
        if (storedUserId) setUserId(Number(storedUserId))
    }, [])

    // 즐겨찾기 데이터 fetch
    useEffect(() => {
        if (userId) {
            dispatch(fetchUserFavorites(userId))
        }
    }, [dispatch, userId])

    // 내 레시피, 리뷰 데이터 fetch
    const loadMyPageData = useCallback(async () => {
        if (!userId) return

        try {
            const { nickname, petInfo, myRecipes, myReviews } = await fetchMyPageData(userId)

            setNickname(nickname?.nickname?.NICKNAME || '')
            setPetInfo(petInfo?.pets?.[0] || {})
            setMyRecipes(myRecipes)
            setMyReviews(myReviews)
        } catch (err) {
            console.error(err.message)
        } finally {
            setIsLoading({ myRecipes: false, myReviews: false })
        }
    }, [userId])

    useEffect(() => {
        loadMyPageData()
    }, [loadMyPageData])

    // 정보 수정 성공 메시지 3초 후 자동 닫기
    useEffect(() => {
        if (updateSuccessMsg) {
            const timer = setTimeout(() => setUpdateSuccessMsg(''), 3000)
            return () => clearTimeout(timer)
        }
    }, [updateSuccessMsg])

    const handleUpdate = (message) => {
        loadMyPageData()
        setUpdateSuccessMsg(message)
        setIsModalOpen(false)
    }

    const handleCardClick = (recipeId) => {
        alert(`클릭된 레시피 ID: ${recipeId}`)
    }

    const renderRecipeSection = (title, data, isLoading, isReview = false) => {
        const mappedData = Array.isArray(data)
            ? data.map((item) => ({
                  id: item.ID,
                  imageSrc: item.MAIN_IMAGE_URL,
                  title: item.TITLE,
              }))
            : []

        return (
            <div className={css.myContentsWrapper}>
                <h2 className={css.title}>{title}</h2>
                {isLoading ? (
                    <RecipeCardSwiper data={dummySkeletonData} isSkeleton />
                ) : mappedData.length > 0 ? (
                    <RecipeCardSwiper
                        data={mappedData}
                        onCardClick={handleCardClick}
                        isReview={isReview}
                        isLoggedIn={isLoggedIn}
                        userId={userId}
                    />
                ) : (
                    <p>{`${title}가 없습니다.`}</p>
                )}
            </div>
        )
    }

    if (favoriteStatus === 'failed') return <div>에러 발생: {favoriteError}</div>

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
                {renderRecipeSection('찜한 레시피', favoriteRecipes, favoriteLoading)}
                {renderRecipeSection('내가 작성한 레시피', myRecipes, isLoading.myRecipes)}
                {renderRecipeSection(
                    '내가 작성한 리뷰',
                    myReviews?.reviews,
                    isLoading.myReviews,
                    true
                )}
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
