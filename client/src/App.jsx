import Login from "./components/Login";

export default function App() {
	const generalStyle = {
		height: '100vh',
		backgroundColor: 'var(--bs-dark)'
	}

	return (
		<div style={generalStyle}>
			<Login />
		</div>
	)
}
