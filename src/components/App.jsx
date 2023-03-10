import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from "./Login";
import UserIndex from '../pages/UserIndex';

export default function App(props) {
	const generalStyle = {
		height: '100vh',
		backgroundColor: 'var(--bs-dark)'
	}

	return (
		<div style={generalStyle}>
			<BrowserRouter>
				<Routes>
					<Route path='/login' element={<Login />} />
					<Route path='/userindex' element={<UserIndex />} />
				</Routes>
			</BrowserRouter>
		</div>
	)
}
