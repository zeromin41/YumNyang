import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import ProfileCircle from '../assets/user-profile-circle.svg';
import { getRequest } from '../apis/api'; 

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userNickname, setUserNickname] = useState('');

  const fetchUserNickname = useCallback(async (userId) => {
    try {
      const data = await getRequest(`/getUserNickname/${userId}`);
      if (data && data.nickname && data.nickname.NICKNAME) {
        return data.nickname.NICKNAME;
      }
      console.warn('API response for nickname is not in expected format:', data);
      return null;
    } catch (error) {
      console.error('Failed to fetch nickname in Header component:', error.message);
      return null;
    }
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');

    if (storedUserId) {
      setIsLoggedIn(true);
      const storedUserNickname = localStorage.getItem('userNickname');

      if (storedUserNickname) {
        setUserNickname(storedUserNickname);
      } else {
        fetchUserNickname(storedUserId).then(nicknameFromApi => {
          if (nicknameFromApi) {
            setUserNickname(nicknameFromApi);
            localStorage.setItem('userNickname', nicknameFromApi);
          } else {
            setUserNickname('사용자');
          }
        });
      }
    } else {
      setIsLoggedIn(false);
      setUserNickname('');
    }
  }, [fetchUserNickname]);

  const handleProfileAreaClick = () => {
    if (isLoggedIn) {
      navigate('/mypage');
    } else {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  };

  return (
    <header className={styles.headerContainer}>
      <Link to="/" className={styles.logoLink}>
        먹었냥🐾
      </Link>

      <div
        className={styles.profileIconContainer}
        onClick={handleProfileAreaClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleProfileAreaClick(); }}
        aria-label={isLoggedIn ? `${userNickname}님 마이페이지로 이동` : "로그인 페이지로 이동"}
      >
        {isLoggedIn ? (
          <span className={styles.nicknameText}>{userNickname} 님</span>
        ) : (
          <img
            src={ProfileCircle}
            alt="프로필 아이콘"
            className={styles.profileIcon}
          />
        )}
      </div>
    </header>
  );
};

export default Header;