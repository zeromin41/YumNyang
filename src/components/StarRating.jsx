import React, { useState } from 'react'
import star from '../assets/star.svg'
import filledStar from '../assets/star-fill.svg'

const StarRating = ({ totalStars = 5, onChange }) => {
    const [rating, setRating] = useState(0)

    const handleStarClick = (index) => {
        const newRating = index + 1
        setRating(newRating)
        onChange(newRating)
    }

    return (
        <div>
            {Array.from({ length: totalStars }, (_, index) => (
                <img
                    key={index}
                    src={index < rating ? filledStar : star}
                    alt={`${index + 1}점`}
                    onClick={() => handleStarClick(index)}
                    style={{ cursor: 'pointer' }}
                />
            ))}
        </div>
    )
}

export default StarRating
