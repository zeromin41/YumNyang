import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from './Header.module.css';
import profileCircleUrl from '../assets/user-profile-circle.svg';
import { getRequest } from '../apis/api';
import Spinner from './Spinner';  

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation(); 

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userNickname, setUserNickname] = useState('');
  const [isLoadingNickname, setIsLoadingNickname] = useState(false);

  // 사용자 닉네임을 가져오는 API 호출 함수
  const fetchUserNickname = useCallback(async (userId) => {
    setIsLoadingNickname(true); // 닉네임 요청 시작
    try {
      const data = await getRequest(`/getUserNickname/${userId}`);
      if (data && data.nickname && data.nickname.NICKNAME) {
        return data.nickname.NICKNAME;
      }
      console.warn('API 응답 형식이 예상과 다릅니다 (닉네임):', data);
      return null;
    } catch (error) {
      console.error('Header 컴포넌트에서 닉네임 조회 실패:', error.message);
      return null;
    } finally {
      setIsLoadingNickname(false); 
    }
  }, []); // 의존성 배열이 비어있으므로 컴포넌트 마운트 시 한 번만 생성

  // 로그인 상태 및 닉네임 설정 Effect
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');

    if (storedUserId) {
      setIsLoggedIn(true);
      fetchUserNickname(storedUserId).then(nicknameFromApi => {
        if (nicknameFromApi) {
          setUserNickname(nicknameFromApi);
        } else {
          setUserNickname('사용자'); // API 조회 실패 또는 닉네임 없을 시 기본값
        }
      });
    } else {
      setIsLoggedIn(false);
      setUserNickname(''); // 로그아웃 상태면 닉네임 초기화
    }
  }, [fetchUserNickname]); // fetchUserNickname 함수가 변경될 때만 

  // 프로필 영역 클릭 핸들러
  const handleProfileAreaClick = () => {
    if (isLoggedIn) {
      navigate('/mypage');
    } else {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  };

  // 프로필 아이콘 또는 닉네임 부분을 렌더링하는 함수
  const renderProfileContent = () => {
    if (!isLoggedIn) {
      return (
        <img
          src={profileCircleUrl}
          alt="프로필 아이콘"
          className={styles.profileIcon}
        />
      );
    }
    // 로그인 상태이지만 닉네임 로딩 중일 때
    if (isLoadingNickname) {
      return <Spinner />;
    }
    // 로그인 상태이고 닉네임 로딩 완료
    return <span className={styles.nicknameText}>{userNickname} 님</span>;
  };

  return (
    <header className={styles.headerContainer}>
      <Link to={location.pathname === '/mypage' ? "/mypage" : "/"} className={styles.logoLink}>
        {location.pathname === '/mypage' ? '마이냥 🐾' : '먹었냥 🐾'}
      </Link>

      <div
        className={styles.profileIconContainer}
        onClick={handleProfileAreaClick}
        role="button" 
        tabIndex={0} 
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleProfileAreaClick(); }} 
        aria-label={isLoggedIn ? `${userNickname}님 마이페이지로 이동` : "로그인 페이지로 이동"} 
      >
        {renderProfileContent()}
      </div>
    </header>
  );
};

export default Header;