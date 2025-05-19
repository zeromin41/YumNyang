import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import css from './MyPage.module.css'
import RecipeCardSwiper from '../components/RecipeCardSwiper'
import Modal from '../components/Modal'
import UserEditForm from '../components/UserEditForm'
import { fetchMyPageData } from '../apis/myPage'
import { fetchUserFavorites } from '../store/favoritesSlice'
import { useNavigate } from 'react-router-dom'
import { logout } from '../apis/auth'
import Button from '../components/Button'
import { mapRecipeData } from '../utils/mappingData'
import { logoutUser, updateNickname } from '../store/userSlice'

const SKELETON_COUNT = 4
const dummySkeletonData = Array.from({ length: SKELETON_COUNT }, (_, i) => ({
    id: `skeleton-${i}`,
}))

const MyPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [userId, setUserId] = useState(null)
    const [nickname, setNickname] = useState('')
    const [petInfo, setPetInfo] = useState({})
    const [myRecipes, setMyRecipes] = useState([])
    const [myReviews, setMyReviews] = useState([])

    const [isLoading, setIsLoading] = useState({
        myRecipes: true,
        myReviews: true,
    })

    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
    const [updateSuccessMsg, setUpdateSuccessMsg] = useState('')

    const [logoutError, setLogoutError] = useState('')

    // Redux 상태
    const favoriteRecipes = useSelector((state) => state.favorites.items.recipes ?? [])
    const favoriteStatus = useSelector((state) => state.favorites.status)
    const favoriteLoading = favoriteStatus === 'loading'

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

    // 내 레시피, 내 리뷰 데이터 fetch
    const loadMyPageData = useCallback(async () => {
        if (!userId) {
            setIsLoading({ myRecipes: false, myReviews: false })
            return
        }

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

    const handleUpdate = (message, newNickname) => {
        setUpdateSuccessMsg(message)
        setIsEditModalOpen(false)
        if (newNickname) dispatch(updateNickname(newNickname))
        loadMyPageData()
    }

    // 로그아웃
    const handleLogout = async () => {
        try {
            await logout()
            localStorage.removeItem('userId')
            dispatch(logoutUser())
            navigate('/')
        } catch (err) {
            if (err.status === 401) {
                setIsLogoutModalOpen(false)
                alert(err.message)
                localStorage.removeItem('userId')
                dispatch(logoutUser())
                navigate('/')
            } else {
                setLogoutError(err.message)
            }
        }
    }

    const renderRecipeSection = (title, data, isLoading, isReview = false) => {
        const mappedData = mapRecipeData(data, isReview)

        return (
            <div className={css.myContentsWrapper}>
                <h2 className={css.title}>{title}</h2>
                {isLoading ? (
                    <RecipeCardSwiper data={dummySkeletonData} isSkeleton />
                ) : mappedData.length > 0 ? (
                    <RecipeCardSwiper
                        data={mappedData}
                        onCardClick={(id) => navigate(`/recipe/${id}`)}
                        isReview={isReview}
                        isLoggedIn={true}
                        userId={userId}
                    />
                ) : (
                    <p>{`${title}가 없습니다.`}</p>
                )}
            </div>
        )
    }

    return (
        <main className={css.myPageCon}>
            {updateSuccessMsg && <div className={css.updateSuccessMsg}>{updateSuccessMsg}</div>}

            <section className={css.userInfo}>
                <span className={css.nickname}>{nickname}</span>
                <div className={css.petInfo}>
                    <span>반려동물 정보:</span>
                    <span>
                        {`${petInfo.TYPE === 'dog' ? '🐶' : '🐱'} ${petInfo.NAME} ${petInfo.AGE ? `(${petInfo.AGE}세)` : ''}`}
                    </span>
                </div>
                <div className={css.actionItem} onClick={() => setIsEditModalOpen(true)}>
                    정보 수정
                </div>
            </section>

            <section className={css.myContentsCon}>
                {renderRecipeSection('찜한 레시피', favoriteRecipes, favoriteLoading)}
                {renderRecipeSection('내가 작성한 레시피', myRecipes.recipe, isLoading.myRecipes)}
                {renderRecipeSection(
                    '내가 작성한 리뷰',
                    myReviews?.reviews,
                    isLoading.myReviews,
                    true
                )}
            </section>

            <section className={css.accountActions}>
                <div className={css.actionItem} onClick={() => setIsLogoutModalOpen(true)}>
                    로그아웃
                </div>
                <div className={css.actionItem} onClick={() => navigate('/withdraw')}>
                    회원탈퇴
                </div>
            </section>

            {isEditModalOpen && (
                <Modal>
                    <UserEditForm
                        userId={userId}
                        nickname={nickname}
                        petInfo={petInfo}
                        onUpdate={handleUpdate}
                        onClose={() => setIsEditModalOpen(false)}
                    />
                </Modal>
            )}

            {isLogoutModalOpen && (
                <Modal>
                    <div className={css.logoutModalContents}>
                        <p>로그아웃 하시겠습니까?</p>
                        <div className={css.btnWrapper}>
                            <Button text="로그아웃" color="brown" onClick={handleLogout} />
                            <Button
                                text="닫기"
                                color="default"
                                onClick={() => setIsLogoutModalOpen(false)}
                            />
                        </div>
                        {logoutError && (
                            <div className={`${css.msg} ${css.error}`}>{logoutError}</div>
                        )}
                    </div>
                </Modal>
            )}
        </main>
    )
}

export default MyPage
