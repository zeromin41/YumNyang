import React from 'react'
import RecipeStepCard from '../components/RecipeStepCard'

const RecipeDetailPage = () => {
    //더미데이터
    const recipes = {
        title: '단호박 닭가슴살 베이크',

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
                instruction:
                    '숙성된 갈비를 냄비에 담고 물 1컵을 부어 푹 익힙니다. 고기가 익으면 무, 당근, 대파를 넣고 국물이 자박해질 때까지 끓입니다.',
                image: '/images/testImg.jpg',
            },
        ],
    }

    return (
        <>
            {recipes.steps.map((step, index) => (
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
