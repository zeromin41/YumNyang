import React, { useState } from 'react'

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
                    src={index < rating ? 'icons/sta-fill.svg' : 'icons/star.svg'}
                    alt={`${index + 1}점`}
                    onClick={() => handleStarClick(index)}
                    style={{ cursor: 'pointer' }}
                />
            ))}
        </div>
    )
}

export default StarRating
