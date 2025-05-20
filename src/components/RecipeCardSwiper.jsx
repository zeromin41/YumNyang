import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import RecipeCard from './RecipeCard'
import RecipeCardSkeleton from './RecipeCardSkeleton' // 스켈레톤 컴포넌트 임포트
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from 'react-router-dom'

const CARD_MAX_WIDTH = '120px'

function RecipeCardSwiper({ data, onCardClick, isSkeleton = false, isReview, isLoggedIn, userId }) {
    const navigate = useNavigate()

    const spaceBetween = 16
    const slidesOffset = 16
    const slidesPerView = 'auto'

    const swiperParams = {
        modules: [Pagination],
        slidesPerView: slidesPerView,
        spaceBetween: spaceBetween,
        slidesOffsetBefore: slidesOffset,
        slidesOffsetAfter: slidesOffset,
        // pagination: {
        //     clickable: true,
        // },
    }

    return (
        <Swiper {...swiperParams}>
            {data.map((item, index) => (
                <SwiperSlide
                    key={`${item.id}-${index}`}
                    style={{
                        width: CARD_MAX_WIDTH,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {isSkeleton ? (
                        <RecipeCardSkeleton isReview={isReview} />
                    ) : isReview ? (
                        <div
                            onClick={() => navigate(`/recipe/${item.RECIPE_ID}`)}
                            style={{
                                padding: '10px 15px',
                                width: '100%',
                                border: '1px solid rgba(0, 0, 0, 0.175)',
                                boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
                                borderRadius: '5px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                cursor: 'pointer',
                            }}
                        >
                            {item.COMMENT_TEXT}
                        </div>
                    ) : (
                        <RecipeCard
                            recipeId={item.id} // item.id를 recipeId로 전달
                            imageSrc={item.imageSrc}
                            title={item.title}
                            altText={item.altText || item.title}
                            onClick={() => onCardClick && onCardClick(item.id)}
                            isLoggedIn={isLoggedIn} // 로그인 상태 전달
                            userId={userId} // 사용자 ID 전달
                        />
                    )}
                </SwiperSlide>
            ))}
        </Swiper>
    )
}

export default RecipeCardSwiper
