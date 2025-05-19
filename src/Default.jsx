// src/Default.jsx (favoritesSlice를 위한 수정 예시)
import React, { useEffect, useState } from 'react'; // useState 추가
import Menu from './components/Menu';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import styles from './Default.module.css';

import { useDispatch, useSelector } from 'react-redux';
import { fetchUserFavorites, selectFavoritesStatus } from './store/favoritesSlice';

const Default = () => {
    const dispatch = useDispatch();
    const favoritesStatus = useSelector(selectFavoritesStatus);

    // --- localStorage에서 직접 로그인 상태 및 userId 가져오기 ---
    const [isLoggedInForFavorites, setIsLoggedInForFavorites] = useState(false);
    const [userIdForFavorites, setUserIdForFavorites] = useState(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setIsLoggedInForFavorites(true);
            setUserIdForFavorites(storedUserId);
        } else {
            setIsLoggedInForFavorites(false);
            setUserIdForFavorites(null);
        }
        // localStorage 변경 감지
        const handleStorageChange = () => {
            const storedUserId = localStorage.getItem('userId');
            if (storedUserId) {
                setIsLoggedInForFavorites(true);
                setUserIdForFavorites(storedUserId);
            } else {
                setIsLoggedInForFavorites(false);
                setUserIdForFavorites(null);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []); // 빈 배열: 마운트 시 한 번 실행

    // --- 찜 목록 로드 ---
    useEffect(() => {
        if (isLoggedInForFavorites && userIdForFavorites && favoritesStatus === 'idle') {
            dispatch(fetchUserFavorites(userIdForFavorites));
        }
    }, [isLoggedInForFavorites, userIdForFavorites, favoritesStatus, dispatch]);

    return (
        <>
            <Header />
            <div className={styles.pageContentWrapper}>
                <Outlet context={{ isLoggedIn: isLoggedInForFavorites, userId: userIdForFavorites }} />
            </div>
            <Menu />
        </>
    );
};

export default Default;