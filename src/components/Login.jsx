import EmailLogin from "./EmailLogin";
import GitHubLogin from "./GitHubLogin";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Login() {
    return (
        <Container className="position-absolute top-50 start-50 translate-middle text-white">
            <Row>
                <Col><EmailLogin /></Col>
                <Col><GitHubLogin /></Col>
            </Row>
        </Container>
    )
}