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
import { checkId } from '../apis/auth'

const SignupPage = () => {
    const navigate = useNavigate()

    const [form, setForm] = useState({
        id: '',
        nickname: '',
        password: '',
        passwordConfirm: '',
        petType: '',
        petName: '',
        petAge: '',
    })

    const [errors, setErrors] = useState({
        id: '',
        nickname: '',
        password: '',
        passwordConfirm: '',
        petType: '',
        petName: '',
        petAge: '',
    })

    const [success, setSuccess] = useState({
        id: '',
        nickname: '',
        password: '',
        passwordConfirm: '',
    })

    const [isIdChecked, setIsIdChecked] = useState(false)

    const handleChange = (key) => (e) => {
        setForm({ ...form, [key]: e.target.value })
        setSuccess((prev) => ({ ...prev, [key]: '' }))
        setIsIdChecked(false)
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

    const handleSignUp = () => {
        // 빈 값 검증
        const newErrors = {}

        if (isEmpty(form.id)) newErrors.id = VALIDATION_MESSAGES.EMPTY_ID
        else if (!isValidId(form.id)) newErrors.id = VALIDATION_MESSAGES.ID
        else if (!isIdChecked) newErrors.id = '아이디 중복확인을 해주세요.'

        if (isEmpty(form.nickname)) newErrors.nickname = VALIDATION_MESSAGES.EMPTY_NICKNAME
        else if (!isValidNickname(form.nickname)) newErrors.nickname = VALIDATION_MESSAGES.NICKNAME

        if (isEmpty(form.password)) newErrors.password = VALIDATION_MESSAGES.EMPTY_PASSWORD
        else if (!isValidPassword(form.password)) newErrors.password = VALIDATION_MESSAGES.PASSWORD

        if (!isValidPasswordConfirm(form.password, form.passwordConfirm)) {
            newErrors.passwordConfirm = VALIDATION_MESSAGES.PASSWORD_CONFIRM
        }

        // 반려동물 필드에 하나라도 채워져있는 경우 나머지 빈 값 검증
        const petFieldsFilled = [form.petType, form.petName, form.petAge].some((v) => !isEmpty(v))
        if (petFieldsFilled) {
            if (isEmpty(form.petType)) newErrors.petType = VALIDATION_MESSAGES.EMPTY_PET_TYPE
            if (isEmpty(form.petName)) newErrors.petName = VALIDATION_MESSAGES.EMPTY_PET_NAME
            if (isEmpty(form.petAge)) newErrors.petAge = VALIDATION_MESSAGES.EMPTY_PET_AGE
        } else {
            newErrors.petType = ''
            newErrors.petName = ''
            newErrors.petAge = ''
        }

        setErrors({ ...errors, ...newErrors })
        if (Object.values(newErrors).some(Boolean)) return

        // 회원가입 로직...
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
                            disabled={isEmpty(form.id) || !isValidId(form.id)}
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
                    rightElement={<Button text="중복확인" size="sm" />}
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
                    {errors.petType && <p className={css.error}>{errors.petType}</p>}
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
        </div>
    )
}

export default SignupPage
