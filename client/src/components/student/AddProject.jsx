import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/esm/Form.js';
import Modal from 'react-bootstrap/esm/Modal.js';
import { backendLink } from '../../services/constants';

export default function AddProject(props) {
    async function postProject(event) {
        props.handleClose();

        const postAPI = async(data) => {
            return fetch(`${backendLink}/api/projects`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                credentials: 'include',
                method: 'POST',
                body: JSON.stringify(data),
            }).then(res => res);
        }

        event.preventDefault();

        const projectData = {
            student_id: props.student_id,
            class_id: props.studentClasses.filter(c => c.name = event.target.formProjectClass.value)[0].class_id,
            name: event.target.formProjectName.value,
            github_link: event.target.formProjectLink.value,
        }

        await postAPI(projectData);
    } 

    function listStudentClasses() {
        if(Object.keys(props.studentClasses).length) {
            return props.studentClasses.map(c => {
                return (
                    <option key={c.class_id} id={'p-cls-' + c.class_id}>{c.name}</option>
                );
            });
        }
    }

    return (
        <Modal show={props.show} onHide={props.handleClose} centered backdrop='static'>
            <Modal.Header closeButton>
                <Modal.Title>Adaugă un proiect</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form id='addProjectForm' onSubmit={postProject}>
                    <Form.Group controlId='formProjectName'>
                        <Form.Label>Numele proiectului</Form.Label>
                        <Form.Control type='text' placeholder='Introdu numele (max. 50 de litere)' required></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='formProjectLink' style={{ marginTop: '1em' }}>
                        <Form.Label>Link-ul proiectului (Github)</Form.Label>
                        <Form.Control type="text" placeholder="https://github.com/username/proiect" required pattern="https:\/\/github.com\/[A-Za-z0-9]+\/.+">
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='formProjectClass' style={{ marginTop: '1em' }}>
                        <Form.Label>Materia proiectului</Form.Label>
                        <Form.Select defaultValue={'placeholder'}>
                            <option value='placeholder' disabled>Selectează materia</option>
                            {listStudentClasses()}
                        </Form.Select>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='primary' type='submit' form='addProjectForm'>
                    Adaugă
                </Button>
            </Modal.Footer>
        </Modal>
    );
}