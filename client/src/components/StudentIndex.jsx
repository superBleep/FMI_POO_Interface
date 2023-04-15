import { React, useEffect, useState } from 'react';
import '../css/StudentIndex.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { faStar as faRStar } from '@fortawesome/free-regular-svg-icons';

const backendLink = `http://${import.meta.env.VITE_DOMAIN}:${import.meta.env.VITE_BACKEND_PORT}`;

export default function StudentIndex() {
    const [userData, setUserData] = useState();
    const [studentProjects, setStudentProjects] = useState();
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [toDelete, setToDelete] = useState('blank');

    const [change, setChange] = useState(false);

    useEffect(() => {
        const getStudentData = async () => {
            const resp = await fetch(`${backendLink}/api/user-data`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                credentials: 'include',
                method: 'GET',
            });

            let asyncUserData = Object.values(await resp.json())[1];
            setUserData(asyncUserData);

            const getStudentProjects = async () => {
                const resp = await fetch(`${backendLink}/api/user-projects`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    mode: 'cors',
                    credentials: 'include',
                    method: 'POST',
                    body: JSON.stringify({ student_id: asyncUserData.id }),
                });

                let userProjects = {};
                if (resp.status == 200) {
                    userProjects = await resp.json();
                }

                setStudentProjects(userProjects);
            };
            getStudentProjects();
        };
        getStudentData();
    }, [change]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);

    const showProjects = () => {
        if (!studentProjects || Object.keys(studentProjects).length == 0) {
            return <p id="noProject">Nu ai niciun proiect adăugat. Adaugă un proiect cu butonul de mai sus.</p>;
        } else {
            return (
                <Table style={{ color: 'white', textAlign: 'center' }}>
                    <thead>
                        <tr>
                            <th>Nume</th>
                            <th>Link</th>
                            <th>Starred</th>
                            <th>Observații</th>
                            <th>Outdated</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentProjects.map((project) => {
                            if (project.starred)
                                var star = <FontAwesomeIcon icon={faStar} style={{ color: '#ffff00' }} />;
                            else var star = <FontAwesomeIcon icon={faRStar} />;

                            if (project.observations) var obs = project.observations;
                            else var obs = '-';

                            return (
                                <tr key={project.id}>
                                    <td>{project.name}</td>
                                    <td>
                                        <a href={project.link} target="blank">
                                            {project.link}
                                        </a>
                                    </td>
                                    <td>{star}</td>
                                    <td>{obs}</td>
                                    <td>
                                        <Container id="outdated">test</Container>
                                    </td>
                                    <td>
                                        <Button
                                            variant="danger"
                                            title="Șterge proiectul"
                                            onClick={deletionModal.bind(this, [project])}
                                            className="w-100"
                                        >
                                            <FontAwesomeIcon icon={faTrashCan} />
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            );
        }
    };

    const postProject = async (event) => {
        handleClose();

        const postProjectAPI = async (projectData) => {
            return fetch(`${backendLink}/api/post-project`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                credentials: 'include',
                method: 'POST',
                body: JSON.stringify(projectData),
            }).then((res) => res);
        };

        event.preventDefault();

        const projectData = {
            student_id: userData.id,
            name: event.target.formProjectName.value,
            link: event.target.formProjectLink.value,
        };
        change ? setChange(false) : setChange(true);
        await postProjectAPI(projectData);
    };

    const deletionModal = (project) => {
        setToDelete(project[0]);
        handleShow2();
    };

    const deleteProject = async () => {
        fetch(`${backendLink}/api/delete-project`, {
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify(toDelete),
        }).then((res) => res);

        handleClose2();
        change ? setChange(false) : setChange(true);
    };

    if (userData) {
        return (
            <div id="studentIndex" className="text-white">
                <Modal show={show} onHide={handleClose} centered backdrop="static">
                    <Modal.Header closeButton>
                        <Modal.Title>Adaugă un proiect</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form id="addProjectForm" onSubmit={postProject}>
                            <Form.Group controlId="formProjectName">
                                <Form.Label>Numele proiectului</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Introdu numele (max. 50 de litere)"
                                    required
                                ></Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formProjectLink" style={{ marginTop: '1em' }}>
                                <Form.Label>Link-ul proiectului (GitHub)</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="https://github.com/username/proiect"
                                    required
                                    pattern="https:\/\/github.com\/[A-Za-z0-9]+\/.+"
                                ></Form.Control>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" type="submit" form="addProjectForm">
                            Adaugă
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={show2} centered backdrop="static">
                    <Modal.Body>
                        Ești sigur că vrei să ștergi proiectul{' '}
                        <span style={{ fontWeight: 'bold' }}>{toDelete.name}</span>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={handleClose2}>
                            Nu
                        </Button>
                        <Button variant="success" onClick={deleteProject}>
                            Da
                        </Button>
                    </Modal.Footer>
                </Modal>

                <h1>Salut, {userData.name}!</h1>
                <div id="projectsDiv">
                    <h2>Proiectele tale</h2>
                    <Button variant="primary" onClick={handleShow} title="Adaugă un proiect">
                        <FontAwesomeIcon icon={faPlus} /> Proiect
                    </Button>
                    <hr></hr>
                    {showProjects()}
                </div>
            </div>
        );
    }
}
