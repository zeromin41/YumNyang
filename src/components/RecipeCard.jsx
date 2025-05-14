import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import emptyHeart from '../assets/empty-heart.svg'; 
import fullHeart from '../assets/full-heart.svg';   
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css'; 

// apiConfig.js 에서 설정 가져오기
import { API_BASE_URL, API_REQUEST_OPTIONS, API_POST_REQUEST_OPTIONS } from '../utils/apiConfig.js'; // 경로 주의!

const IMAGE_HEIGHT = '150px';
const CARD_MAX_WIDTH = '120px';
const CARD_TOTAL_HEIGHT = '180px';
const CARD_MARGIN_BOTTOM = '2.5rem';

function RecipeCard({ imageSrc, title, altText, onClick, recipeId, isLoggedIn, userId }) {

    // console.log('RecipeCard imageSrc:', imageSrc, 'for recipe title:', title);


    const imageAltText = altText || title || '반려동물 음식 레시피 이미지';
    const navigate = useNavigate();

    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteId, setFavoriteId] = useState(null);
    const [isHoveringHeart, setIsHoveringHeart] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!isLoggedIn || !userId || !recipeId) {
                setIsFavorite(false);
                setFavoriteId(null);
                return;
            }

            setIsLoading(true); // 로딩 시작 추가
            try {
                const response = await fetch(`${API_BASE_URL}/getFavorites/${userId}`, {
                    ...API_REQUEST_OPTIONS // 공통 GET 요청 옵션 사용
                });
                
                if (response.status === 404) {
                    setIsFavorite(false);
                    setFavoriteId(null);
                    return;
                }
                
                if (!response.ok) {
                    let errorData = { message: `즐겨찾기 조회 실패: ${response.status} ${response.statusText}` };
                    try {
                        const errJson = await response.json();
                        errorData = errJson;
                        console.error('즐겨찾기 조회 실패 (서버 응답):', errJson);
                    } catch (e) {
                        console.error('즐겨찾기 조회 실패 (응답 파싱 불가):', response.status, response.statusText);
                    }
                    setIsFavorite(false);
                    setFavoriteId(null);
                    return;
                }

                const data = await response.json();
                const favoriteItem = data.favorites?.find((fav) => String(fav.recipeId) === String(recipeId)); // ID 비교 시 타입 일치 고려

                if (favoriteItem) {
                    setIsFavorite(true);
                    setFavoriteId(favoriteItem.id);
                } else {
                    setIsFavorite(false);
                    setFavoriteId(null);
                }
            } catch (err) {
                console.error('즐겨찾기 조회 중 네트워크 오류 또는 기타 실패:', err);
                setIsFavorite(false);
                setFavoriteId(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFavorites();
    }, [isLoggedIn, userId, recipeId]);

    const handleHeartClick = useCallback(
        async (e) => {
            e.stopPropagation();

            if (!isLoggedIn || !userId) {
                alert('로그인이 필요한 기능입니다.'); // 사용자에게 알림
                navigate('/login');
                return;
            }

            if (isLoading) return;

            setIsLoading(true);
            try {
                if (isFavorite && favoriteId) {
                    // 즐겨찾기 삭제 (GET 요청)
                    const response = await fetch(`${API_BASE_URL}/removeFavorites/${favoriteId}`, {
                        method: 'GET', // API 명세에 따름
                        ...API_REQUEST_OPTIONS // 공통 GET 요청 옵션 사용
                    });
                    
                    const result = await response.json();
                    if (response.ok) {
                        setIsFavorite(false);
                        setFavoriteId(null);
                        console.log(result.message || '즐겨찾기 삭제 성공');
                    } else {
                        console.error('즐겨찾기 삭제 실패:', result.error || result.message);
                        alert(result.error || result.message || '즐겨찾기 삭제에 실패했습니다.');
                    }
                } else {
                    // 즐겨찾기 추가 (POST 요청)
                    const response = await fetch(`${API_BASE_URL}/addFavorites`, {
                        method: 'POST',
                        ...API_POST_REQUEST_OPTIONS, 
                        body: JSON.stringify({ userId, recipeId }),
                    });
                    
                    const result = await response.json();
                    if (response.ok) {
                        setIsFavorite(true);
                        console.log(result.message || '즐겨찾기 추가 성공');
                        // 즐겨찾기 추가 후 새로운 favoriteId를 가져오기 위해 다시 조회 (?)
                     
                        try {
                            const favResponse = await fetch(`${API_BASE_URL}/getFavorites/${userId}`, {
                                ...API_REQUEST_OPTIONS
                            });
                            if (favResponse.ok) {
                                const favData = await favResponse.json();
                                const newFavorite = favData.favorites?.find((fav) => String(fav.recipeId) === String(recipeId));
                                if (newFavorite) {
                                    setFavoriteId(newFavorite.id);
                                }
                            }
                        } catch (fetchErr) {
                            console.error('즐겨찾기 ID 재조회 실패:', fetchErr);
                        }
                    } else {
                        console.error('즐겨찾기 추가 실패:', result.error || result.message);
                        alert(result.error || result.message || '즐겨찾기 추가에 실패했습니다.');
                    }
                }
            } catch (err) {
                console.error('즐겨찾기 처리 오류:', err);
                if (!isLoggedIn || !userId) { // 혹시 모를 상황 대비
                     alert('로그인이 필요한 기능입니다.');
                    navigate('/login');
                } else {
                    alert('서버와 통신 중 오류가 발생했습니다.');
                }
            } finally {
                setIsLoading(false);
            }
        },
        [isFavorite, favoriteId, isLoggedIn, userId, recipeId, navigate, isLoading]
    );

    const handleClick = useCallback(() => {
        onClick?.();
    }, [onClick]);

    const handleMouseEnterHeart = useCallback(() => {
        setIsHoveringHeart(true);
    }, []);

    const handleMouseLeaveHeart = useCallback(() => {
        setIsHoveringHeart(false);
    }, []);

    const heartIconSrc = isFavorite ? fullHeart : isHoveringHeart ? fullHeart : emptyHeart;

    return (
        <div
            className="card shadow-sm position-relative"
            style={{
                cursor: onClick ? 'pointer' : 'default',
                maxWidth: CARD_MAX_WIDTH,
                width: CARD_MAX_WIDTH,
                height: CARD_TOTAL_HEIGHT,
                margin: '0 auto 1rem auto',
                marginBottom: CARD_MARGIN_BOTTOM,
                display: 'flex',
                flexDirection: 'column',
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
                    flexShrink: 0,
                }}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/${parseInt(CARD_MAX_WIDTH)}x${parseInt(IMAGE_HEIGHT)}/EBF0F5/7D8A9C?text=이미지&font=sans-serif`;
                    e.target.alt = '이미지를 불러올 수 없습니다';
                }}
                loading="lazy"
            />

            <img
                src={heartIconSrc}
                alt="찜하기"
                style={{
                    width: '20px',
                    height: '20px',
                    position: 'absolute',
                    bottom: '35px',
                    right: '5px',
                    cursor: 'pointer',
                    zIndex: 1,
                    opacity: isLoading ? 0.5 : 1,
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
    );
}

export default RecipeCard;