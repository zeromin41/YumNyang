// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer from './favoritesSlice';
// import authReducer from './authSlice'; 

export const store = configureStore({
    reducer: {
        favorites: favoritesReducer,
        // auth: authReducer, 
    },
});