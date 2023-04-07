import { useState } from 'react';

const backendLink = `http://${import.meta.env.VITE_DOMAIN}:${import.meta.env.VITE_BACKEND_PORT}`;

export default function useLoggedIn() {
    const getLoggedIn = async () => {
        const fetchResp = await fetch(`${backendLink}/api/current-user`, {
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            method: 'GET',
        }).then((res) => res.json());

        setLoggedIn(fetchResp);
    };

    const [loggedIn, setLoggedIn] = useState(getLoggedIn());

    return {
        setLoggedIn,
        loggedIn,
    };
}
