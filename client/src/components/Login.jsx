import EmailLogin from "./EmailLogin";
import GitHubLogin from "./GitHubLogin";

import Container from 'react-bootstrap/Container';
import PropTypes from 'prop-types';

export default function Login({ setToken }) {
    return (
        <Container style={{width: '300px'}} className="position-absolute top-50 start-50 translate-middle text-white">
            <EmailLogin setToken={ setToken }/>
            <GitHubLogin />
        </Container>
    )
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
}