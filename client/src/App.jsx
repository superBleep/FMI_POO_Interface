import { React, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { backendLink, generalStyle } from './services/constants';
import Dashboard from './components/main/Dashboard';
import Login from './components/main/Login';

export default function App() {
    const [loggedIn, setLoggedIn] = useState();

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const resp = await fetch(`${backendLink}/api/auth/is-current-user`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                credentials: 'include',
                method: 'GET',
            });

            setLoggedIn(await resp.json());
        };

        fetchCurrentUser();
    }, [loggedIn]);

    if (!loggedIn) {
        return (
            <div style={generalStyle}>
                <Login setLoggedIn={setLoggedIn} />
            </div>
        );
    } else {
        return (
            <div style={generalStyle}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/*" element={<Dashboard loggedIn={loggedIn} setLoggedIn={ setLoggedIn }/>} />
                    </Routes>
                </BrowserRouter>
            </div>
        );
    }
}
