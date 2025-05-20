// src/components/RecipeCard.jsx
import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import emptyHeart from '../assets/empty-heart.svg'
import fullHeart from '../assets/full-heart.svg'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../index.css'
import { checkToken } from '../apis/auth'

import {
    addFavoriteToServer,
    removeFavoriteFromServer,
    selectIsFavoriteByRecipeId,
    selectFavoriteEntryByRecipeId,
} from '../store/favoritesSlice'

const IMAGE_HEIGHT = '150px'
const CARD_MAX_WIDTH = '120px'
const CARD_TOTAL_HEIGHT = '180px'
const CARD_MARGIN_BOTTOM = '2.5rem'

function RecipeCard({ imageSrc, title, altText, onClick, recipeId, isLoggedIn, userId }) {
    const imageAltText = altText || title || '레시피 이미지'
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const isFavorite = useSelector((state) => selectIsFavoriteByRecipeId(state, String(recipeId)))
    const favoriteEntry = useSelector((state) =>
        selectFavoriteEntryByRecipeId(state, String(recipeId))
    )
    const favoriteEntryId = favoriteEntry ? favoriteEntry.ID : null

    const [isHoveringHeart, setIsHoveringHeart] = useState(false) // 하트 아이콘 호버 상태
    const [isLoadingHeart, setIsLoadingHeart] = useState(false) // 찜 처리 중 로딩 상태

    const handleHeartClick = useCallback(
        async (e) => {
            e.stopPropagation() // 이벤트 전파 중단 (카드 전체 클릭 방지)

            if (!isLoggedIn) {
                // 로그인하지 않은 경우
                alert('로그인이 필요합니다.')
                navigate('/login') // 로그인 페이지로 바로 이동
                return
            }

            // --- 로그인 한 경우 ---
            if (isLoadingHeart) return // 중복 처리 방지

            //체크토큰 추가
            try {
                await checkToken()
            } catch (error) {
                alert('로그인을 해주세요!')
                navigate('/login')
                return
            }
            // 사용자에게 확인 메시지 표시
            const confirmMessage = isFavorite ? '찜을 취소하시겠습니까?' : '찜 하시겠습니까?'

            if (window.confirm(confirmMessage)) {
                // 사용자가 '확인'을 누른 경우
                setIsLoadingHeart(true)
                try {
                    if (isFavorite && favoriteEntryId) {
                        // 찜 제거
                        await dispatch(
                            removeFavoriteFromServer({ favoriteEntryId, userId: String(userId) })
                        ).unwrap()
                    } else {
                        // 찜 추가
                        if (userId && recipeId) {
                            await dispatch(
                                addFavoriteToServer({
                                    userId: String(userId),
                                    recipeId: String(recipeId),
                                })
                            ).unwrap()
                        } else {
                            console.error(
                                'RecipeCard: userId 또는 recipeId가 유효하지 않아 찜 추가 불가'
                            )
                            alert('사용자 정보 또는 레시피 정보가 올바르지 않습니다.')
                        }
                    }
                } catch (error) {
                    console.error('즐겨찾기 처리 중 오류:', error)
                    const errorMessage =
                        typeof error === 'string'
                            ? error
                            : error?.message || '알 수 없는 오류가 발생했습니다.'
                    alert(`즐겨찾기 처리 중 오류가 발생했습니다: ${errorMessage}`)
                } finally {
                    setIsLoadingHeart(false)
                }
            }
        },
        [
            isFavorite,
            favoriteEntryId,
            isLoggedIn,
            userId,
            recipeId,
            navigate,
            dispatch,
            isLoadingHeart,
        ]
    )

    const handleCardBodyClick = useCallback(() => {
        onClick?.()
    }, [onClick])

    const heartIconSrc = isFavorite ? fullHeart : isHoveringHeart ? fullHeart : emptyHeart

    return (
        <div
            className="card shadow-sm position-relative recipe-card-custom"
            style={{
                cursor: onClick ? 'pointer' : 'default',
                maxWidth: CARD_MAX_WIDTH,
                width: '100%',
                height: CARD_TOTAL_HEIGHT,
                margin: '0 auto',
                marginBottom: CARD_MARGIN_BOTTOM,
                display: 'flex',
                flexDirection: 'column',
            }}
            onClick={onClick ? handleCardBodyClick : undefined}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            aria-label={onClick ? `${title} 레시피 상세 보기` : title}
        >
            <img
                src={
                    imageSrc ||
                    `https://placehold.co/${parseInt(CARD_MAX_WIDTH)}x${parseInt(IMAGE_HEIGHT)}/EBF0F5/7D8A9C?text=이미지&font=sans-serif`
                }
                className="card-img-top"
                alt={imageAltText}
                style={{
                    width: '100%',
                    height: IMAGE_HEIGHT,
                    objectFit: 'cover',
                    flexShrink: 0,
                }}
                onError={(e) => {
                    e.target.onerror = null
                    e.target.src = `https://placehold.co/${parseInt(CARD_MAX_WIDTH)}x${parseInt(IMAGE_HEIGHT)}/EBF0F5/7D8A9C?text=Error&font=sans-serif`
                }}
                loading="lazy"
            />

            {/* 하트 아이콘: 로그인 여부와 관계없이 항상 표시 */}
            <img
                src={heartIconSrc}
                alt={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
                style={{
                    width: '35px',
                    height: '35px',
                    position: 'absolute',
                    bottom: '30px',
                    right: '5px',
                    cursor: 'pointer',
                    zIndex: 10,
                    opacity: isLoadingHeart ? 0.5 : 1,
                    transition: 'opacity 0.2s ease-in-out',
                }}
                onClick={handleHeartClick}
                onMouseEnter={() => setIsHoveringHeart(true)}
                onMouseLeave={() => setIsHoveringHeart(false)}
                aria-label={isFavorite ? '즐겨찾기 해제하기' : '즐겨찾기에 추가하기'}
                role="button"
                tabIndex={0}
            />

            <div
                className="card-body text-center py-1 px-1"
                style={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                <h5
                    className="card-title fw-bold"
                    title={title}
                    style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontSize: '0.75rem',
                        fontFamily: '"Goyang", sans-serif',
                        margin: 0,
                        lineHeight: '1.4',
                        padding: '0 2px',
                    }}
                >
                    {title || '레시피 제목'}
                </h5>
            </div>
        </div>
    )
}

export default RecipeCard
