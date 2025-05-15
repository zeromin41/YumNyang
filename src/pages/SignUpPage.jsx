import React, { useState } from 'react'
import InputField from '../components/InputField'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'
import css from './SignUpPage.module.css'
import DropDown from '../components/DropDown'
import { PET_TYPE_OPTIONS } from '../constants/options'
import {
    isEmpty,
    isValidId,
    isValidNickname,
    isValidPassword,
    isValidPasswordConfirm,
} from '../utils/validator'
import { VALIDATION_MESSAGES } from '../constants/messages'
import { checkId, checkNickname, signUp } from '../apis/auth'
import {
    initialErrorState,
    initialFormState,
    initialSuccessState,
} from '../constants/initialStates'

const SignupPage = () => {
    const navigate = useNavigate()

    const [form, setForm] = useState(initialFormState)
    const [errors, setErrors] = useState(initialErrorState)
    const [success, setSuccess] = useState(initialSuccessState)

    const [isIdChecked, setIsIdChecked] = useState(false)
    const [isNicknameChecked, setIsNicknameChecked] = useState(false)

    const [generalError, setGeneralError] = useState('')

    const handleChange = (key) => (e) => {
        setForm({ ...form, [key]: e.target.value })
        setSuccess((prev) => ({ ...prev, [key]: '' }))
        if (key === 'id') setIsIdChecked(false)
        if (key === 'nickname') setIsNicknameChecked(false)
    }

    const handleValidation = (key, validator, message) => {
        if (isEmpty(form[key])) return setErrors((prev) => ({ ...prev, [key]: '' }))
        setErrors((prev) => ({
            ...prev,
            [key]: validator(form[key]) ? '' : message,
        }))
    }

    const handleCheckId = async () => {
        try {
            const data = await checkId(form.id)
            setSuccess((prev) => ({ ...prev, id: data.message }))
            setErrors((prev) => ({ ...prev, id: '' }))
            setIsIdChecked(true)
        } catch (err) {
            setErrors((prev) => ({ ...prev, id: err.message }))
        }
    }

    const handleCheckNickname = async () => {
        try {
            const data = await checkNickname(form.nickname)
            setSuccess((prev) => ({ ...prev, nickname: data.message }))
            setErrors((prev) => ({ ...prev, nickname: '' }))
            setIsNicknameChecked(true)
        } catch (err) {
            setErrors((prev) => ({ ...prev, nickname: err.message }))
        }
    }

    const handleSignUp = async () => {
        // 빈 값 검증
        const newErrors = {}

        if (isEmpty(form.id)) newErrors.id = VALIDATION_MESSAGES.EMPTY_ID
        else if (!isValidId(form.id)) newErrors.id = VALIDATION_MESSAGES.ID
        else if (!isIdChecked) newErrors.id = '아이디 중복확인을 해주세요.'

        if (isEmpty(form.nickname)) newErrors.nickname = VALIDATION_MESSAGES.EMPTY_NICKNAME
        else if (!isValidNickname(form.nickname)) newErrors.nickname = VALIDATION_MESSAGES.NICKNAME
        else if (!isNicknameChecked) newErrors.nickname = '닉네임 중복확인을 해주세요.'

        if (isEmpty(form.password)) newErrors.password = VALIDATION_MESSAGES.EMPTY_PASSWORD
        else if (!isValidPassword(form.password)) newErrors.password = VALIDATION_MESSAGES.PASSWORD

        if (!isValidPasswordConfirm(form.password, form.passwordConfirm)) {
            newErrors.passwordConfirm = VALIDATION_MESSAGES.PASSWORD_CONFIRM
        }

        // 반려동물 필드가 하나라도 채워져있는 경우 검증 (타입, 이름 필수)
        const petTypeFilled = !isEmpty(form.petType)
        const petNameFilled = !isEmpty(form.petName)
        const petAgeFilled = !isEmpty(form.petAge)

        if (petTypeFilled || petNameFilled || petAgeFilled) {
            if (!petTypeFilled) newErrors.petType = VALIDATION_MESSAGES.EMPTY_PET_TYPE
            if (!petNameFilled) newErrors.petName = VALIDATION_MESSAGES.EMPTY_PET_NAME
        }

        setErrors(newErrors)
        if (Object.values(newErrors).some(Boolean)) return

        // 회원가입
        try {
            const formData = {
                email: form.id,
                nickname: form.nickname,
                password: form.password,
                name: form.petName,
                type: form.petType,
                age: form.petAge,
            }
            await signUp(formData)
            setGeneralError('')
            setErrors(initialErrorState)
            setSuccess(initialSuccessState)
            navigate('/login')
        } catch (err) {
            setGeneralError(err.message)
            setErrors(initialErrorState)
            setSuccess(initialSuccessState)
        }
    }

    return (
        <div className={css.signUpCon}>
            <form onSubmit={(e) => e.preventDefault()} className={css.signUpForm}>
                <InputField
                    label="아이디"
                    id="id"
                    value={form.id}
                    onChange={handleChange('id')}
                    onKeyDown={() => handleValidation('id', isValidId, VALIDATION_MESSAGES.ID)}
                    onKeyUp={() => handleValidation('id', isValidId, VALIDATION_MESSAGES.ID)}
                    errorMsg={errors.id}
                    successMsg={success.id}
                    rightElement={
                        <Button
                            text="중복확인"
                            size="sm"
                            onClick={handleCheckId}
                            disabled={isEmpty(form.id) || !isValidId(form.id) || isIdChecked}
                        />
                    }
                />
                <InputField
                    label="닉네임"
                    id="nickname"
                    value={form.nickname}
                    onChange={handleChange('nickname')}
                    onKeyUp={() =>
                        handleValidation('nickname', isValidNickname, VALIDATION_MESSAGES.NICKNAME)
                    }
                    errorMsg={errors.nickname}
                    successMsg={success.nickname}
                    rightElement={
                        <Button
                            text="중복확인"
                            size="sm"
                            onClick={handleCheckNickname}
                            disabled={
                                isEmpty(form.nickname) ||
                                !isValidNickname(form.nickname) ||
                                isNicknameChecked
                            }
                        />
                    }
                />
                <InputField
                    label="비밀번호"
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange('password')}
                    onKeyUp={() =>
                        handleValidation('password', isValidPassword, VALIDATION_MESSAGES.PASSWORD)
                    }
                    errorMsg={errors.password}
                />
                <InputField
                    label="비밀번호 확인"
                    id="passwordConfirm"
                    type="password"
                    value={form.passwordConfirm}
                    onChange={handleChange('passwordConfirm')}
                    onKeyUp={() =>
                        handleValidation(
                            'passwordConfirm',
                            (value) => isValidPasswordConfirm(form.password, value),
                            VALIDATION_MESSAGES.PASSWORD_CONFIRM
                        )
                    }
                    errorMsg={errors.passwordConfirm}
                />
                <div className={css.petTypeField}>
                    <label>반려동물 종</label>
                    <DropDown
                        placeholder="종류 선택"
                        options={PET_TYPE_OPTIONS}
                        onSelect={(selectedOption) =>
                            setForm({ ...form, petType: selectedOption.value })
                        }
                    />
                    {errors.petType && <span className={css.error}>{errors.petType}</span>}
                </div>
                <InputField
                    label="반려동물 이름"
                    id="petName"
                    value={form.petName}
                    onChange={handleChange('petName')}
                    errorMsg={errors.petName}
                />
                <InputField
                    label="반려동물 나이"
                    id="petAge"
                    type="number"
                    value={form.petAge}
                    onChange={handleChange('petAge')}
                    errorMsg={errors.petAge}
                />
            </form>
            <div className={css.btnWrapper}>
                <Button text="가입하기" flex={2} onClick={handleSignUp} />
                <Button text="나가기" color="default" flex={1} onClick={() => navigate('/')} />
            </div>
            {generalError && <span className={css.error}>{generalError}</span>}
        </div>
    )
}

export default SignupPage
