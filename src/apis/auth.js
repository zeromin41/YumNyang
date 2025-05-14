import axios from 'axios'
import { API_BASE_URL, API_POST_REQUEST_OPTIONS } from '../utils/apiConfig'
import { Form } from 'react-router-dom'

export const checkId = async (id) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/checkId`,
            { email: id },
            API_POST_REQUEST_OPTIONS
        )
        return response.data
    } catch (error) {
        throw new Error('아이디 중복 체크 실패')
    }
}

export const checkNickname = async (nickname) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/checkNickname`,
            { nickname },
            API_POST_REQUEST_OPTIONS
        )
        return response.data
    } catch (error) {
        throw new Error('닉네임 중복 체크 실패')
    }
}

export const signUp = async (formData) => {
    console.log(formData)
    try {
        const response = await axios.post(
            `${API_BASE_URL}/signUp`,
            formData,
            API_POST_REQUEST_OPTIONS
        )
        return response.data
    } catch (error) {
        throw new Error(error.response.data.error)
    }
}
