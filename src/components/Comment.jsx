import React, { useEffect, useState } from 'react'
import css from './Comment.module.css'
import StarRating from './StarRating'
import axios from 'axios'

const Comment = ({ recipeId }) => {
    const [reviewData, setReviewData] = useState(null)
    const [comment, setComment] = useState('')
    const [rating, setRating] = useState(0)

    useEffect(() => {
        const getReviewData = async () => {
            const response = await axios.get(`https://seungwoo.i234.me:3333/getReview/${recipeId}`)
            setReviewData(response.data)
            console.log('리뷰데이터 받아오기 성공', response.data)
        }
        getReviewData()
    }, [])

    const handleSubmit = () => {
        alert(rating)
    }

    return (
        <div className={css.commentCon}>
            <div className={css.commentLabel}>
                <span>💬 댓글</span>
            </div>

            <div className={css.commentWrapper}>
                <div className={css.userCon}>
                    <span>작성자</span>
                </div>
                <div className={css.commentForm}>
                    <div className={css.ratingWrapper}>
                        <span>평점</span>
                        <StarRating onChange={setRating} />
                    </div>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                    <button onClick={handleSubmit}>📥 등록</button>
                </div>
            </div>
            <div className={css.commentList}>
                {/* {reviewData.review.map((data, index) => (
                    <div className={css.commentWrapper} key={index}>
                        <div className={css.userCon}>
                            <span>{data.U</span>
                        </div>
                        <span className={css.commentMsg}>레시피가 간단하고 쉬워요 ~</span>
                    </div>
                ))} */}

                <div className={css.commentWrapper}>
                    <div className={css.userCon}>
                        <span>작성자</span>
                    </div>
                    <span className={css.commentMsg}>레시피가 간단하고 쉬워요 ~</span>
                </div>
            </div>
        </div>
    )
}

export default Comment
