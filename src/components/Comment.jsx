import React, { useEffect, useState } from 'react'
import css from './Comment.module.css'
import StarRating from './StarRating'
import axios from 'axios'
import { API_BASE_URL } from '../utils/apiConfig'
import { getRequest } from './../apis/api'

const Comment = ({ recipeId }) => {
    const [reviewData, setReviewData] = useState(null)
    const [reviewerNicknames, setReviewerNicknames] = useState({}) // 댓글 작성자들의 닉네임을 저장할 객체
    const [comment, setComment] = useState('')
    const [rating, setRating] = useState(0)
    const [loggedInNickname, setLoggedInNickname] = useState('')
    // 리뷰 데이터 가져오기

    const getReviewData = async () => {
        try {
            const response = await axios.get(`https://seungwoo.i234.me:3333/getReview/${recipeId}`)
            setReviewData(response.data)

            // 리뷰 데이터를 받아온 후 각 리뷰 작성자의 닉네임 가져오기
            if (response.data && response.data.review && response.data.review.length > 0) {
                // 중복 없이 고유한 USER_ID 추출
                const uniqueUserIds = [
                    ...new Set(response.data.review.map((review) => review.USER_ID)),
                ]

                // 각 USER_ID에 대한 닉네임 가져오기
                fetchReviewerNicknames(uniqueUserIds)
            }
        } catch (error) {
            console.error('리뷰 데이터 가져오기 실패:', error)
        }
    }

    useEffect(() => {
        if (recipeId) {
            getReviewData()
            const getNickNameById = async () => {
                const loggedInId = localStorage.getItem('userId')
                const response = await getRequest(`/getUserNickname/${loggedInId}`)
                setLoggedInNickname(response.nickname.NICKNAME)
            }
            getNickNameById()
        }
    }, [recipeId])

    // 닉네임 가져오기 함수
    const fetchReviewerNicknames = async (userIds) => {
        try {
            // 각 사용자 ID에 대한 닉네임 요청을 병렬로 처리
            const nicknamePromises = userIds.map((userId) =>
                axios.get(`https://seungwoo.i234.me:3333/getUserNickname/${userId}`)
            )

            const responses = await Promise.all(nicknamePromises)

            // 결과를 객체로 변환하여 저장 (userId: nickname)
            const nicknames = {}
            responses.forEach((response, index) => {
                if (response.data) {
                    // 응답 데이터 구조에 따라 닉네임 추출
                    // NICKNAME 필드가 있는 경우 (객체인 경우)
                    if (typeof response.data === 'object' && response.data.NICKNAME) {
                        nicknames[userIds[index]] = response.data.NICKNAME
                    }
                    // nickname 필드가 있는 경우
                    else if (typeof response.data === 'object' && response.data.nickname) {
                        nicknames[userIds[index]] = response.data.nickname
                    }
                    // 응답이 직접 문자열인 경우
                    else if (typeof response.data === 'string') {
                        nicknames[userIds[index]] = response.data
                    }
                    // 다른 형태의 응답
                    else {
                        console.log('알 수 없는 닉네임 형식:', response.data)
                        nicknames[userIds[index]] = '익명'
                    }
                } else {
                    nicknames[userIds[index]] = '익명' // 응답이 없는 경우 기본값
                }
            })

            setReviewerNicknames(nicknames)
        } catch (error) {
            console.error('닉네임 가져오기 실패:', error)
        }
    }

    // 등록하기 버튼 (리뷰 작성)
    const handleSubmit = async () => {
        if (localStorage.getItem('userId') === (null | undefined)) {
            alert('로그인을 해주세요')
            return
        }

        if (rating === (null || 0)) {
            alert('평점을 선택해주세요')
            return
        }

        if (comment === (null || '')) {
            alert('내용을 작성해주세요')
            return
        }

        try {
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
            console.log('리뷰 작성 실패', error)
            alert(`리뷰 작성을 실패했습니다${loggedInNickname}`)
        }
    }

    // 해당 USER_ID의 닉네임 가져오기 (없으면 "익명" 반환)
    const getNickname = (userId) => {
        // reviewerNicknames[userId]가 객체가 아닌 문자열인지 확인
        const nickname = reviewerNicknames[userId]
        if (typeof nickname === 'object') {
            // 객체인 경우 NICKNAME 필드 추출
            return nickname.NICKNAME || '익명'
        }
        return nickname || '익명'
    }

    return (
        <div className={css.commentCon}>
            <div className={css.commentLabel}>
                <span>💬 댓글</span>
            </div>

            <div className={css.inputWrapper}>
                <div className={css.userCon}>
                    {/* 현재 로그인 중인 사람의 닉네임을 가져오거나 아예 빼도 어색하지 않을 듯함 */}
                    <span>작성자</span>
                </div>

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
                    <button onClick={handleSubmit}>📥 등록</button>
                </div>
            </div>

            <div className={css.commentList}>
                {reviewData?.review.map((data, index) => (
                    <div className={css.commentWrapper} key={index}>
                        <div className={css.userCon}>
                            {/* 객체를 직접 렌더링하지 않고 문자열만 렌더링 */}
                            <span className={css.commentNickname}>{getNickname(data.USER_ID)}</span>
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
