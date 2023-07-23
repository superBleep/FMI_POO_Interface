import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/esm/Modal.js';
import { backendLink } from '../../services/constants';

export default function DeleteProject(props) {
    function deleteProject() {
        async function deleteAPI() {
            await fetch(`${backendLink}/api/projects/${props.selectedProj.project_id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                credentials: 'include',
                method: 'DELETE',
            }).then(res => res); 
        }
        deleteAPI();

        props.handleClose();
        props.setRefresh(!props.refresh);
    }

    return (
        <Modal show={props.show} centered backdrop='static'>
            <Modal.Body>
                Ești sigur că vrei să ștergi proiectul <span style={{fontWeight: 'bold'}}>{props.selectedProj.name}</span> ?
            </Modal.Body>
            <Modal.Footer>
                <Button variant='danger' onClick={props.handleClose}>Nu</Button>
                <Button variant='success' onClick={deleteProject}>Da</Button>
            </Modal.Footer>
        </Modal>
    );
}