import React, { useState } from 'react'
import fullStar from '../assets/full-star.svg'
import star from '../assets/star-02.svg'
const StarRating = ({ totalStars = 5, rating = 0, onChange }) => {
    const handleStarClick = (index) => {
        const newRating = index + 1
        onChange(newRating)
    }

    return (
        <div>
            {Array.from({ length: totalStars }, (_, index) => (
                <img
                    key={index}
                    src={index < rating ? `${fullStar}` : `${star}`}
                    alt={`${index + 1}점`}
                    onClick={() => handleStarClick(index)}
                    style={{ cursor: 'pointer', width: '30px' }}
                />
            ))}
        </div>
    )
}

export default StarRating
