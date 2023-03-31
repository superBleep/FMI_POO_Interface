import { React, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import Login from './components/Login'
import { generalStyle } from './services/constants'

import useLoggedIn from './services/useLoggedIn';

const backendLink = `http://${import.meta.env.VITE_DOMAIN}:${import.meta.env.VITE_BACKEND_PORT}`

export default function App() {
	const { loggedIn, setLoggedIn } = useLoggedIn()

	console.log(loggedIn)

	if(!loggedIn) {
		return (
			<div style={generalStyle}>
				<Login setLoggedIn = {setLoggedIn} />
			</div>
		)
	}

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
