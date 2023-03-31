import { Link } from "react-router-dom";
export default function Navbar() {
    return (
        <nav className = "navbar navbar-expand-lg navbar-light bg-light">
            <ul className = "navbar-nav">
                <li className = "nav-item"><Link to="/home"><p className = "nav-link">Home</p></Link></li>
                <li className = "nav-item"><Link to="/settings"><p className = "nav-link">Settings</p></Link></li>
            </ul>
        </nav>
    );
};