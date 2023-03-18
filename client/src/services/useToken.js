import { useState } from 'react'

export default function useToken() {
    const getToken = () => {
        const tokenString = localStorage.getItem('token')

        return tokenString
    }

    const [token, setToken] = useState(getToken())

    const saveToken = userToken => {
        localStorage.setItem('token', JSON.stringify(userToken))
        setToken(JSON.stringify(userToken))
    }

    return {
        setToken: saveToken,
        token
    }
}