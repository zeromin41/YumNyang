import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import css from './LoginPage.module.css'
import InputField from '../components/InputField'
import Button from '../components/Button'
import { isEmpty } from '../utils/validator'
import { VALIDATION_MESSAGES } from '../constants/messages'
import { login } from '../apis/auth'

const LoginPage = () => {
    const navigate = useNavigate()

    const [id, setId] = useState('')
    const [password, setPassword] = useState('')

    const [idError, setIdError] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const [isLoggingIn, setIsLoggingIn] = useState(false)

    const handleChange = (setter, errorSetter) => (e) => {
        setter(e.target.value)
        errorSetter('')
    }

    const handleLogin = async () => {
        // 검증
        const idValidationError = isEmpty(id) ? VALIDATION_MESSAGES.EMPTY_ID : ''
        const passwordValidationError = isEmpty(password) ? VALIDATION_MESSAGES.EMPTY_PASSWORD : ''

        setIdError(idValidationError)
        setPasswordError(passwordValidationError)

        if (idValidationError || passwordValidationError) return

        // 로그인
        try {
            const formData = {
                email: id,
                password,
            }
            setIsLoggingIn(true)
            const data = await login(formData)
            const userId = data.number
            if (userId) localStorage.setItem('userId', userId)

            setIdError('')
            setPasswordError('')
            setIsLoggingIn(false)

            navigate('/')
        } catch (err) {
            setPasswordError(err.message)
            setIsLoggingIn(false)
        }
    }
    return (
        <div className={css.loginCon}>
            <form onSubmit={(e) => e.preventDefault()} className={css.loginForm}>
                <InputField
                    label="아이디"
                    id="id"
                    value={id}
                    onChange={handleChange(setId, setIdError)}
                    errorMsg={idError}
                />
                <InputField
                    label="비밀번호"
                    id="password"
                    type="password"
                    value={password}
                    onChange={handleChange(setPassword, setPasswordError)}
                    errorMsg={passwordError}
                />
            </form>
            <div className={css.signUpPrompt}>
                <p>회원이 아니신가요?</p>
                <Link to={'/signup'}>회원가입 하기</Link>
            </div>
            <div className={css.btnWrapper}>
                <Button
                    text={isLoggingIn ? '로그인 중...' : '로그인'}
                    flex={2}
                    onClick={handleLogin}
                />
                <Button text="나가기" color="default" flex={1} onClick={() => navigate('/')} />
            </div>
        </div>
    )
}

export default LoginPage
