import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import css from './LoginPage.module.css'
import InputField from '../components/InputField'
import Button from '../components/Button'
import { isEmpty } from '../utils/validator'
import { VALIDATION_MESSAGES } from '../constants/messages'

const LoginPage = () => {
    const navigate = useNavigate()

    const [id, setId] = useState('')
    const [password, setPassword] = useState('')

    const [idError, setIdError] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const handleChange = (setter) => (e) => {
        setter(e.target.value)
    }

    const handleError = (value, validator, errorSetter, validationMessage) => {
        const error = validator(value) ? '' : validationMessage
        errorSetter(error)
    }

    const handleLogin = () => {
        // 빈 값 검증
        handleError(id, (v) => !isEmpty(v), setIdError, VALIDATION_MESSAGES.EMPTY_ID)
        handleError(
            password,
            (v) => !isEmpty(v),
            setPasswordError,
            VALIDATION_MESSAGES.EMPTY_PASSWORD
        )

        // 로그인 로직...
    }
    return (
        <div className={css.loginCon}>
            <form onSubmit={(e) => e.preventDefault()} className={css.loginForm}>
                <InputField
                    label="아이디"
                    id="id"
                    value={id}
                    onChange={handleChange(setId)}
                    errorMsg={idError}
                />
                <InputField
                    label="비밀번호"
                    id="password"
                    type="password"
                    value={password}
                    onChange={handleChange(setPassword)}
                    errorMsg={passwordError}
                />
            </form>
            <div className={css.signUpPrompt}>
                <p>회원이 아니신가요?</p>
                <Link to={'/signup'}>회원가입 하기</Link>
            </div>
            <div className={css.btnWrapper}>
                <Button text="로그인" flex={2} onClick={handleLogin} />
                <Button text="나가기" color="default" flex={1} onClick={() => navigate('/')} />
            </div>
        </div>
    )
}

export default LoginPage
