import { backendLink } from './constants';
import { useState } from 'react';

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
