import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

const backendLink = `http://${import.meta.env.VITE_DOMAIN}:${import.meta.env.VITE_BACKEND_PORT}`

async function loginUserEmail(credentials) {
    return fetch(`${backendLink}/api/email-login`, {
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors',
        method: 'POST',
        body: JSON.stringify(credentials)
    })
    .then(res => res)
}

export default function EmailLogin({ setLoggedIn }) {
    const loginHandler = async event => {
        event.preventDefault()

        const credentials = {
            email: event.target.login_email.value,
            pass: event.target.login_pass.value,
            remember: event.target.login_remember.checked
        }
        const loginRes = await loginUserEmail(credentials)

        if(loginRes.status == 200) {
            setLoggedIn(true)
        }
        else {
            // to be implemented
            console.log(await loginRes.text())
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

            <Form.Group controlId='login_remember' className='mb-3'>
                <Form.Check type='checkbox' label='Ține-mă minte' />
            </Form.Group>

            <Button className='w-100' variant='primary' type='submit'>
                Login
            </Button>

            <hr></hr>
        </Form>
    )
}
