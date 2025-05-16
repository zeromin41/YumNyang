// src/store/favoritesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// api.js 파일의 올바른 상대 경로로 수정
import { getRequest, postRequest } from '../apis/api';

// 비동기 Thunks 정의
// 사용자의 전체 즐겨찾기 목록을 가져오는 Thunk
export const fetchUserFavorites = createAsyncThunk(
    'favorites/fetchUserFavorites',
    async (userId, { rejectWithValue }) => {
        try {
            const data = await getRequest(`/getFavorites/${userId}`);
            return data && data.favorites ? data.favorites : [];
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch favorites';
            return rejectWithValue(errorMessage);
        }
    }
);

// 즐겨찾기에 레시피를 추가하는 Thunk
export const addFavoriteToServer = createAsyncThunk(
    'favorites/addFavoriteToServer',
    async ({ userId, recipeId }, { dispatch, rejectWithValue }) => {
        try {
            await postRequest('/addFavorites', {
                userId: parseInt(userId),
                recipeId: parseInt(recipeId),
            });
            await dispatch(fetchUserFavorites(String(userId))); // 성공 후 목록 갱신
            return { recipeId: String(recipeId) };
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to add favorite';
            return rejectWithValue(errorMessage);
        }
    }
);

// 즐겨찾기에서 레시피를 제거하는 Thunk
export const removeFavoriteFromServer = createAsyncThunk(
    'favorites/removeFavoriteFromServer',
    async ({ favoriteEntryId, userId }, { dispatch, rejectWithValue }) => {
        try {
            await getRequest(`/removeFavorites/${favoriteEntryId}`);
            await dispatch(fetchUserFavorites(String(userId))); // 성공 후 목록 갱신
            return { favoriteEntryId };
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to remove favorite';
            return rejectWithValue(errorMessage);
        }
    }
);

const initialState = {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserFavorites.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchUserFavorites.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchUserFavorites.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(addFavoriteToServer.pending, (state) => {
                state.status = 'loading'; // 전체 상태를 loading으로 할 수도 있고, 개별 아이템 로딩 상태를 관리할 수도 있습니다.
                state.error = null;
            })
            .addCase(addFavoriteToServer.fulfilled, (state) => {
                // 목록이 fetchUserFavorites를 통해 갱신되므로 여기서는 status만 변경
                state.status = 'succeeded';
            })
            .addCase(addFavoriteToServer.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(removeFavoriteFromServer.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(removeFavoriteFromServer.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(removeFavoriteFromServer.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const selectAllFavorites = (state) => state.favorites.items;
export const selectIsFavoriteByRecipeId = (state, recipeId) =>
    state.favorites.items.some(fav => String(fav.RECIPE_ID) === String(recipeId));
export const selectFavoriteEntryByRecipeId = (state, recipeId) =>
    state.favorites.items.find(fav => String(fav.RECIPE_ID) === String(recipeId));
export const selectFavoritesStatus = (state) => state.favorites.status;
export const selectFavoritesError = (state) => state.favorites.error;

export default favoritesSlice.reducer;