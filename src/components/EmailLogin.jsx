import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

export default function EmailLogin() {
    const loginHandler = event => {
        event.preventDefault();

        const hardcodedUsers = {
            "ionescu.pop@s.unibuc.ro": 1234,
            "popescu.ion@s.unibuc.ro": 12345
        }

        const emailInput = event.target.login_email;
        const passInput = event.target.login_pass;

        for(let key in hardcodedUsers) {
            if(key == emailInput && hardcodedUsers[key] == passInput) {
                
            }
        }
    }

    return (
        <Form onSubmit={loginHandler}>
            <FloatingLabel label='E-mail' controlId='login_email' className='mb-3 text-black'>
                <Form.Control type='email' placeholder='E-mail' />
            </FloatingLabel>
            
            <FloatingLabel label='Parolă' controlId='login_pass' className='mb-3 text-black'>
                <Form.Control type='password' placeholder='Parolă' />
            </FloatingLabel>

            <Form.Group controlId='login-remember' className='mb-3'>
                <Form.Check type='checkbox' label='Ține-mă minte' />
            </Form.Group>

            <Button variant='primary' type='submit'>
                Login
            </Button>
        </Form>
    )
}