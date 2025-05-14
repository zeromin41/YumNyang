import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import RecipeCard from './RecipeCard';
import RecipeCardSkeleton from './RecipeCardSkeleton'; // 스켈레톤 컴포넌트 임포트

const CARD_MAX_WIDTH = '120px';

function RecipeCardSwiper({ data, onCardClick, isSkeleton = false, isLoggedIn, userId }) {
    const spaceBetween = 16;
    const slidesOffset = 16;
    const slidesPerView = 'auto';

    const swiperParams = {
        modules: [Pagination],
        slidesPerView: slidesPerView,
        spaceBetween: spaceBetween,
        slidesOffsetBefore: slidesOffset,
        slidesOffsetAfter: slidesOffset,
        pagination: {
            clickable: true,
        },
    };

    return (
        <Swiper {...swiperParams}>
            {data.map((item) => (
                <SwiperSlide
                    key={isSkeleton ? item.id : item.id} // 스켈레톤과 실제 데이터의 id 사용
                    style={{
                        width: CARD_MAX_WIDTH,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {isSkeleton ? (
                        <RecipeCardSkeleton />
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
    );
}

export default RecipeCardSwiper;