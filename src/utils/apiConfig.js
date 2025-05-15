export const API_BASE_URL = 'https://seungwoo.i234.me:3333'

// 일반요청
export const API_REQUEST_OPTIONS = {
    withCredentials: true,
    headers: {
        Accept: 'application/json',
    },
}

// Content-Type이 application/json인 POST/PUT 요청
export const API_POST_REQUEST_OPTIONS = {
    withCredentials: true,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
}
