import React from 'react'
import '../index.css' // index.css가 먼저 임포트되도록 순서 조정 가능성 있음
import 'bootstrap/dist/css/bootstrap.min.css'

// RecipeCard와 동일한 상수 사용
const IMAGE_HEIGHT = '150px'
const CARD_MAX_WIDTH = '120px'
const CARD_TOTAL_HEIGHT = '180px' // RecipeCard의 최종 높이
const CARD_MARGIN_BOTTOM = '2.5rem' // RecipeCard와 동일한 하단 마진

function RecipeCardSkeleton({ isReview }) {
    const SKELETON_TITLE_HEIGHT = 'calc(var(--fs12) * 1.4)' // 대략적인 한 줄 제목 높이

    if (isReview) {
        return (
            <div
                className="card shadow-sm"
                style={{
                    maxWidth: CARD_MAX_WIDTH,
                    width: CARD_MAX_WIDTH,
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#fff',
                }}
                aria-hidden="true"
            >
                <div
                    className="placeholder-glow"
                    style={{
                        width: '100%',
                        height: 30,
                        backgroundColor: '#e9ecef',
                        flexShrink: 0,
                    }}
                >
                    <span className="placeholder w-100 h-100 d-block"></span>
                </div>
            </div>
        )
    }
    return (
        <div
            className="card shadow-sm" // RecipeCard와 동일한 클래스 유지
            style={{
                maxWidth: CARD_MAX_WIDTH,
                width: CARD_MAX_WIDTH, // 너비 고정
                height: CARD_TOTAL_HEIGHT, // ★★★ 전체 높이 고정 ★★★
                margin: `0 auto 1rem auto`, // RecipeCard의 기본 마진 (좌우 auto, 상단 0, 하단 1rem)
                marginBottom: CARD_MARGIN_BOTTOM, // RecipeCard와 동일한 하단 마진 (더 구체적인 값으로 덮어쓰기)
                display: 'flex', // 내부 요소(이미지, 본문) 수직 정렬
                flexDirection: 'column',
                backgroundColor: '#fff', // 스켈레톤 배경색 (Bootstrap card 기본값과 유사하게)
            }}
            aria-hidden="true"
        >
            {/* 이미지 영역 스켈레톤 */}
            <div
                className="placeholder-glow"
                style={{
                    width: '100%',
                    height: IMAGE_HEIGHT, // 이미지 높이 고정
                    backgroundColor: '#e9ecef', // 플레이스홀더 기본 배경색
                    flexShrink: 0, // 상위 flex 컨테이너에서 크기가 줄어들지 않도록
                }}
            >
                <span className="placeholder w-100 h-100 d-block"></span>
            </div>

            {/* 카드 본문 스켈레톤 (텍스트 영역) */}
            <div
                className="card-body text-center py-1 px-1" // RecipeCard와 동일한 클래스 및 패딩
                style={{
                    flexGrow: 1, // 남은 공간을 모두 차지하도록
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center', // 내부 플레이스홀더를 수직 중앙에 (선택적)
                    alignItems: 'center', // 내부 플레이스홀더를 수평 중앙에
                    backgroundColor: 'transparent', // card-body 자체는 투명하게
                }}
            >
                <div
                    className="placeholder-glow w-100" // 너비 100%
                    style={{
                        height: SKELETON_TITLE_HEIGHT, // 제목 영역의 높이와 유사하게
                        display: 'flex',
                        alignItems: 'center', // 내부 span 정렬
                    }}
                >
                    <span
                        className="placeholder"
                        style={{ width: '80%', height: 'calc(var(--fs12))' }} // 실제 텍스트 높이와 유사하게
                    ></span>
                </div>
            </div>
        </div>
    )
}

export default RecipeCardSkeleton
