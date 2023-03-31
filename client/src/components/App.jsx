import Login from "../pages/Login";
import Layout from "../pages/Layout";
import Settings from "../pages/Settings";
import Home from "../pages/Home";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate} from "react-router-dom";
import ThemeContext from "../services/ThemeContext";
export default function App() {
	const [darkMode, setDarkMode] = useState(false);
	const [isLogged, setLogged] = useState(false);
	const loginCallback = (bool) => {
		setLogged(bool);
	};
	return (
		<BrowserRouter>
		<ThemeContext.Provider value={{darkMode, setDarkMode}}>
			{!isLogged && <Login callback={loginCallback}/>}
				{isLogged &&
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route index element={<Home/>}/>
						<Route path="login" element={<Login callback={loginCallback}/>}/>
						<Route path="home" element={<Home/>}/>
						<Route path="settings" element={<Settings/>}/>
					</Route>
				</Routes>
				}
		</ThemeContext.Provider>
		</BrowserRouter>
	);
}
