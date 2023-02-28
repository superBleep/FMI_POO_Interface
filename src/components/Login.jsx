import EmailLogin from "./EmailLogin";
import GitHubLogin from "./GitHubLogin";

import Container from 'react-bootstrap/Container';

export default function Login() {
    return (
        <Container style={{width: '300px'}} className="position-absolute top-50 start-50 translate-middle text-white">
                <EmailLogin />
                <GitHubLogin />
        </Container>
    )
}