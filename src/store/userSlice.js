import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isLoggedIn: false,
    userId: null,
    nickname: '',
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            state.isLoggedIn = true
            state.userId = action.payload.userId
            state.nickname = action.payload.nickname
        },
        updateNickname(state, action) {
            state.nickname = action.payload
        },
        logout(state) {
            state.isLoggedIn = false
            state.userId = null
            state.nickname = ''
        },
    },
})

export const { setUser, updateNickname, logout } = userSlice.actions
export default userSlice.reducer
