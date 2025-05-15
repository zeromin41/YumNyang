import axios from 'axios'
import { API_BASE_URL, API_POST_REQUEST_OPTIONS, API_REQUEST_OPTIONS } from '../utils/apiConfig'

export const postRequest = async (endpoint, data) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}${endpoint}`,
            data,
            API_POST_REQUEST_OPTIONS
        )
        return response.data
    } catch (error) {
        const message = error.response?.data?.message || error.response?.data?.error || '요청 실패'
        throw new Error(message)
    }
}
