import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'
import { Pagination, Autoplay } from 'swiper/modules'
import css from './Slider.module.css'
import { useState } from 'react'

const recipesData = [
    {
        id: 1,
        title: '단호박 닭가슴살 베이크',
        description: '건강한 단호박과 닭가슴살로 만드는 간단한 베이크 요리',
        thumbnail: 'images/testWideImg.png',
        ingredients: [
            '단호박 1개',
            '닭가슴살 200g',
            '모짜렐라 치즈 100g',
            '올리브 오일 2큰술',
            '소금, 후추 약간',
        ],
        steps: [
            {
                instruction: '단호박은 껍질을 벗기고 찐 후 으깬다.',
                image: '/images/testImg.jpg',
            },
            {
                instruction: '닭가슴살을 익힌 후 잘게 찢는다.',
                image: '/images/testImg2.png',
            },
            {
                instruction: '으깬 단호박과 닭가슴살을 섞고 조미료로 간을 한다.',
                image: '/images/testImg.jpg',
            },
        ],
        cookingTime: '30분',
        difficulty: '쉬움',
    },
    {
        id: 2,
        title: '돼지갈비찜',
        description: '부드럽고 맛있는 돼지갈비찜 레시피',
        ingredients: ['돼지갈비 500g', '무 1/2개', '당근 1개', '대파 1대', '양념장'],
        thumbnail: 'images/testWideImg.png',
        steps: [
            {
                instruction: '갈비를 물에 1시간 정도 담가 핏물을 뺀다.',
                image: '/images/testImg.jpg',
            },
            {
                instruction: '무와 당근, 대파를 적당한 크기로 썬다.',
                image: '/images/testImg2.png',
            },
            {
                instruction:
                    '숙성된 갈비를 냄비에 담고 물 1컵을 부어 푹 익힙니다. 고기가 익으면 무, 당근, 대파를 넣고 국물이 자박해질 때까지 끓입니다.',
                image: '/images/testImg.jpg',
            },
        ],
        cookingTime: '1시간 30분',
        difficulty: '중간',
    },
]

const Slider = () => {
    //추후에 useEffect로 데이터 get해와야함
    const [slideData, setSlideData] = useState(recipesData)

    // 이미지 링크
    const ImgClickEvent = () => {
        alert('눌렀음')
    }
    return (
        <div>
            <Swiper
                slidesPerView={1}
                spaceBetween={30}
                autoplay={{
                    delay: 2200,
                    disableOnInteraction: false, // 사용자 상호작용 후에도 자동 재생 유지
                }}
                loop={true}
                pagination={{ clickable: true }}
                modules={[Pagination]}
                className="mySwiper"
            >
                {slideData.map((data) => (
                    <SwiperSlide key={data.id}>
                        <div className={css.imgWrap} onClick={ImgClickEvent}>
                            <img src={data.thumbnail} alt="레시피 이미지" />
                        </div>
                        {/* 이미지 요리명 필요하면 사용 */}
                        {/* <div className={css.textWrap}>
                            <p>{data.title}</p>
                        </div> */}
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default Slider
