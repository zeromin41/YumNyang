import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { checkToken } from '../apis/auth'

const AuthGuard = ({ children }) => {
    const navigate = useNavigate()

    const [isVerifying, setIsVerifying] = useState(true)
    const hasVerified = useRef(false)

    useEffect(() => {
        if (hasVerified.current) return
        hasVerified.current = true

        const verifyAuth = async () => {
            try {
                await checkToken()
                const userId = localStorage.getItem('userId')

                if (!userId) {
                    navigate('/login', { replace: true })
                }
            } catch (err) {
                localStorage.removeItem('userId')
                navigate('/login', { replace: true })
            } finally {
                setIsVerifying(false)
            }
        }

        verifyAuth()
    }, [])

    if (isVerifying) return null
    return children
}

export default AuthGuard
