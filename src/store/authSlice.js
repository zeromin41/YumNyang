//로그인도 리덕스로 하려했다가 실패 

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// // apis/auth.js 에서 login, fetchCheckToken, logout 함수를 import
// import {
//     login as apiLogin,
//     fetchCheckToken as apiFetchCheckToken,
//     logout as apiLogout // 새로 추가한 logout 함수 (또는 기존 함수)
// } from '../apis/auth';
// import { getRequest } from '../apis/api'; // getUserNickname 호출용

// const initialState = {
//     isLoggedIn: false,
//     userId: null,
//     userNickname: null,
//     token: null, // HTTPOnly 쿠키이므로 JS에서 직접 값 접근 불가, 여기선 null 유지
//     status: 'idle',
//     error: null,
// };

// // Thunk: 로그인 처리
// export const loginUser = createAsyncThunk(
//     'auth/loginUser',
//     async (credentials, { rejectWithValue, dispatch }) => {
//         try {
//             const loginResponse = await apiLogin(credentials);

//             const userId = loginResponse.data?.number;
//             if (!userId) {
//                 // 로그인 실패 시 서버 메시지를 사용하거나 기본 메시지 설정
//                 return rejectWithValue(loginResponse.data?.message || 'Login failed: Missing user ID in response.');
//             }

//             // 로그인 성공, userId 획득. 이제 닉네임을 가져옵니다.
//             let nickname = '사용자'; // 기본값
//             try {
//                 const nicknameResponse = await dispatch(fetchNicknameForUser(String(userId))).unwrap();
//                 nickname = nicknameResponse; // fetchNicknameForUser가 닉네임 문자열을 반환하도록 함
//             } catch (nickError) {
//                 console.warn('Failed to fetch nickname after login, using default.', nickError);
//                 // 닉네임 가져오기 실패해도 로그인은 성공한 것으로 처리 가능
//             }

//             localStorage.setItem('userId', String(userId));
//             localStorage.setItem('userNickname', nickname);
//             // HTTPOnly 쿠키이므로 token은 localStorage에 저장하지 않음

//             return { userId: String(userId), nickname, token: null }; // token은 null로 설정
//         } catch (error) {
//             // apiLogin 자체에서 발생한 네트워크 에러 또는 rejectWithValue로 온 에러
//             const message = error.response?.data?.message || error.message || 'Login failed';
//             return rejectWithValue(message);
//         }
//     }
// );

// // Thunk: 특정 userId에 대한 닉네임 가져오기 (loginUser 및 checkAuthStatus에서 사용)
// export const fetchNicknameForUser = createAsyncThunk(
//     'auth/fetchNicknameForUser',
//     async (userId, { rejectWithValue }) => {
//         try {
//             const response = await getRequest(`/getUserNickname/${userId}`);
//             // 백엔드 응답: { nickname: { NICKNAME: '실제닉네임' } }
//             if (response.data && response.data.nickname && response.data.nickname.NICKNAME) {
//                 return response.data.nickname.NICKNAME;
//             }
//             throw new Error('Nickname not found in response');
//         } catch (error) {
//             const message = error.response?.data?.message || error.message || 'Failed to fetch nickname';
//             return rejectWithValue(message);
//         }
//     }
// );

// // Thunk: 로그아웃 처리
// export const logoutUser = createAsyncThunk(
//     'auth/logoutUser',
//     async (_, { rejectWithValue }) => {
//         try {
//             await apiLogout(); // apis/auth.js의 logout 함수 호출
//             localStorage.removeItem('userId');
//             localStorage.removeItem('userNickname');
//             localStorage.removeItem('token'); // 혹시라도 있었다면 제거 (HttpOnly는 JS로 제거 불가, 서버가 처리)
//             return;
//         } catch (error) {
//             const message = error.response?.data?.message || error.message || 'Logout failed';
//             return rejectWithValue(message);
//         }
//     }
// );

// // Thunk: 앱 로드 시 인증 상태 확인
// export const checkAuthStatus = createAsyncThunk(
//     'auth/checkAuthStatus',
//     async (_, { rejectWithValue, dispatch }) => {
//         // HTTPOnly 쿠키는 브라우저가 자동으로 보내므로, 서버의 /checkToken이 쿠키를 읽어 검증
//         try {
//             const validationResponse = await apiFetchCheckToken(); // GET /checkToken 호출

//             // /checkToken 성공 응답: { authenticated: true, user: { email } }
//             if (validationResponse && validationResponse.authenticated && validationResponse.user?.email) {
//                 // 인증 성공. 이제 DB userId와 nickname을 가져와야 함.
//                 // localStorage에 저장된 userId를 우선 사용 (checkToken 응답에는 DB ID가 없음)
//                 const storedUserId = localStorage.getItem('userId');
//                 if (!storedUserId) {
//                     // checkToken은 성공했지만, userId가 로컬에 없으면 비정상 상태.
//                     // 이 경우, email로 userId를 찾는 API가 있다면 좋겠지만, 현재 없으므로 로그아웃 처리.
//                     throw new Error('User authenticated by token but local userId not found.');
//                 }

