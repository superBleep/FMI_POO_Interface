import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

import { domain, backendPort } from '../services/constants'

const backendLink = `http://${domain}:${backendPort}`

async function loginUserEmail(credentials) {
    return fetch(`${backendLink}/email-login`, {
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors',
        method: 'POST',
        body: JSON.stringify(credentials)
    })
    .then(res => res.json())
} 

export default function EmailLogin({ setToken }) {
    const loginHandler = async event => {
        event.preventDefault()

        const credentials = {
            email: event.target.login_email.value,
            pass: event.target.login_pass.value
        }
        const token = await loginUserEmail(credentials)

        if(!token.error) {
            setToken(token)
        }
        else {
            console.log("User not found!")
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

            <Button className='w-100' variant='primary' type='submit'>
                Login
            </Button>

            <hr></hr>
        </Form>
    )
}
