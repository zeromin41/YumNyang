import React, { useState } from 'react'
import css from './WithdrawPage.module.css'
import { useNavigate } from 'react-router-dom'
import InputField from '../components/InputField'
import Button from '../components/Button'
import { isEmpty, isValidPasswordConfirm } from '../utils/validator'
import { VALIDATION_MESSAGES } from '../constants/messages'

const WithDrawPage = () => {
    const navigate = useNavigate()

    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')

    const [passwordError, setPasswordError] = useState('')
    const [passwordConfirmError, setPasswordConfirmError] = useState('')

    const handleChange = (setter) => (e) => {
        setter(e.target.value)
    }

    const handleError = (isValid, errorSetter, validationMessage) => {
        errorSetter(isValid ? '' : validationMessage)
    }

    const handleWithdraw = () => {
        // 빈 값 검증
        handleError(!isEmpty(password), setPasswordError, VALIDATION_MESSAGES.EMPTY_PASSWORD)
        // 비밀번호 일치 검증
        handleError(
            isValidPasswordConfirm(password, passwordConfirm),
            setPasswordConfirmError,
            VALIDATION_MESSAGES.PASSWORD_CONFIRM
        )
        // 회원탈퇴 로직...
    }

    return (
        <div className={css.withdrawCon}>
            <form onSubmit={(e) => e.preventDefault()} className={css.withdrawForm}>
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
                <Button text="탈퇴하기" color="red" flex={1} onClick={handleWithdraw} />
                <Button text="나가기" color="default" flex={2} onClick={() => navigate('/')} />
            </div>
        </div>
    )
}

export default WithDrawPage
