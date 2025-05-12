import React, { use, useEffect, useState } from 'react'

const TTSComponent = ({ text, children }) => {
    const [isPlayed, setIsPlayed] = useState(false)
    const [isPause, setIsPause] = useState(false)
    const PlayTTS = (speakText) => {
        if (
            typeof SpeechSynthesisUtterance === 'undefined' ||
            typeof window.speechSynthesis === 'undefined'
        ) {
            alert('이 브라우저는 TTS를 지원하지 않습니다')
            return
        }

        const speechMsg = new SpeechSynthesisUtterance()
        speechMsg.rate = 1 // 속도  : 0.1 ~ 10
        speechMsg.pitch = 1 // 음높이 : 0 ~ 2
        speechMsg.lang = 'ko-KR'
        speechMsg.text = speakText

        if (isPlayed === false) {
            setIsPlayed(!isPlayed)
            //SpeechSynthesisUtterance에 저장된 ㅐㄴ용을 바탕으로 음성합성 실행
            window.speechSynthesis.speak(speechMsg)
            console.log('isplay상태 변경됨')
        }

        if (isPlayed && isPause === false) {
            window.speechSynthesis.pause(speechMsg)
            setIsPause(true)
            console.log('pause 호출')
        }

        if (isPlayed && isPause) {
            window.speechSynthesis.resume(speechMsg)
            setIsPause(false)

            console.log('resume 호출')
        }

        speechMsg.onend = () => {
            window.speechSynthesis.cancel()
            setIsPause(false)
            setIsPlayed(false)
            console.log('tts 종료됨')
        }

        console.log('현재상태', isPlayed)
    }
    return (
        <>
            <button onClick={() => PlayTTS(text)}>
                {children || <img src="/images/play-03.svg" alt="재생" />}
            </button>
        </>
    )
}

export default TTSComponent
