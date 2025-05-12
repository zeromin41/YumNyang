import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import RecipeCard from './RecipeCard'

// RecipeCard와 스켈레톤에서 사용했던 크기 상수 (일관성을 위해 여기서 다시 정의)
const CARD_MAX_WIDTH = '120px' // 스와이퍼 계산 시 중요한 카드 하나의 너비

/**
 * RecipeCard 리스트를 Swiper 슬라이더로 표시하는 컴포넌트
 *
 * @param {object} props - 컴포넌트 속성
 * @param {Array<object>} props.data - 레시피 데이터 배열. 각 객체는 { id, imageSrc, title, ... } 형태
 * @param {function} [props.onCardClick] - 각 카드를 클릭했을 때 실행될 함수 (레시피 ID 등을 인자로 전달 가능)
 */
function RecipeCardSwiper({ data, onCardClick }) {
    // 스와이퍼 슬라이드 간 간격 및 컨테이너 좌우 패딩에 사용할 값 (CSS 변수 활용)
    // index.css에 정의된 --fs16 (16px) 변수를 사용
    const spaceBetween = 16 // px
    const slidesOffset = 16 // px (좌우 여백)
    const slidesPerView = 'auto' //  다음 슬라이드 살짝 보이도록 설정

    // Swiper 설정 객체
    const swiperParams = {
        modules: [Pagination], // 사용할 모듈 등록
        slidesPerView: slidesPerView, // 한 화면에 보여줄 슬라이드 수 또는 'auto'
        spaceBetween: spaceBetween, // 슬라이드 사이의 간격 (px)
        slidesOffsetBefore: slidesOffset, // 첫 번째 슬라이드 앞에 여백 추가 (컨테이너 왼쪽 패딩 효과)
        slidesOffsetAfter: slidesOffset, // 마지막 슬라이드 뒤에 여백 추가 (컨테이너 오른쪽 패딩 효과)
        pagination: {
            // 페이지네이션 (점 모양 인디케이터) 사용 설정
            clickable: true, // 점을 클릭하여 해당 슬라이드로 이동 가능
        },
    }

    return (
        // 스와이퍼 컨테이너: 전체 화면 너비보다 약간 작게 보이도록 좌우 offset을 사용
        <Swiper {...swiperParams}>
            {/* 데이터 배열을 순회하며 각 항목을 SwiperSlide로 렌더링 */}
            {data.map((recipe) => (
                <SwiperSlide
                    key={recipe.id} // 각 슬라이드의 고유 키 (레시피 ID 등)
                    style={{
                        width: CARD_MAX_WIDTH, // 예: '120px'
                        display: 'flex', // 내부 RecipeCard 정렬을 위해 flex 사용
                        justifyContent: 'center', // RecipeCard 중앙 정렬
                        alignItems: 'center', // RecipeCard 세로 중앙 정렬
                    }}
                >
                    {/* 각 슬라이드 안에 RecipeCard 컴포넌트 렌더링 */}
                    <RecipeCard
                        imageSrc={recipe.imageSrc}
                        title={recipe.title}
                        // RecipeCard에 다른 필요한 props 전달 
                        altText={recipe.altText || recipe.title}
                        // 카드 클릭 시 상위 컴포넌트로부터 받은 onCardClick 함수 호출
                        onClick={() => onCardClick && onCardClick(recipe.id)} // 클릭 시 레시피 ID 등 전달
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    )
}

export default RecipeCardSwiper
