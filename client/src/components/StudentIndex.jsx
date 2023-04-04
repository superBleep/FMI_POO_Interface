import { React, useEffect, useState } from 'react';
import '../css/StudentIndex.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

const backendLink = `http://${import.meta.env.VITE_DOMAIN}:${import.meta.env.VITE_BACKEND_PORT}`

export default function StudentIndex() {
    const [userData, setUserData] = useState()
    const [studentProjects, setStudentProjects] = useState()
    const [show, setShow] = useState(false)

    useEffect(() => {
        const getStudentData = async () => {
            const resp = await fetch(`${backendLink}/api/user-data`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                credentials: 'include',
                method: 'GET'
            })
    
            let asyncUserData = Object.values(await resp.json())[1]
            setUserData(asyncUserData)

            const getStudentProjects = async () => {
                const resp = await fetch(`${backendLink}/api/user-projects`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    mode: 'cors',
                    credentials: 'include',
                    method: 'POST',
                    body: JSON.stringify({'student_id': asyncUserData.id})
                })
    
                let userProjects = {}
                if(resp.data) {
                    userProjects = await resp.json()
                }
                
                setStudentProjects(userProjects)
            }
            getStudentProjects()
        }
        getStudentData()
    }, [])

    
    const showProjects = () => {
        if(studentProjects && Object.keys(studentProjects).length == 0) {
            return <p id='noProject'>Nu ai niciun proiect adăugat. Adaugă un proiect cu butonul de mai sus.</p>
        }
        else {
            return <p>Proiecte...</p>
        }
    }

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    if(userData) {
        return (
            <div id='studentIndex' className='text-white'>
                <Modal show={show} onHide={handleClose} centered backdrop='static'>
                    <Modal.Header closeButton>
                        <Modal.Title>Adaugă un proiect</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form id='addProjectForm'>
                            <Form.Group controlId='formProjectName'>
                                <Form.Label>Numele proiectului</Form.Label>
                                <Form.Control type='text' placeholder='Introdu numele (max. 50 de litere)'></Form.Control>
                            </Form.Group>
                            <Form.Group controlId='formProjectLink' style={{marginTop: '1em'}}>
                                <Form.Label>Link-ul proiectului (GitHub)</Form.Label>
                                <Form.Control type='text' placeholder='Introdu link-ul'></Form.Control>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='primary' type='submit' form='addProjectForm'>Adaugă</Button>
                    </Modal.Footer>
                </Modal>

                <h1>Salut, {userData.name}!</h1>
                <div id='projectsDiv'>
                    <h2>Proiectele tale</h2>
                    <Button variant='primary' onClick={handleShow}><i class="fa-solid fa-plus"></i> Proiect</Button>
                    <hr></hr>
                    {showProjects()}
                </div>
            </div>
        );
    }
}