import React, { useState } from 'react'
import css from './WithdrawPage.module.css'
import { useNavigate } from 'react-router-dom'
import InputField from '../components/InputField'
import Button from '../components/Button'

const WithDrawPage = () => {
    const navigate = useNavigate()

    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')

    const handleChange = (setter) => (e) => {
        setter(e.target.value)
    }

    const handleWithdraw = () => {
        // 회원탈퇴 로직...
    }

    return (
        <div className={css.withdrawCon}>
            <form onSubmit={(e) => e.preventDefault()} className={css.withdrawForm}>
                <InputField
                    label="기존 비밀번호"
                    id="password"
                    value={password}
                    onChange={handleChange(setPassword)}
                />
                <InputField
                    label="비밀번호 재입력"
                    id="passwordConfirm"
                    value={passwordConfirm}
                    onChange={handleChange(setPasswordConfirm)}
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
