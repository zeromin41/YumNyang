import React, { useState } from 'react'
import InputField from '../components/InputField'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'
import css from './SignUpPage.module.css'
import DropDown from '../components/DropDown'
import { PET_TYPE_OPTIONS } from '../constants/options'

const SignupPage = () => {
    const navigate = useNavigate()

    const [id, setId] = useState('')
    const [nickname, setNickname] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [petType, setPetType] = useState('')
    const [petName, setPetName] = useState('')
    const [petAge, setPetAge] = useState('')

    const handleChange = (setter) => (e) => {
        setter(e.target.value)
    }

    const handleSignUp = () => {
        // 회원가입 로직...
    }
    return (
        <div className={css.signUpCon}>
            <form onSubmit={(e) => e.preventDefault()} className={css.signUpForm}>
                <InputField
                    label="아이디"
                    id="id"
                    value={id}
                    onChange={handleChange(setId)}
                    rightElement={<Button text="중복확인" size="sm" />}
                />
                <InputField
                    label="닉네임"
                    id="nickname"
                    value={nickname}
                    onChange={handleChange(setNickname)}
                    rightElement={<Button text="중복확인" size="sm" />}
                />
                <InputField
                    label="비밀번호"
                    id="password"
                    value={password}
                    onChange={handleChange(setPassword)}
                />
                <InputField
                    label="비밀번호 확인"
                    id="passwordConfirm"
                    value={passwordConfirm}
                    onChange={handleChange(setPasswordConfirm)}
                />
                <div className={css.petTypeField}>
                    <label>반려동물 종</label>
                    <DropDown
                        placeholder="종류 선택"
                        options={PET_TYPE_OPTIONS}
                        onSelect={(selectedOption) => setPetType(selectedOption.value)}
                    />
                </div>
                <InputField
                    label="반려동물 이름"
                    id="petName"
                    value={petName}
                    onChange={handleChange(setPetName)}
                />
                <InputField
                    label="반려동물 나이"
                    id="petAge"
                    value={petAge}
                    onChange={handleChange(setPetAge)}
                />
            </form>
            <div className={css.btnWrapper}>
                <Button text="가입하기" flex={2} onClick={handleSignUp} />
                <Button text="나가기" color="default" flex={1} onClick={() => navigate('/')} />
            </div>
        </div>
    )
}

export default SignupPage
