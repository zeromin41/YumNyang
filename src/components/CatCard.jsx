// src/components/CatCard.jsx
import React, { useState, useCallback, useEffect, useRef } from 'react'
import './CatCard.css'

// 로컬 이미지 임포트
import catImageDwinggul from '../assets/고양이뒹굴.png'
import catImageBaebbang from '../assets/고양이배빵빵.png'
import catImageBook from '../assets/고양이측면책.png'
import catImageSleep from '../assets/고양이쿨쿨.png'
import catImageDance from '../assets/고양이댄스.png'
import catImageGame from '../assets/고양이게임.png'
import catImageTeaTime from '../assets/고양이티타임.png'

// 츄르 이미지 임포트
import churuFullImg from '../assets/churu-full.svg'
import churuHalfImg from '../assets/churu-half.svg'
import churuEndsImg from '../assets/churu-ends.svg'

const catVariations = [
    { image: catImageBaebbang, text: '배빵빵~', alt: '배가 빵빵한 고양이' },
    { image: catImageDwinggul, text: '뒹굴뒹굴~', alt: '뒹구는 고양이' },
    { image: catImageBook, text: '독서 시간!', alt: '책 옆에 있는 고양이' },
    { image: catImageSleep, text: '흠냥 흠냥~', alt: '잠자는 고양이' },
    { image: catImageDance, text: '신난다~!', alt: '춤추는 고양이' },
    { image: catImageGame, text: '게임 중~!', alt: '게임하는 고양이' },
    { image: catImageTeaTime, text: '호로록~', alt: '차를 마시는 고양이' },
]

const CHURU_SPAWN_INTERVAL_MIN = 4000
const CHURU_SPAWN_INTERVAL_MAX = 8000
const CAT_EATING_ANIMATION_DURATION = 600

const CHURU_STATE_HIDDEN = 'hidden'
const CHURU_STATE_VISIBLE = 'visible'
const CHURU_STATE_MOVING = 'moving'
const CHURU_STATE_HALF = 'half'
const CHURU_STATE_ENDS = 'ends'

const CHURU_SIZE_PX = 50
const MIN_SPAWN_MARGIN_PX = 5
const CAT_AREA_SAFETY_PADDING_PX = 15

// 초기 variationIndex를 랜덤으로 설정하는 함수
const getRandomInitialIndex = () => Math.floor(Math.random() * catVariations.length)

