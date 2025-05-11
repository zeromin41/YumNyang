import React, { useEffect, useState } from 'react'

const TTSComponent = ({ text, children }) => {
    const [isPlayed, setIsPlayed] = useState(false)
    const PlayTTS = (speakText) => {
        if (
            typeof SpeechSynthesisUtterance === 'undefined' ||
            typeof window.speechSynthesis === 'undefined'
        ) {
            alert('이 브라우저는 TTS를 지원하지 않습니다')
            return
        }

        window.speechSynthesis.cancel() // 현재 읽고 있었다면 초기화해줌

        const speechMsg = new SpeechSynthesisUtterance()
        speechMsg.rate = 1 // 속도  : 0.1 ~ 10
        speechMsg.pitch = 1 // 음높이 : 0 ~ 2
        speechMsg.lang = 'ko-KR'
        speechMsg.text = speakText

        if (isPlayed === false) {
            setIsPlayed(!isPlayed)
            //SpeechSynthesisUtterance에 저장된 ㅐㄴ용을 바탕으로 음성합성 실행
            window.speechSynthesis.speak(speechMsg)
        }

        if (isPlayed === true) {
            setIsPlayed(!isPlayed)
            window.speechSynthesis.pause(speechMsg)
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
