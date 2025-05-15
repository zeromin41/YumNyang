import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import styles from './Header.module.css'
import ProfileCircle from '../assets/user-profile-circle.svg'

const Header = () => {
    const navigate = useNavigate()
    const location = useLocation()

    // 프로필 아이콘 클릭 시 실행될 함수
    const handleProfileClick = () => {
        alert('로그인이 필요합니다.') // 알림 메시지
        navigate('/login') // 로그인 페이지로 이동
    }

    return (
        <header className={styles.headerContainer}>
            {location.pathname === '/mypage' ? (
                <Link to="/mypage" className={styles.logoLink}>
                    마이냥 🐾
                </Link>
            ) : (
                <Link to="/" className={styles.logoLink}>
                    먹었냥 🐾
                </Link>
            )}

            {/* 프로필 아이콘 영역 (클릭 가능) */}
            <div
                className={styles.profileIconContainer}
                onClick={handleProfileClick}
                role="button"
                aria-label="로그인 페이지로 이동"
            >
                {/* 사용자/프로필 아이콘 SVG */}
                <img src={ProfileCircle} alt="프로필 아이콘" className={styles.profileIcon} />
            </div>
        </header>
    )
}

export default Header
