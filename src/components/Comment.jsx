import React, { useEffect, useState } from 'react'
import css from './Comment.module.css'
import StarRating from './StarRating'
import axios from 'axios'
import { API_BASE_URL } from '../utils/apiConfig'
import { getRequest, postRequest } from './../apis/api'
import { checkToken } from '../apis/auth'

const Comment = ({ recipeId, setStarAverage }) => {
    const [reviewData, setReviewData] = useState(null)
    const [reviewerNicknames, setReviewerNicknames] = useState({}) // 댓글 작성자들의 닉네임을 저장할 객체
    const [comment, setComment] = useState('')
    const [rating, setRating] = useState(0)
    const [loggedInNickname, setLoggedInNickname] = useState('')
    const [loggedInUserId, setLoggedInUserId] = useState(null)
    // 리뷰 데이터 가져오기

    const getReviewData = async () => {
        try {
            const response = await axios.get(`https://seungwoo.i234.me:3333/getReview/${recipeId}`)
            setReviewData(response.data)

            // 리뷰 데이터를 받아온 후 각 리뷰 작성자의 닉네임 가져오기
            if (response.data && response.data.review && response.data.review.length > 0) {
                //리뷰 별점값 가져오기
                const ratings = response.data.review.map((review) => review.RATING_SCORE)
                const sum = ratings.reduce((total, rating) => total + rating, 0)
                const average = sum / ratings.length

                if (setStarAverage) {
                    setStarAverage(average)
                }

                // 중복 없이 고유한 USER_ID 추출
                const uniqueUserIds = [
                    ...new Set(response.data.review.map((review) => review.USER_ID)),
                ]

                // 각 USER_ID에 대한 닉네임 가져오기
                fetchReviewerNicknames(uniqueUserIds)
            }
        } catch (error) {
            // 댓글이 1개일 경우 렌더링이 안되는 경우 방지
            setReviewData(null)
            console.error('리뷰 데이터 가져오기 실패:', error)
        }
    }

    useEffect(() => {
        if (recipeId) {
            getReviewData()
            const getNickNameById = async () => {
                const loggedInId = localStorage.getItem('userId')
                if (loggedInId) {
                    setLoggedInUserId(parseInt(loggedInId))
                    try {
                        const response = await getRequest(`/getUserNickname/${loggedInId}`)
                        if (response && response.nickname) {
                            setLoggedInNickname(response.nickname.NICKNAME)
                        }
                    } catch (error) {
                        console.error('로그인 사용자 닉네임 가져오기 실패:', error)
                    }
                }
            }
            getNickNameById()
        }
    }, [recipeId])

    // 닉네임 가져오기 함수
    const fetchReviewerNicknames = async (userIds) => {
        const nicknames = { ...reviewerNicknames } // 기존 닉네임 복사

        // 각 사용자 ID에 대해 개별적으로 닉네임 요청 처리
        for (const userId of userIds) {
            try {
                const response = await axios.get(
                    `https://seungwoo.i234.me:3333/getUserNickname/${userId}`
                )

                if (response.data) {
                    // 응답 데이터 구조에 따라 닉네임 추출
                    if (typeof response.data === 'object' && response.data.NICKNAME) {
                        nicknames[userId] = response.data.NICKNAME
                    } else if (
                        typeof response.data === 'object' &&
                        response.data.nickname &&
                        response.data.nickname.NICKNAME
                    ) {
                        nicknames[userId] = response.data.nickname.NICKNAME
                    } else if (typeof response.data === 'string') {
                        nicknames[userId] = response.data
                    } else {
                        console.log(`사용자 ID ${userId}의 알 수 없는 닉네임 형식:`, response.data)
                        nicknames[userId] = `(알 수 없음)`
                    }
                } else {
                    nicknames[userId] = `(알 수 없음)`
                }
            } catch (error) {
                console.error(`사용자 ID ${userId}의 닉네임 가져오기 실패:`, error)
                // 에러 발생 시 해당 사용자만 '탈퇴한 사용자'로 표시
                nicknames[userId] = `(탈퇴한 사용자)`
            }
        }

        setReviewerNicknames(nicknames)
    }

    // 등록하기 버튼 (리뷰 작성)
    const handleSubmit = async () => {
        try {
            await checkToken()
            if (rating === (null || 0)) {
                alert('평점을 선택해주세요')
                return
            }

            if (comment === (null || '')) {
                alert('내용을 작성해주세요')
                return
            }
            const response = await axios.post(`${API_BASE_URL}/addReview`, {
                recipeId: parseInt(recipeId),
                userId: parseInt(localStorage.getItem('userId')),
                nickname: loggedInNickname,
                ratingScore: parseInt(rating),
                commentText: comment,
            })
            alert('리뷰 작성 완료!')
            setComment('')
            setRating(0)
            await getReviewData()
        } catch (error) {
            console.log('로그인을 해주세요!', error)
            alert(`로그인을 해주세요!`)
        }
    }

    //리뷰 삭제하기
    const DeleteReview = async (reviewId) => {
        try {
            await checkToken()
            if (!window.confirm('댓글을 삭제하시겠습니까?')) {
                return
            }
            const response = await postRequest(`/upDateReview`, {
                id: reviewId,
                type: 'delete',
            })
            alert('댓글이 삭제되었습니다')
            await getReviewData()
        } catch (error) {
            console.error('댓글 삭제 실패:', error)
            alert('댓글 삭제에 실패했습니다')
        }
    }

    // 해당 USER_ID의 닉네임 가져오기 (없으면 "탈퇴한 사용자" 반환)
    const getNickname = (userId) => {
        const nickname = reviewerNicknames[userId]
        if (!nickname) {
            return '(알 수 없음)'
        }

        if (typeof nickname === 'object') {
            // 객체인 경우 NICKNAME 필드 추출
            return nickname.NICKNAME || '(알 수 없음)'
        }
        return nickname
    }

    return (
        <div className={css.commentCon}>
            <div className={css.commentLabel}>
                <span>💬&nbsp;댓글</span>
            </div>

            <div className={css.inputWrapper}>
                <div className={css.commentForm}>
                    <div className={css.ratingWrapper}>
                        <span>평점</span>
                        <StarRating rating={rating} onChange={setRating} />
                    </div>

                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="댓글을 입력하세요"
                    ></textarea>
                    <button onClick={handleSubmit}>📥&nbsp;등록</button>
                </div>
            </div>

            <div className={css.commentList}>
                {reviewData?.review.map((data, index) => (
                    <div className={css.commentWrapper} key={index}>
                        <div className={css.userCon}>
                            <span className={css.commentNickname}>{getNickname(data.USER_ID)}</span>
                            {/* 현재 로그인한 사용자가 댓글 작성자인 경우에만 삭제 버튼 표시 */}
                            {loggedInUserId === data.USER_ID && (
                                <button
                                    className={css.deleteBtn}
                                    onClick={() => DeleteReview(data.ID)}
                                >
                                    삭제
                                </button>
                            )}
                        </div>

                        <div className={css.msgCon}>
                            <span className={css.commentMsg}>{data.COMMENT_TEXT}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Comment
