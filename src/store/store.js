// src/store/store.js
import { configureStore } from '@reduxjs/toolkit'
import favoritesReducer from './favoritesSlice'
import userReducer from './userSlice'

export const store = configureStore({
    reducer: {
        favorites: favoritesReducer,
        user: userReducer,
    },
})
