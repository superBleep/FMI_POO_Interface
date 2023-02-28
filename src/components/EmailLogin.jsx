import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

export default function EmailLogin() {
    return (
        <Form>
            <FloatingLabel label='E-mail' controlId='login-email' className='mb-3 text-black'>
                <Form.Control type='email' placeholder='E-mail' />
            </FloatingLabel>
            
            <FloatingLabel label='Parolă' controlId='login-pass' className='mb-3 text-black'>
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