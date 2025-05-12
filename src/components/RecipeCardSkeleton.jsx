import React from 'react'
import '../index.css'
import 'bootstrap/dist/css/bootstrap.min.css' // Bootstrap CSS 임포트

const IMAGE_HEIGHT = '160px'
const CARD_MAX_WIDTH = '120px'

/* RecipeCard 컴포넌트의 로딩 상태를 시각적으로 표시하는 스켈레톤 UI 컴포넌트*/
function RecipeCardSkeleton() {
    return (
        <div
            className="card shadow-sm"
            style={{
                maxWidth: CARD_MAX_WIDTH, // 실제 카드와 동일한 최대 너비 적용
                margin: '0 auto 1rem auto', // 실제 카드와 동일하게 중앙 정렬 및 하단 마진
            }}
            aria-hidden="true" // 스크린 리더가 이 스켈레톤 요소를 무시하도록 설정 (접근성)
        >
            {/* 이미지 영역 스켈레톤 플레이스홀더 */}
            <div
                className="placeholder-glow" // 플레이스홀더 빛나는 애니메이션 효과
                style={{
                    width: '100%', // 부모(카드) 너비에 꽉 차도록 설정
                    height: IMAGE_HEIGHT, // 실제 이미지와 동일한 높이 적용
                    // Bootstrap .placeholder 클래스가 기본 배경색을 제공
                }}
            >
                {/* 실제 플레이스홀더 애니메이션 요소 */}
                <span className="placeholder w-100 h-100 d-block"></span>
            </div>

            {/* 카드 본문 스켈레톤 (텍스트 영역) */}
            <div className="card-body text-center py-1 px-1">
                <div
                    className="placeholder-glow" // 플레이스홀더 빛나는 애니메이션 효과
                    style={{
                        minHeight: '2rem', // 예시 값
                    }}
                >
                    <span
                        className="placeholder d-inline-block" // 스켈레톤 요소, 인라인 블록으로 너비 지정
                        style={{ width: '80%', height: 'var(--fs12)' }} // 첫 번째 줄: 너비 70%,
                    ></span>
                </div>
            </div>
        </div>
    )
}

export default RecipeCardSkeleton
