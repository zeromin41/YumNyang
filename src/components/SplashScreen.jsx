import React from 'react';
import styles from './SplashScreen.module.css';
import logoImage from '../assets/고양이정면책.png';


const SplashScreen = () => {
    return (
        <div className={styles.splashScreen}> 
            <div className={styles.splashContent}> 
                <img
                    src={logoImage} 
                    alt="먹었냥 로고"
                    className={styles.splashLogo} 
                />
                <h1 className={styles.title}>먹었냥🐾</h1>
            </div>
        </div>
    )
}

export default SplashScreen;