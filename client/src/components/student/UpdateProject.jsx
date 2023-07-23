import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/esm/Modal';
import Form from 'react-bootstrap/esm/Form';
import { backendLink } from '../../services/constants';

export default function UpdateProject(props) {
    async function updateProject(event) {
        props.handleClose();

        const updateAPI = async (data) => {
            return fetch(`${backendLink}/api/projects/${props.selectedProj.project_id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                credentials: 'include',
                method: 'PUT',
                body: JSON.stringify(data),
            }).then((res) => res);
        }

        event.preventDefault();

        const projectData = {
            student_id: props.studentId,
            class_id: props.studentClasses.filter(c => c.name = event.target.formProjectClass.value)[0].class_id,
            name: event.target.formProjectName.value,
            github_link: event.target.formProjectLink.value
        };

        await updateAPI(projectData);
        props.setRefresh(!props.refresh);
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
        <Modal show={props.show} onHide={props.handleClose} centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Modifică datele proiectului</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form id="editProjectForm" onSubmit={updateProject}>
                    <Form.Group controlId="formProjectId" hidden>
                        <Form.Control value={props.selectedProj.project_id} readOnly></Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formProjectName">
                        <Form.Label>Numele proiectului</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Introdu numele (max. 50 de litere)"
                            defaultValue={props.selectedProj.name}
                            required
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formProjectLink" style={{ marginTop: '1em' }}>
                        <Form.Label>Link-ul proiectului (GitHub)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="https://github.com/username/proiect"
                            required
                            defaultValue={props.selectedProj.github_link}
                            pattern="https:\/\/github.com\/[A-Za-z0-9]+\/.+"
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formProjectClass" style={{ marginTop: '1em' }}>
                        <Form.Label>Materia proiectului</Form.Label>
                        <Form.Select defaultValue={"placeholder"}>
                            <option value="placeholder" disabled>Selectează materia</option>
                            {listStudentClasses()}
                        </Form.Select>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='primary' type='submit' form='editProjectForm'>
                    Modifică
                </Button>
            </Modal.Footer>
        </Modal>
    );
}