import React, { useState } from 'react'
import InputField from '../components/InputField'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'
import css from './SignUpPage.module.css'
import DropDown from '../components/DropDown'
import { PET_TYPE_OPTIONS } from '../constants/options'
import {
    isValidId,
    isValidNickname,
    isValidPassword,
    isValidPasswordConfirm,
} from '../utils/validator'
import { VALIDATION_MESSAGES } from '../constants/messages'

const SignupPage = () => {
    const navigate = useNavigate()

    const [id, setId] = useState('')
    const [nickname, setNickname] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [petType, setPetType] = useState('')
    const [petName, setPetName] = useState('')
    const [petAge, setPetAge] = useState('')

    const [idError, setIdError] = useState('')
    const [nicknameError, setNicknameError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [passwordConfirmError, setPasswordConfirmError] = useState('')

    const handleChange = (setter) => (e) => {
        setter(e.target.value)
    }

    const handleError = (value, validator, errorSetter, validationMessage) => {
        if (value === '') {
            errorSetter('')
            return
        }
        const error = validator(value) ? '' : validationMessage
        errorSetter(error)
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
                    onKeyUp={() => handleError(id, isValidId, setIdError, VALIDATION_MESSAGES.ID)}
                    errorMsg={idError}
                    rightElement={<Button text="중복확인" size="sm" />}
                />
                <InputField
                    label="닉네임"
                    id="nickname"
                    value={nickname}
                    onChange={handleChange(setNickname)}
                    onKeyUp={() =>
                        handleError(
                            nickname,
                            isValidNickname,
                            setNicknameError,
                            VALIDATION_MESSAGES.NICKNAME
                        )
                    }
                    errorMsg={nicknameError}
                    rightElement={<Button text="중복확인" size="sm" />}
                />
                <InputField
                    label="비밀번호"
                    id="password"
                    type="password"
                    value={password}
                    onKeyUp={() =>
                        handleError(
                            password,
                            isValidPassword,
                            setPasswordError,
                            VALIDATION_MESSAGES.PASSWORD
                        )
                    }
                    onChange={handleChange(setPassword)}
                    errorMsg={passwordError}
                />
                <InputField
                    label="비밀번호 확인"
                    id="passwordConfirm"
                    type="password"
                    value={passwordConfirm}
                    onKeyUp={() =>
                        handleError(
                            passwordConfirm,
                            (value) => isValidPasswordConfirm(password, value),
                            setPasswordConfirmError,
                            VALIDATION_MESSAGES.PASSWORD_CONFIRM
                        )
                    }
                    onChange={handleChange(setPasswordConfirm)}
                    errorMsg={passwordConfirmError}
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
                    type="number"
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
