import { React, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import Login from './components/Login'
import { generalStyle } from './services/constants'
import useToken from './services/useToken'

export default function App() {
	const { token, setToken } = useToken()
	const { userData, setUserData } = useState()

	if(!token) {
		return (
			<div style={generalStyle}>
				<Login setToken={setToken} />
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
