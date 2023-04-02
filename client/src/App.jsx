import { React, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import Login from './components/Login'
import { generalStyle } from './services/constants'

const backendLink = `http://${import.meta.env.VITE_DOMAIN}:${import.meta.env.VITE_BACKEND_PORT}`

export default function App() {
	const [loggedIn, setLoggedIn] = useState();

	useEffect(() => {
		const fetchCurrentUser = async () => {
			const resp = await fetch(`${backendLink}/api/current-user`, {
				headers: {
					'Content-Type': 'application/json'
				},
				mode: 'cors',
				credentials: 'include',
				method: 'GET'
			})

			setLoggedIn(await resp.json())
		}
		
		fetchCurrentUser()
	}, [])

	if(!loggedIn) {
		return (
			<div style={generalStyle}>
				<Login setLoggedIn = {setLoggedIn} />
			</div>
		)
	}
	else {
		return (
			<div style={generalStyle}>
				<BrowserRouter>
					<Routes>
						<Route path='/' element={<Dashboard />} />
					</Routes>
				</BrowserRouter>
			</div>
		)
	}
}
