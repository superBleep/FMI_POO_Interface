import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function EmailLogin() {
    return (
        <Form>
            <Form.Group controlId='login-email' className='mb-3'>
                <Form.Label>E-mail</Form.Label>
                <Form.Control type='email' placeholder='Introdu adresa de e-mail...' />
            </Form.Group>
            
            <Form.Group controlId='login-pass' className='mb-3'>
                <Form.Label>Parolă</Form.Label>
                <Form.Control type='password' placeholder='Introdu parola...' />
            </Form.Group>

            <Form.Group controlId='login-remember' className='mb-3'>
                <Form.Check type='checkbox' label='Ține-mă minte' />
            </Form.Group>

            <Button variant='primary' type='submit'>
                Login
            </Button>
        </Form>
    )
}