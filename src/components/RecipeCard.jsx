import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import emptyHeart from '../assets/empty-heart.svg'
import fullHeart from '../assets/full-heart.svg'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../index.css'

const IMAGE_HEIGHT = '150px'
const CARD_MAX_WIDTH = '120px'
const CARD_TOTAL_HEIGHT = '180px'
const API_BASE_URL = 'https://seungwoo.i234.me' // 백엔드 API 기본 URL

function RecipeCard({ imageSrc, title, altText, onClick, recipeId, isLoggedIn, userId }) {
    const imageAltText = altText || title || '반려동물 음식 레시피 이미지'
    const navigate = useNavigate()

    const [isFavorite, setIsFavorite] = useState(false)
    const [favoriteId, setFavoriteId] = useState(null) // 즐겨찾기 항목의 고유 ID (삭제 시 사용)
    const [isHoveringHeart, setIsHoveringHeart] = useState(false)

    // 로그인 상태 및 사용자 ID, 레시피 ID가 변경될 때 즐겨찾기 정보 다시 조회
    useEffect(() => {
        const fetchFavorites = async () => {
            if (!isLoggedIn || !userId) {
                setIsFavorite(false)
                setFavoriteId(null)
                return
            }

            try {
                const response = await fetch(`${API_BASE_URL}/getFavorites/${userId}`, {
                    credentials: 'include', // 쿠키를 포함하여 요청
                })
                if (!response.ok) {
                    const errorData = await response
                        .json()
                        .catch(() => ({ error: '즐겨찾기 조회 응답 처리 실패' }))
                    console.error('즐겨찾기 조회 실패:', errorData.error || response.statusText)
                    setIsFavorite(false)
                    setFavoriteId(null)
                    return
                }

                const data = await response.json()
                const favoriteItem = data.favorites?.find((fav) => fav.recipeId === recipeId)

                if (favoriteItem) {
                    setIsFavorite(true)
                    setFavoriteId(favoriteItem.id) // 즐겨찾기 고유 ID (삭제용)
                } else {
                    setIsFavorite(false)
                    setFavoriteId(null)
                }
            } catch (err) {
                console.error('즐겨찾기 조회 중 네트워크 오류 또는 기타 실패:', err)
                setIsFavorite(false)
                setFavoriteId(null)
            }
        }

        fetchFavorites()
    }, [isLoggedIn, userId, recipeId])

    const handleHeartClick = useCallback(
        async (e) => {
            e.stopPropagation() // 카드 클릭 이벤트 전파 방지

            if (!isLoggedIn || !userId) {
                alert('로그인이 필요합니다.')
                navigate('/login')
                return
            }

            try {
                if (isFavorite && favoriteId) {
                    // favoriteId가 있어야 삭제 가능
                    // 즐겨찾기 삭제
                    const response = await fetch(`${API_BASE_URL}/removeFavorites/${favoriteId}`, {
                        method: 'GET',
                        credentials: 'include',
                    })
                    const result = await response.json()
                    if (response.ok) {
                        setIsFavorite(false)
                        setFavoriteId(null)
                        console.log(result.message || '즐겨찾기 삭제 성공')
                    } else {
                        alert(result.error || result.message || '즐겨찾기 삭제에 실패했습니다.')
                    }
                } else {
                    // 즐겨찾기 추가
                    const response = await fetch(`${API_BASE_URL}/addFavorites`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId, recipeId }),
                        credentials: 'include',
                    })
                    const result = await response.json()
                    if (response.ok) {
                        setIsFavorite(true)
                        console.log(result.message || '즐겨찾기 추가 성공')
                    } else {
                        alert(result.error || result.message || '즐겨찾기 추가에 실패했습니다.')
                    }
                }
            } catch (err) {
                alert('서버와 통신 중 오류가 발생했습니다.')
                console.error('즐겨찾기 처리 오류:', err)
            }
        },
        [isFavorite, favoriteId, isLoggedIn, userId, recipeId, navigate]
    )

    const handleClick = useCallback(() => {
        onClick?.()
    }, [onClick])

    const handleMouseEnterHeart = useCallback(() => {
        setIsHoveringHeart(true)
    }, [])

    const handleMouseLeaveHeart = useCallback(() => {
        setIsHoveringHeart(false)
    }, [])

    const heartIconSrc = isFavorite ? fullHeart : isHoveringHeart ? fullHeart : emptyHeart

    return (
        <div
            className="card shadow-sm position-relative"
            style={{
                cursor: onClick ? 'pointer' : 'default',
                maxWidth: CARD_MAX_WIDTH,
                height: CARD_TOTAL_HEIGHT,
                margin: '0 auto 1rem auto',
                marginBottom: '2.5rem',
            }}
            onClick={onClick ? handleClick : undefined}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            aria-label={onClick ? `${title} 레시피 보기` : title}
        >
            <img
                src={imageSrc}
                className="card-img-top"
                alt={imageAltText}
                style={{
                    width: '100%',
                    height: IMAGE_HEIGHT,
                    objectFit: 'cover',
                }}
                onError={(e) => {
                    e.target.onerror = null
                    e.target.src = `https://placehold.co/${parseInt(CARD_MAX_WIDTH)}x${parseInt(IMAGE_HEIGHT)}/EBF0F5/7D8A9C?text=이미지&font=sans-serif`
                    e.target.alt = '이미지를 불러올 수 없습니다'
                }}
                loading="lazy"
            />

            {/* 찜 하트 아이콘 */}
            <img
                src={heartIconSrc}
                alt="찜하기"
                style={{
                    width: '20px',
                    height: '20px',
                    position: 'absolute',
                    bottom: '35px', // 제목 영역 바로 위
                    right: '5px',
                    cursor: 'pointer',
                    zIndex: 1, // 다른 요소 위에 오도록
                }}
                onClick={handleHeartClick}
                onMouseEnter={handleMouseEnterHeart}
                onMouseLeave={handleMouseLeaveHeart}
            />

            <div className="card-body text-center py-1 px-1">
                <h5
                    className="card-title fw-bold"
                    style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontSize: 'var(--fs12)',
                        fontFamily: '"Goyang", sans-serif',
                        margin: 0,
                        maxHeight: 'calc(var(--fs12) * 2)',
                        lineHeight: '1.4',
                    }}
                >
                    {title}
                </h5>
            </div>
        </div>
    )
}

export default RecipeCard
