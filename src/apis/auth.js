import axios from 'axios'
import { API_BASE_URL, API_POST_REQUEST_OPTIONS } from '../utils/apiConfig'

export const checkId = async (id) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/checkId`,
            { email: id },
            API_POST_REQUEST_OPTIONS
        )
        return response.data
    } catch (error) {
        throw new Error('ID 중복 체크 실패')
    }
}
