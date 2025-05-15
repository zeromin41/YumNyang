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

    const handleChange = (setter) => (e) => {
        setter(e.target.value)
    }

    const handleLogin = async () => {
        // 빈 값 검증
        setIdError(!isEmpty(id) ? '' : VALIDATION_MESSAGES.EMPTY_ID)
        setPasswordError(!isEmpty(password) ? '' : VALIDATION_MESSAGES.EMPTY_PASSWORD)
        if (idError || passwordError) return

        // 로그인
        try {
            const formData = {
                email: id,
                password,
            }
            const data = await login(formData)
            const userId = data.number
            if (userId) localStorage.setItem('userId', userId)

            setIdError('')
            setPasswordError('')
            navigate('/')
        } catch (err) {
            setPasswordError(err.message)
        }
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
