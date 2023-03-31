import { Container, Row, Col, ToggleButton, Button, ButtonGroup} from 'react-bootstrap';  
import {useNavigate} from "react-router-dom"
import { useState, useEffect, useContext } from 'react';
import ThemeContext from '../services/ThemeContext';
export default function Settings() {
    const theme = useContext(ThemeContext)
    const navigate = useNavigate();
    const githubLogout = () => {
        localStorage.removeItem("accessToken");
        navigate("/login");
    }
    return (
    <>
      <Container fluid>
        Current theme is {String(theme.darkMode)}
        <h1>Account</h1>
        <Button onClick={githubLogout}>Logout</Button>
        <h1>Preferences</h1>
        <ButtonGroup className="mb-2">
          <ToggleButton id="toggle-check" value="1" type="checkbox" checked={theme.darkMode} 
          onChange={() => {theme.setDarkMode(!theme.darkMode)}}>
            Dark mode
          </ToggleButton>
        </ButtonGroup>
      </Container>
    </>
    );
}



