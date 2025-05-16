import React, { useState, useEffect, useRef } from 'react'
import style from './Timer.module.css'

function Timer({ size = 500, strokeWidth = 12, onComplete }) {
    const [remainingSec, setRemainingSec] = useState(0)
    const [started, setStarted] = useState(false)
    const [inputMinutes, setInputMinutes] = useState('')
    const [inputSecondsInput, setInputSecondsInput] = useState('')
    const [totalSeconds, setTotalSeconds] = useState(0)
    const circleRef = useRef(null)

    // Fix radius calculation to account for the stroke width properly
    const radius = (size - strokeWidth * 2) / 2
    const radius = (size - strokeWidth * 4) / 2
    const circumference = 2 * Math.PI * radius

    useEffect(() => {
        if (!started) return

        const startTime = Date.now()
        const totalMs = remainingSec * 1000
        const endTime = startTime + totalMs
        let rafId

        const update = () => {
            const now = Date.now()
            const diff = Math.max(0, endTime - now)
            const progress = diff / totalMs
            const offset = circumference * (1 - progress)

            if (circleRef.current) {
                circleRef.current.style.strokeDashoffset = offset
            }

            setRemainingSec(Math.ceil(diff / 1000))

            if (diff > 0) {
                rafId = requestAnimationFrame(update)
            } else {
                setStarted(false)
                onComplete && onComplete()
            }
        }

        if (circleRef.current) {
            circleRef.current.style.strokeDasharray = circumference
            circleRef.current.style.strokeDashoffset = circumference
        }
        rafId = requestAnimationFrame(update)

        return () => cancelAnimationFrame(rafId)
    }, [started])

    const handleStart = () => {
        const mins = parseInt(inputMinutes, 10) || 0
        const secsInput = parseInt(inputSecondsInput, 10) || 0
        const secs = mins * 60 + secsInput
        if (!secs || secs <= 0) {
            return alert('양수의 분·초 단위 시간을 입력해주세요.')
        }
        setTotalSeconds(secs)
        setRemainingSec(secs)
        setStarted(true)
    }

    const handleStop = () => {
        setStarted(false)
    }

    const formatMMSS = (sec) => {
        const m = String(Math.floor(sec / 60)).padStart(2, '0')
        const s = String(sec % 60).padStart(2, '0')
        return `${m}:${s}`
    }

    return (
        <div className={style.timerWrapper}>
            <div className={style.circularTimer} style={{ width: size, height: size }}>
                {/* Add viewBox to ensure SVG scales properly */}
                <svg width={size} height={size}>
                    <circle
                        className={style.circularTimer__bg}
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                    />
                    <circle
                        ref={circleRef}
                        className={style.circularTimer__progress}
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                    />
                </svg>

                <div className={style.circularTimer__text} style={{ fontSize: size * 0.15 }}>
                    {started ? (
                        formatMMSS(remainingSec)
                    ) : (
                        <div className={style.timeInputs}>
                            <input
                                type="number"
                                min="0"
                                placeholder="분"
                                value={inputMinutes}
                                onChange={(e) => setInputMinutes(e.target.value)}
                                disabled={started}
                            />
                            <span>:</span>
                            <input
                                type="number"
                                min="0"
                                max="59"
                                placeholder="초"
                                value={inputSecondsInput}
                                onChange={(e) => setInputSecondsInput(e.target.value)}
                                disabled={started}
                            />
                        </div>
                    )}
                </div>
            </div>

            {started ? (
                <button className={style.timerButton} onClick={handleStop}>
                    정지
                </button>
            ) : (
                <button className={style.timerButton} onClick={handleStart}>
                    시작
                </button>
            )}
        </div>
    )
}

export default Timer