//                 let nickname = localStorage.getItem('userNickname');
//                 if (!nickname) { // 로컬에 닉네임 없으면 서버에서 가져오기
//                     try {
//                         const nicknameResponse = await dispatch(fetchNicknameForUser(storedUserId)).unwrap();
//                         nickname = nicknameResponse;
//                     } catch (nickError) {
//                         console.warn('Failed to fetch nickname during auth check, using default.', nickError);
//                         nickname = '사용자'; // 닉네임 가져오기 실패 시 기본값
//                     }
//                 }
                
//                 // localStorage에 닉네임 업데이트 (가져왔거나 기본값으로)
//                 localStorage.setItem('userNickname', nickname);

//                 return { userId: storedUserId, nickname, token: null }; // token은 null
//             }
//             // /checkToken이 authenticated: false를 반환하거나, 응답이 예상과 다르면 실패
//             throw new Error('Token validation failed or session expired.');

//         } catch (error) {
//             localStorage.removeItem('userId');
//             localStorage.removeItem('userNickname');
//             localStorage.removeItem('token');
//             const message = error.message || 'Session validation failed.';
//             return rejectWithValue(message);
//         }
//     }
// );


// const authSlice = createSlice({
//     name: 'auth',
//     initialState,
//     reducers: {
//         // 동기 액션 (필요시)
//     },
//     extraReducers: (builder) => {
//         builder
//             // loginUser
//             .addCase(loginUser.pending, (state) => {
//                 state.status = 'loading'; state.error = null;
//             })
//             .addCase(loginUser.fulfilled, (state, action) => {
//                 state.status = 'succeeded'; state.isLoggedIn = true;
//                 state.userId = action.payload.userId;
//                 state.userNickname = action.payload.nickname;
//                 state.token = action.payload.token; // 항상 null 또는 HttpOnly 표시자
//                 state.error = null;
//             })
//             .addCase(loginUser.rejected, (state, action) => {
//                 state.status = 'failed'; state.isLoggedIn = false; state.error = action.payload;
//                 state.userId = null; state.userNickname = null; state.token = null;
//             })
//             // logoutUser
//             .addCase(logoutUser.fulfilled, (state) => {
//                 Object.assign(state, initialState); // 상태를 초기값으로 리셋
//                 state.status = 'idle'; // 또는 'succeeded'
//             })
//             .addCase(logoutUser.rejected, (state, action) => {
//                 state.status = 'failed'; state.error = action.payload;
//                  // 로그아웃 실패 시에도 로컬 상태는 초기화하는 것이 좋을 수 있음
//                 Object.assign(state, initialState);
//                 state.status = 'failed'; // 에러 상태 명시
//             })
//             // checkAuthStatus
//             .addCase(checkAuthStatus.pending, (state) => {
//                 state.status = 'loading'; state.error = null;
//             })
//             .addCase(checkAuthStatus.fulfilled, (state, action) => {
//                 state.status = 'succeeded'; state.isLoggedIn = true;
//                 state.userId = action.payload.userId;
//                 state.userNickname = action.payload.nickname;
//                 state.token = action.payload.token; // 항상 null 또는 HttpOnly 표시자
//                 state.error = null;
//             })
//             .addCase(checkAuthStatus.rejected, (state, action) => {
//                 state.status = 'succeeded'; // 확인 작업 완료, 결과는 비로그인
//                 state.isLoggedIn = false; state.userId = null; state.userNickname = null; state.token = null;
//                 state.error = action.payload;
//             })
//             // fetchNicknameForUser (선택적: 로딩/에러 상태 관리)
//             .addCase(fetchNicknameForUser.pending, (state) => {
//                 // 닉네임 로딩 중 특정 상태 변경이 필요하면 여기에 추가
//             })
//             .addCase(fetchNicknameForUser.fulfilled, (state, action) => {
//                 // 만약 스토어의 userNickname을 여기서 직접 업데이트한다면 (현재는 Thunk 반환값 사용)
//                 // state.userNickname = action.payload;
//             })
//             .addCase(fetchNicknameForUser.rejected, (state, action) => {
//                 // 닉네임 가져오기 실패 시 에러 처리
//             });
//     },
// });

// // Selectors
// export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
// export const selectUserId = (state) => state.auth.userId;
// export const selectUserNickname = (state) => state.auth.userNickname;
// export const selectAuthToken = (state) => state.auth.token; // 사실상 사용되지 않거나 다른 의미로 사용될 수 있음
// export const selectAuthStatus = (state) => state.auth.status;
// export const selectAuthError = (state) => state.auth.error;

// export default authSlice.reducer;