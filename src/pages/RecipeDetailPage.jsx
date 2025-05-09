import React from 'react'
import RecipeStepCard from '../components/RecipeStepCard'

const RecipeDetailPage = () => {
    //더미데이터
    const recipes = {
        title: '단호박 닭가슴살 베이크',

        steps: [
            {
                instruction: '단호박은 껍질을 벗기고 찐 후 으깬다.',
                image: '/public/images/testImg.jpg',
            },
            {
                instruction: '닭가슴살을 익힌 후 잘게 찢는다.',
                image: '/public/images/testImg.jpg',
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