const CatCard = () => {
    const [variationIndex, setVariationIndex] = useState(getRandomInitialIndex) // 초기 이미지 랜덤 설정
    const [isCatEating, setIsCatEating] = useState(false)
    const [showInitialWaitText, setShowInitialWaitText] = useState(true)

    const [churu, setChuru] = useState({
        state: CHURU_STATE_HIDDEN,
        imgSrc: churuFullImg,
        position: { top: '50%', left: '50%' },
        id: null,
    })

    const cardContainerRef = useRef(null)
    const catInteractionAreaRef = useRef(null)

    const churuSpawnTimerRef = useRef(null)
    const churuStepTimerRef = useRef(null)
    const catEatingAnimationTimerRef = useRef(null)

    // 현재 고양이 정보는 variationIndex가 변경될 때마다 업데이트
    const currentCat = catVariations[variationIndex]

    const spawnChuru = useCallback(() => {
        if (
            churu.state !== CHURU_STATE_HIDDEN ||
            churu.id !== null ||
            !cardContainerRef.current ||
            !catInteractionAreaRef.current
        ) {
            return
        }
        const containerWidth = cardContainerRef.current.offsetWidth
        const containerHeight = cardContainerRef.current.offsetHeight
        const catAreaTop = catInteractionAreaRef.current.offsetTop
        const catAreaLeft = catInteractionAreaRef.current.offsetLeft
        const catAreaWidth = catInteractionAreaRef.current.offsetWidth
        const catAreaHeight = catInteractionAreaRef.current.offsetHeight

        const protectedZone = {
            left: catAreaLeft - CAT_AREA_SAFETY_PADDING_PX - CHURU_SIZE_PX,
            top: catAreaTop - CAT_AREA_SAFETY_PADDING_PX - CHURU_SIZE_PX,
            right: catAreaLeft + catAreaWidth + CAT_AREA_SAFETY_PADDING_PX,
            bottom: catAreaTop + catAreaHeight + CAT_AREA_SAFETY_PADDING_PX,
        }
        let topPx, leftPx
        let attempts = 0
        const MAX_ATTEMPTS = 30
        do {
            leftPx =
                Math.random() * (containerWidth - CHURU_SIZE_PX - 2 * MIN_SPAWN_MARGIN_PX) +
                MIN_SPAWN_MARGIN_PX
            topPx =
                Math.random() * (containerHeight - CHURU_SIZE_PX - 2 * MIN_SPAWN_MARGIN_PX) +
                MIN_SPAWN_MARGIN_PX
            attempts++
            const churuRightPx = leftPx + CHURU_SIZE_PX
            const churuBottomPx = topPx + CHURU_SIZE_PX
            const overlapsWithProtectedZone =
                churuRightPx > protectedZone.left &&
                leftPx < protectedZone.right &&
                churuBottomPx > protectedZone.top &&
                topPx < protectedZone.bottom
            if (!overlapsWithProtectedZone || attempts >= MAX_ATTEMPTS) break
        } while (true)
        const topPercent = (topPx / containerHeight) * 100
        const leftPercent = (leftPx / containerWidth) * 100

        setChuru({
            state: CHURU_STATE_VISIBLE,
            imgSrc: churuFullImg,
            position: { top: `${topPercent}%`, left: `${leftPercent}%` },
            id: Date.now(),
        })
        setShowInitialWaitText(false)
    }, [churu.state, churu.id])

    useEffect(() => {
        const scheduleNextChuruSpawn = () => {
            clearTimeout(churuSpawnTimerRef.current)
            if (
                churu.state === CHURU_STATE_HIDDEN &&
                churu.id === null &&
                !isCatEating &&
                cardContainerRef.current &&
                catInteractionAreaRef.current
            ) {
                const interval =
                    Math.random() * (CHURU_SPAWN_INTERVAL_MAX - CHURU_SPAWN_INTERVAL_MIN) +
                    CHURU_SPAWN_INTERVAL_MIN
                churuSpawnTimerRef.current = setTimeout(() => {
                    spawnChuru()
                    scheduleNextChuruSpawn()
                }, interval)
            }
        }
        if (cardContainerRef.current && catInteractionAreaRef.current) {
            scheduleNextChuruSpawn()
        }
        return () => clearTimeout(churuSpawnTimerRef.current)
    }, [spawnChuru, churu.state, churu.id, isCatEating])

    useEffect(() => {
        clearTimeout(churuStepTimerRef.current)
        if (!churu.id) return

        if (churu.state === CHURU_STATE_MOVING) {
            churuStepTimerRef.current = setTimeout(() => {
                setChuru((prev) =>
                    prev.id === churu.id && prev.state === CHURU_STATE_MOVING
                        ? { ...prev, state: CHURU_STATE_HALF, imgSrc: churuHalfImg }
                        : prev
                )
            }, 800)
        } else if (churu.state === CHURU_STATE_HALF) {
            churuStepTimerRef.current = setTimeout(() => {
                setChuru((prev) =>
                    prev.id === churu.id && prev.state === CHURU_STATE_HALF
                        ? { ...prev, state: CHURU_STATE_ENDS, imgSrc: churuEndsImg }
                        : prev
                )
            }, 700)
        } else if (churu.state === CHURU_STATE_ENDS) {
            churuStepTimerRef.current = setTimeout(() => {
                if (churu.id && churu.state === CHURU_STATE_ENDS) {
                    setChuru((prev) => ({
                        ...prev,
                        state: CHURU_STATE_HIDDEN,
                        imgSrc: churuFullImg,
                        id: null,
                    }))
                    setIsCatEating(true) // "고맙다냥~!" 텍스트 표시 및 애니메이션 시작
                }
            }, 700)
        }
        return () => clearTimeout(churuStepTimerRef.current)
    }, [churu.state, churu.id])

    useEffect(() => {
        clearTimeout(catEatingAnimationTimerRef.current)
        if (isCatEating) {
            catEatingAnimationTimerRef.current = setTimeout(() => {
                setIsCatEating(false) // "고맙다냥~!" 텍스트 숨김 및 애니메이션 종료
                setVariationIndex((prevIdx) => {
                    let newIndex
                    do {
                        newIndex = Math.floor(Math.random() * catVariations.length)
                    } while (newIndex === prevIdx && catVariations.length > 1)
                    return newIndex
                })
                if (churu.state === CHURU_STATE_HIDDEN && churu.id === null) {
                    setShowInitialWaitText(true) // "츄르를 기다려보세요!" 텍스트 다시 표시
                }
            }, CAT_EATING_ANIMATION_DURATION)
        }
        return () => clearTimeout(catEatingAnimationTimerRef.current)
    }, [isCatEating, churu.state, churu.id])

    const handleChuruClick = useCallback(() => {
        if (churu.state === CHURU_STATE_VISIBLE && churu.id) {
            setChuru((prev) => ({ ...prev, state: CHURU_STATE_MOVING }))
        }
    }, [churu.state, churu.id])

    const catImageClasses = `cat-image ${isCatEating ? 'eating-animation' : ''}`

    const churuTargetPosition = {
        top: `calc(50% - ${CHURU_SIZE_PX / 2}px)`,
        left: `calc(50% - ${CHURU_SIZE_PX / 2}px)`,
    }

    // 헬퍼 텍스트 결정 로직 수정
    let helperTextContent = null
    if (isCatEating) {
        helperTextContent = '고맙다냥~!'
    } else if (showInitialWaitText && churu.state === CHURU_STATE_HIDDEN && churu.id === null) {
        helperTextContent = '츄르를 기다려보세요!'
    } else if (churu.id !== null && churu.state !== CHURU_STATE_HIDDEN) {
        // 츄르가 존재하고 숨겨진 상태가 아니면
        // (즉, VISIBLE, MOVING, HALF, ENDS 상태일 때)
        helperTextContent = '츄르를 클릭해서 먹여주세요!'
    }

    return (
        <div className="cat-card-container text-center" ref={cardContainerRef}>
            <h5 className="cat-card-title">{currentCat.text}</h5>
            <div className="cat-interaction-area" ref={catInteractionAreaRef}>
                <img src={currentCat.image} alt={currentCat.alt} className={catImageClasses} />
                {churu.id && churu.state !== CHURU_STATE_HIDDEN && (
                    <img
                        src={churu.imgSrc}
                        alt="츄르"
                        className={`churu-item ${churu.state}`}
                        style={{
                            top:
                                churu.state === CHURU_STATE_MOVING ||
                                churu.state === CHURU_STATE_HALF ||
                                churu.state === CHURU_STATE_ENDS
                                    ? churuTargetPosition.top
                                    : churu.position.top,
                            left:
                                churu.state === CHURU_STATE_MOVING ||
                                churu.state === CHURU_STATE_HALF ||
                                churu.state === CHURU_STATE_ENDS
                                    ? churuTargetPosition.left
                                    : churu.position.left,
                        }}
                        onClick={churu.state === CHURU_STATE_VISIBLE ? handleChuruClick : undefined}
                    />
                )}
            </div>
            {helperTextContent && <p className="interaction-helper-text">{helperTextContent}</p>}
        </div>
    )
}

export default CatCard
