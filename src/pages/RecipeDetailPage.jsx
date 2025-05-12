import React, { useState } from 'react'
import RecipeStepCard from '../components/RecipeStepCard'
import TTSComponent from '../components/TTSComponent'

//더미데이터
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
                image: '/images/testImg.jpg',
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
                image: '/images/testImg.jpg',
            },
            {
                instruction:
                    '숙성된 갈비를 냄비에 담고 물 1컵을 부어 푹 익힌다. 고기가 익으면 무, 당근, 대파를 넣고 국물이 자박해질 때까지 끓인다.',
                image: '/images/testImg.jpg',
            },
        ],
        cookingTime: '1시간 30분',
        difficulty: '중간',
    },
]

const RecipeDetailPage = () => {
    const [recipeData, setRecipeData] = useState(recipesData)
    //useEffect로 데이터 받아와야함

    //조리법 전체를 읽어주기 위해 필요
    const recipeStepsInstruction = recipeData[0].steps.map((step) => step.instruction)

    return (
        <>
            <TTSComponent text={recipeStepsInstruction} />
            {/* 게시글 id로 받아 올 예정 */}
            {recipeData[0].steps.map((step, index) => (
                <RecipeStepCard
                    key={index}
                    number={index + 1}
                    instruction={step.instruction}
                    image={step.image}
                />
            ))}
        </>
    )
}

export default RecipeDetailPage
