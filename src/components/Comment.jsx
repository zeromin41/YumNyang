import React, { useState } from 'react'
import css from './Comment.module.css'
import StarRating from './StarRating'

const Comment = () => {
    const [comment, setComment] = useState('')
    const [rating, setRating] = useState(0)

    const handleSubmit = () => alert('등록')

    return (
        <div className={css.commentCon}>
            <label>💬 댓글</label>
            <div className={css.bar}></div>
            <div className={css.commentWrapper}>
                <div className={css.userCon}>
                    <div className={css.userImg}>
                        <img src="images/defaultUserImg.svg" alt="작성자" />
                    </div>
                    <p>작성자</p>
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
                <div className={css.commentWrapper}>
                    <div className={css.userCon}>
                        <div className={css.userImg}>
                            <img src="images/defaultUserImg.svg" alt="작성자" />
                        </div>
                        <p>작성자</p>
                    </div>
                    <p className={css.commentMsg}>레시피가 간단하고 쉬워요 ~</p>
                </div>
                <div className={css.commentWrapper}>
                    <div className={css.userCon}>
                        <div className={css.userImg}>
                            <img src="images/defaultUserImg.svg" alt="작성자" />
                        </div>
                        <p>작성자</p>
                    </div>
                    <p className={css.commentMsg}>레시피가 간단하고 쉬워요 ~</p>
                </div>
            </div>
        </div>
    )
}

export default Comment
