import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { checkToken } from '../apis/auth'

const AuthGuard = ({ children }) => {
    const navigate = useNavigate()

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const token = await checkToken()
                const userId = localStorage.getItem('userId')

                if (!token && !userId) {
                    localStorage.removeItem('userId')
                    navigate('/login', { replace: true })
                }
            } catch (err) {
                console.log(err.message)
                localStorage.removeItem('userId')
                navigate('/login', { replace: true })
            }
        }

        verifyAuth()
    }, [])

    return children
}

export default AuthGuard
