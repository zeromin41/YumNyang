import axios from 'axios'
import { API_BASE_URL, API_REQUEST_OPTIONS, API_POST_REQUEST_OPTIONS } from '../utils/apiConfig'

export const getRequest = async (endpoint, params = {}) => {
    try {
        const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
            ...API_REQUEST_OPTIONS,
            params: params,
        })
        return response.data
    } catch (error) {
        const message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            'GET 요청 처리 중 오류가 발생했습니다.'
        console.error(
            `GET ${API_BASE_URL}${endpoint} Error:`,
            error.response?.data || error.message
        )
        throw new Error(message)
    }
}

export const postRequest = async (endpoint, data) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}${endpoint}`,
            data,
            API_POST_REQUEST_OPTIONS
        )
        return response.data
    } catch (error) {
        const status = error.response?.status
        const message = error.response?.data?.message || error.response?.data?.error || '요청 실패'
        const customError = new Error(message)
        customError.status = status
        throw customError
    }
}
