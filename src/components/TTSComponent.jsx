import React, { useEffect, useState, useRef } from 'react'

import stopImg from '../assets/volume-07.svg'
// 전역 상태 관리를 위한 변수 (모든 컴포넌트가 공유)
let globalActiveButton = null

const TTSComponent = ({ text, children, btnkey, playBtnImg }) => {
    const [isActive, setIsActive] = useState(false)
    const utteranceRef = useRef(null)

    useEffect(() => {
        if (typeof SpeechSynthesisUtterance !== 'undefined') {
            utteranceRef.current = new SpeechSynthesisUtterance()
            utteranceRef.current.rate = 1 // 속도  : 0.1 ~ 10
            utteranceRef.current.pitch = 1 // 음높이 : 0 ~ 2
            utteranceRef.current.lang = 'ko-KR'
            utteranceRef.current.text = text

            // tts가 끝났을때
            utteranceRef.current.onend = () => {
                if (globalActiveButton === btnkey) {
                    globalActiveButton = null
                    setIsActive(false)
                }
            }
        }

        // 컴포넌트 언마운트 시 정리
        return () => {
            if (window.speechSynthesis && globalActiveButton === btnkey) {
                window.speechSynthesis.cancel()
                globalActiveButton = null
            }
        }
    }, [text, btnkey])

    // 다른 컴포넌트의 활성화 상태에 따라 이 컴포넌트의 상태 업데이트
    useEffect(() => {
        setIsActive(globalActiveButton === btnkey)
    }, [btnkey])

    const handleTTS = () => {
        if (
            typeof SpeechSynthesisUtterance === 'undefined' ||
            typeof window.speechSynthesis === 'undefined'
        ) {
            alert('이 브라우저는 TTS를 지원하지 않습니다')
            return
        }

        // 이미 활성화된 버튼이면 비활성화
        if (isActive) {
            window.speechSynthesis.cancel()
            globalActiveButton = null
            setIsActive(false)
            return
        }

        // 다른 버튼이 활성화 상태라면 비활성화
        if (globalActiveButton !== null && globalActiveButton !== btnkey) {
            window.speechSynthesis.cancel()
            // 이전 활성 버튼 상태 업데이트는 useEffect에서 자동으로 처리됨
        }

        // 새로운 재생 시작
        utteranceRef.current.text = text
        window.speechSynthesis.speak(utteranceRef.current)
        globalActiveButton = btnkey
        setIsActive(true)
    }

    // 이 버튼의 활성화 상태 감지
    const checkAndUpdateState = () => {
        const newState = globalActiveButton === btnkey
        if (isActive !== newState) {
            setIsActive(newState)
        }
    }

    // 16ms마다 상태 확인 (약 60fps)
    useEffect(() => {
        const intervalId = setInterval(checkAndUpdateState, 16)
        return () => clearInterval(intervalId)
    }, [btnkey, isActive])

    return (
        <>
            <button onClick={handleTTS}>
                {children || (
                    <img src={isActive ? stopImg : playBtnImg} alt={isActive ? '정지' : '재생'} />
                )}
            </button>
        </>
    )
}

export default TTSComponent
