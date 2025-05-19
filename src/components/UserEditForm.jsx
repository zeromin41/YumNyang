import React, { useState, useEffect } from 'react'
import Input from '../components/Input'
import Button from '../components/Button'
import DropDown from '../components/DropDown'
import { PET_TYPE_OPTIONS } from '../constants/options'
import {
    isEmpty,
    isValidNickname,
    isValidPassword,
    isValidPasswordConfirm,
} from '../utils/validator'
import { VALIDATION_MESSAGES } from '../constants/messages'
import { checkNickname } from '../apis/auth'
import css from './UserEditForm.module.css'
import { updateMyInfo } from '../apis/myPage'

const UserEditForm = ({ userId, nickname, petInfo, onUpdate, onClose }) => {
    const [form, setForm] = useState({
        nickname: '',
        password: '',
        passwordConfirm: '',
        petType: '',
        petName: '',
        petAge: '',
    })
    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState({})
    const [isNicknameChecked, setIsNicknameChecked] = useState(false)
    const [generalError, setGeneralError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (nickname) {
            setForm((prev) => ({
                ...prev,
                nickname,
            }))
            setIsNicknameChecked(true)
        }
        if (petInfo) {
            setForm((prev) => ({
                ...prev,
                petType: petInfo.TYPE || '',
                petName: petInfo.NAME || '',
                petAge: petInfo.AGE || '',
            }))
        }
    }, [nickname, petInfo])

    const handleChange = (key) => (e) => {
        setForm({ ...form, [key]: e.target.value })
        setSuccess((prev) => ({ ...prev, [key]: '' }))
        if (key === 'nickname') setIsNicknameChecked(false)
    }

    const handleValidation = (key, validator, message) => {
        if (isEmpty(form[key])) return setErrors((prev) => ({ ...prev, [key]: '' }))
        setErrors((prev) => ({
            ...prev,
            [key]: validator(form[key]) ? '' : message,
        }))
    }

    const handleCheckNickname = async () => {
        try {
            const data = await checkNickname(form.nickname)
            setSuccess((prev) => ({ ...prev, nickname: data.message }))
            setErrors((prev) => ({ ...prev, nickname: '' }))
            setIsNicknameChecked(true)
        } catch (err) {
            setErrors((prev) => ({ ...prev, nickname: err.message }))
            setIsNicknameChecked(false)
        }
    }

    const validate = () => {
        const newErrors = {}

        // 닉네임 검증
        if (isEmpty(form.nickname)) newErrors.nickname = VALIDATION_MESSAGES.EMPTY_NICKNAME
        else if (!isValidNickname(form.nickname)) newErrors.nickname = VALIDATION_MESSAGES.NICKNAME
        else if (!isNicknameChecked) newErrors.nickname = '닉네임 중복확인을 해주세요.'

        // 비밀번호 검증
        if (form.password || form.passwordConfirm) {
            if (isEmpty(form.password)) newErrors.password = VALIDATION_MESSAGES.EMPTY_PASSWORD
            else if (!isValidPassword(form.password))
                newErrors.password = VALIDATION_MESSAGES.PASSWORD

            if (!isValidPasswordConfirm(form.password, form.passwordConfirm))
                newErrors.passwordConfirm = VALIDATION_MESSAGES.PASSWORD_CONFIRM
        }

        // 반려동물 정보 검증
        const petTypeFilled = !isEmpty(form.petType)
        const petNameFilled = !isEmpty(form.petName)
        const petAgeFilled = !isEmpty(form.petAge)

        if (petTypeFilled || petNameFilled || petAgeFilled) {
            if (!petTypeFilled) newErrors.petType = VALIDATION_MESSAGES.EMPTY_PET_TYPE
            if (!petNameFilled) newErrors.petName = VALIDATION_MESSAGES.EMPTY_PET_NAME
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleEdit = async () => {
        if (!validate()) return
        setIsSubmitting(true)

        try {
            await updateMyInfo(
                {
                    id: userId,
                    nickname: form.nickname,
                    password: form.password,
                },
                {
                    id: petInfo.ID,
                    userId,
                    type: form.petType,
                    name: form.petName,
                    age: form.petAge === '' ? null : form.petAge,
                }
            )
            setIsSubmitting(false)
            onUpdate?.('정보가 성공적으로 수정되었습니다.', form.nickname)
            onClose?.()
        } catch (err) {
            setGeneralError(err.message || '수정 중 오류가 발생했습니다.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className={css.editFormCon}>
            <form onSubmit={(e) => e.preventDefault()} className={css.editForm}>
                <div className={css.editField}>
                    <label>닉네임</label>
                    <div className={css.editNicknameField}>
                        <Input
                            placeholder="닉네임 변경"
                            value={form.nickname}
                            onChange={handleChange('nickname')}
                            onKeyUp={() =>
                                handleValidation(
                                    'nickname',
                                    isValidNickname,
                                    VALIDATION_MESSAGES.NICKNAME
                                )
                            }
                        />
                        <div>
                            <Button
                                text="중복확인"
                                size="md"
                                color="accent"
                                onClick={handleCheckNickname}
                                disabled={
                                    isEmpty(form.nickname) ||
                                    !isValidNickname(form.nickname) ||
                                    isNicknameChecked
                                }
                            />
                        </div>
                    </div>
                    {errors.nickname && (
                        <span className={`${css.msg} ${css.error}`}>{errors.nickname}</span>
                    )}
                    {success.nickname && (
                        <span className={`${css.msg} ${css.success}`}>{success.nickname}</span>
                    )}
                </div>

                <div className={css.editField}>
                    <label>비밀번호</label>
                    <Input
                        placeholder="비밀번호 변경"
                        type="password"
                        value={form.password}
                        onChange={handleChange('password')}
                        onKeyUp={() =>
                            handleValidation(
                                'password',
                                isValidPassword,
                                VALIDATION_MESSAGES.PASSWORD
                            )
                        }
                    />
                    {errors.password && (
                        <span className={`${css.msg} ${css.error}`}>{errors.password}</span>
                    )}
                </div>

                <div className={css.editField}>
                    <label>비밀번호 확인</label>
                    <Input
                        placeholder="비밀번호 변경 확인"
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
                    />
                    {errors.passwordConfirm && (
                        <span className={`${css.msg} ${css.error}`}>{errors.passwordConfirm}</span>
                    )}
                </div>

                <div className={css.editField}>
                    <label>반려동물 종</label>
                    <DropDown
                        placeholder="종류 선택"
                        options={PET_TYPE_OPTIONS}
                        onSelect={(selected) => setForm({ ...form, petType: selected.value })}
                        value={form.petType}
                    />
                    {errors.petType && (
                        <span className={`${css.msg} ${css.error}`}>{errors.petType}</span>
                    )}
                </div>

                <div className={css.editField}>
                    <label>반려동물 이름</label>
                    <Input
                        placeholder="이름 입력"
                        value={form.petName}
                        onChange={handleChange('petName')}
                    />
                    {errors.petName && (
                        <span className={`${css.msg} ${css.error}`}>{errors.petName}</span>
                    )}
                </div>

                <div className={css.editField}>
                    <label>반려동물 나이</label>
                    <Input
                        placeholder="나이 입력"
                        type="number"
                        value={form.petAge}
                        onChange={handleChange('petAge')}
                    />
                    {errors.petAge && (
                        <span className={`${css.msg} ${css.error}`}>{errors.petAge}</span>
                    )}
                </div>
            </form>
            <div className={css.btnWrapper}>
                <Button
                    text={isSubmitting ? '저장 중...' : '저장'}
                    color="brown"
                    flex={2}
                    onClick={handleEdit}
                />
                <Button text="취소" color="sandBrown" flex={1} onClick={onClose} />
            </div>
            {generalError && <div className={`${css.msg} ${css.error}`}>{generalError}</div>}
        </div>
    )
}

export default UserEditForm
