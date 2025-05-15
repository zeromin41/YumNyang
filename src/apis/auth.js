import { postRequest } from './api'

export const checkId = (id) => postRequest('/checkId', { email: id })

export const checkNickname = (nickname) => postRequest('/checkNickname', { nickname })

export const signUp = (formData) => postRequest('/signUp', formData)

export const login = (formData) => postRequest('/login', formData)

export const withdraw = (formData) => postRequest('/withdraw', formData)
