import React, { useState } from 'react'
import css from './WithdrawPage.module.css'
import { useNavigate } from 'react-router-dom'
import InputField from '../components/InputField'
import Button from '../components/Button'
import { isEmpty, isValidPasswordConfirm } from '../utils/validator'
import { VALIDATION_MESSAGES } from '../constants/messages'
import { withdraw } from '../apis/auth'
import { logoutUser } from '../store/userSlice'
import { useDispatch } from 'react-redux'

const WithDrawPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [id, setId] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')

    const [idError, setIdError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [passwordConfirmError, setPasswordConfirmError] = useState('')

    const [isWithdrawing, setIsWithdrawing] = useState(false)

    const handleChange = (setter, errorSetter) => (e) => {
        setter(e.target.value)
        errorSetter('')
    }

    const handleWithdraw = async () => {
        // 검증
        const isIdValid = !isEmpty(id)
        const isPasswordValid = !isEmpty(password)
        const isPasswordConfirmValid = isValidPasswordConfirm(password, passwordConfirm)

        setIdError(isIdValid ? '' : VALIDATION_MESSAGES.EMPTY_ID)
        setPasswordError(isPasswordValid ? '' : VALIDATION_MESSAGES.EMPTY_PASSWORD)
        setPasswordConfirmError(isPasswordConfirmValid ? '' : VALIDATION_MESSAGES.PASSWORD_CONFIRM)

        if (!isIdValid || !isPasswordValid || !isPasswordConfirmValid) return

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
            setIsWithdrawing(true)
            const res = await withdraw(formData)
            alert(res.message)

            localStorage.removeItem('userId')
            dispatch(logoutUser())
            setIsWithdrawing(false)
            setIdError('')
            setPasswordError('')
            setPasswordConfirmError('')

            navigate('/')
        } catch (err) {
            setPasswordConfirmError(err.message)
            setIsWithdrawing(false)
        }
    }

    return (
        <div className={css.withdrawCon}>
            <form onSubmit={(e) => e.preventDefault()} className={css.withdrawForm}>
                <InputField
                    label="기존 아이디"
                    id="id"
                    value={id}
                    onChange={handleChange(setId, setIdError)}
                    errorMsg={idError}
                />
                <InputField
                    label="기존 비밀번호"
                    id="password"
                    value={password}
                    type="password"
                    onChange={handleChange(setPassword, setPasswordError)}
                    errorMsg={passwordError}
                />
                <InputField
                    label="비밀번호 재입력"
                    id="passwordConfirm"
                    value={passwordConfirm}
                    type="password"
                    onChange={handleChange(setPasswordConfirm, setPasswordConfirmError)}
                    errorMsg={passwordConfirmError}
                />
            </form>
            <div className={css.btnWrapper}>
                <Button
                    text={isWithdrawing ? '회원탈퇴 중...' : '탈퇴하기'}
                    color="red"
                    flex={1}
                    onClick={handleWithdraw}
                />
                <Button text="나가기" color="default" flex={2} onClick={() => navigate('/')} />
            </div>
        </div>
    )
}

export default WithDrawPage
