import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../index.css'

// 컴포넌트 내에서 사용할 고정 크기 값들을 상수로 정의합니다.
const IMAGE_HEIGHT = '160px' // 이미지 높이 고정
const CARD_MAX_WIDTH = '120px' // 카드의 최대 너비 설정
const CARD_TOTAL_HEIGHT = '200px'
/**
 * 카드를 클릭하여 상세 페이지 등으로 이동하는 기능 추후 포함.
 *
 * @param {object} props - 컴포넌트 속성
 * @param {string} props.imageSrc - 레시피 음식 이미지 URL
 * @param {string} props.title - 레시피 제목 텍스트
 * @param {string} [props.altText] - 이미지 대체 텍스트 (선택 사항, 없으면 title 사용)
 * @param {function} [props.onClick] - 카드를 클릭했을 때 실행될 함수
 */
function RecipeCard({ imageSrc, title, altText, onClick }) {
    // 이미지 대체 텍스트 결정: altText가 제공되면 사용, 아니면 title, 둘 다 없으면 기본값
    const imageAltText = altText || title || '반려동물 음식 레시피 이미지'

    // 카드 클릭 이벤트 핸들러
    const handleClick = () => {
        // onClick prop이 존재하면 해당 함수를 실행
        onClick?.() // '?.()'는 onClick이 null 또는 undefined가 아닐 때만 호출되도록
    }

    return (
        // 카드 전체를 감싸는 컨테이너 (클릭 가능한 영역)
        <div
            className="card shadow-sm" // Bootstrap 카드 스타일 및 그림자 효과 적용
            style={{
                cursor: onClick ? 'pointer' : 'default', // onClick prop이 있으면 마우스 커서를 포인터로 변경
                maxWidth: CARD_MAX_WIDTH,
                height: CARD_TOTAL_HEIGHT,
                margin: '0 auto 1rem auto',
                marginBottom: '2.5rem', // 추가: 카드 자체의 하단 여백 (페이지네이션과의 간격)
            }}
            // onClick prop이 있을 때만 클릭이벤트를 연결하고 접근성 속성 추가
            onClick={onClick ? handleClick : undefined}
            role={onClick ? 'button' : undefined} // 스크린 리더에게 이 요소가 버튼 역할을 함을 알림 (시각장애인용 지침으로로 많이 쓰인대요)
            tabIndex={onClick ? 0 : undefined} // 키보드로 이 요소에 포커스 할 수 있게 함
            aria-label={onClick ? `${title} 레시피 보기` : title} // 스크린 리더에게 요소의 목적을 더 명확하게 전달
        >
            {/* 레시피 이미지 (카드 상단 이미지) */}
            <img
                src={imageSrc}
                className="card-img-top" // Bootstrap 클래스: 카드 상단 이미지 스타일
                alt={imageAltText} // 이미지 대체 텍스트
                style={{
                    width: '100%', // 이미지 너비를 부모 컨테이너(카드)에 맞게 조절
                    height: IMAGE_HEIGHT, // 이미지 높이 고정
                    objectFit: 'cover',
                }}
                onError={(e) => {
                    // 이미지 로드 실패 시 처리
                    e.target.onerror = null
                    e.target.src = `https://placehold.co/${parseInt(CARD_MAX_WIDTH)}x${parseInt(IMAGE_HEIGHT)}/EBF0F5/7D8A9C?text=이미지&font=sans-serif`
                    e.target.alt = '이미지를 불러올 수 없습니다'
                }}
                loading="lazy" // 이미지 지연 로딩 적용
            />

            {/* 카드 본문 (레시피 제목 영역) */}
            <div className="card-body text-center py-1 px-1">
                {/* 레시피 제목 */}
                <h5
                    className="card-title fw-bold"
                    style={{
                        // 제목이 길어질 경우 2줄까지만 표시하고 나머지는 '...'으로 처리
                        display: '-webkit-box', // Webkit 기반 브라우저에서 줄 수 제한을 위해 필요
                        WebkitLineClamp: 2, // 최대 2줄
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden', // 지정된 영역을 벗어나는 텍스트 숨김
                        textOverflow: 'ellipsis', // 숨겨진 텍스트 대신 '...' 표시
                        fontSize: 'var(--fs12)',
                        fontFamily: '"Goyang", sans-serif',
                        margin: 0, // h5 태그의 기본 상하 마진 제거
                    }}
                >
                    {title} {/* 레시피 제목 텍스트 */}
                </h5>
            </div>
        </div>
    )
}

export default RecipeCard
