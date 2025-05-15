import React, { useEffect, useState } from 'react'
import css from './WithdrawPage.module.css'
import { useNavigate } from 'react-router-dom'
import InputField from '../components/InputField'
import Button from '../components/Button'
import { isEmpty, isValidPasswordConfirm } from '../utils/validator'
import { VALIDATION_MESSAGES } from '../constants/messages'
import { withdraw } from '../apis/auth'
import { API_REQUEST_OPTIONS } from '../utils/apiConfig'
import axios from 'axios'
import { fetchCheckToken } from '../apis/api'

const WithDrawPage = () => {
    const navigate = useNavigate()

    const [id, setId] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')

    const [idError, setIdError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [passwordConfirmError, setPasswordConfirmError] = useState('')

    const handleChange = (setter) => (e) => {
        setter(e.target.value)
    }

    const handleWithdraw = async () => {
        // 빈 값 검증
        setIdError(!isEmpty(id) ? '' : VALIDATION_MESSAGES.EMPTY_ID)
        setPasswordError(!isEmpty(password) ? '' : VALIDATION_MESSAGES.EMPTY_PASSWORD)
        // 비밀번호 일치 검증
        setPasswordConfirmError(
            isValidPasswordConfirm(password, passwordConfirm)
                ? ''
                : VALIDATION_MESSAGES.PASSWORD_CONFIRM
        )

        if (idError || passwordError || passwordConfirmError) return

        // 회원탈퇴
        try {
            const userId = localStorage.getItem('userId')
            if (!userId) {
                alert('로그인 정보가 없습니다. 다시 로그인해주세요.')
                navigate('/login')
                return
            }

            const formData = {
                id: userId,
                email: id,
                password,
            }
            const res = await withdraw(formData)
            alert(res.message)

            localStorage.removeItem('userId')
            setIdError('')
            setPasswordError('')
            setPasswordConfirmError('')

            navigate('/')
        } catch (err) {
            setPasswordConfirmError(err.message)
        }
    }

    return (
        <div className={css.withdrawCon}>
            <form onSubmit={(e) => e.preventDefault()} className={css.withdrawForm}>
                <InputField
                    label="기존 아이디"
                    id="id"
                    value={id}
                    onChange={handleChange(setId)}
                    errorMsg={idError}
                />
                <InputField
                    label="기존 비밀번호"
                    id="password"
                    value={password}
                    type="password"
                    onChange={handleChange(setPassword)}
                    errorMsg={passwordError}
                />
                <InputField
                    label="비밀번호 재입력"
                    id="passwordConfirm"
                    value={passwordConfirm}
                    type="password"
                    onChange={handleChange(setPasswordConfirm)}
                    errorMsg={passwordConfirmError}
                />
            </form>
            <div className={css.btnWrapper}>
                <Button text="토큰체크" color="red" flex={1} onClick={fetchCheckToken} />
                <Button text="탈퇴하기" color="red" flex={1} onClick={handleWithdraw} />
                <Button text="나가기" color="default" flex={2} onClick={() => navigate('/')} />
            </div>
        </div>
    )
}

export default WithDrawPage
