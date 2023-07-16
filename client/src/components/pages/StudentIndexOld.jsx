import { Octokit } from '@octokit-next/core';
import { React, useEffect, useState } from 'react';
import '../../css/StudentIndex.css';
import { octokitHeaders, backendLink } from '../../services/constants';
import { projectStatusText } from '../../services/StudentIndex/projectStatus';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faPlus, faTrashCan, faPen, faCheck } from '@fortawesome/free-solid-svg-icons';
import { faStar as faRStar } from '@fortawesome/free-regular-svg-icons';

// GitHub API config
const octokit = new Octokit({
    auth: import.meta.env.GITHUB_TOKEN
});

// Pull data from GitHub API
async function getGitHubData(userProjects, userData) {
    userProjects.map(project => {
        Object.assign(project, {
            starred: false,
            outdatedProject: 0,
            outdatedFeedback: 0
        });
    })

    let newProjects = userProjects.map(async project => {
        const matches = (project.github_link).matchAll(".*\/(.*)\/(.*)").next().value;
        let owner = matches[1];
        let repo = matches[2];

        // --------- STARRED ---------
        // Fetch all stargazers on the repo
        let stargazers = (await octokit.request(`GET /repos/${owner}/${repo}/stargazers`, {
            owner: owner,
            repo: repo,
            headers: octokitHeaders
        })).data;

        // Fetch (from the DB) all professors
        // with type 'lab' assigned to the student
        let labs = await fetch(`${backendLink}/api/students/${userData.student_id}/professors/lab`, {
            header: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            method: 'GET'
        }).then(res => res.json());
        labs = labs.map(e => (e.github_account).split("/")[3])

        // Check if the professor is found
        // between the repo stargazers
        for(let user of stargazers)
            for(let lab of labs)
                if(user.login == lab)
                    project.starred = true;

        // --------- FEEDBACK ---------
        // Fetch the last comment on the repo
        let allComments = (await octokit.request(`GET /repos/${owner}/${repo}/comments`, {
            owner: owner,
            repo: repo,
            headers: octokitHeaders
        }));

        let lastComment = allComments.data;

        // Check if there are no comments on the repo
        if(!lastComment.length) {
            project.outdatedProject = -1;
            project.outdatedFeedback = -1;

            return project;
        }

        for(let e of allComments.headers.link.split(", ")) {
            let link = e.match("(?<=<).*?(?=>)")[0];
            lastComment = lastComment.concat((await octokit.request(link)).data);
        }
        lastComment = lastComment[lastComment.length - 1];

        // Fetch the last commit on the repo
        let events = (await octokit.request('GET /repos/{owner}/{repo}/events', {
            owner: owner,
            repo: repo,
            headers: octokitHeaders
        })).data;

        let lastCommit = events.find(e => e.type == "PushEvent");

        if(!lastCommit) {
            project.outdatedProject = -3;
            project.outdatedFeedback = -3;

            return project;
        }

        // Outdated project (no commits since last feedback)
        if(lastComment.commit_id == lastCommit.payload.commits[0].sha) {
            project.outdatedFeedback = -2;

            let commentDate = newDate(lastComment.updated_at);
            let currentDate = new Date();
            project.outdatedProject = Math.round((currentDate.getTime() - commentDate.getTime()) / (1000 * 3600 * 24));
        }
        // Outdated feedback (one or more commits since last feedback)
        else {
            project.outdatedProject = -2;

            let commentDate = new Date(lastComment.updated_at);
            let commitDate = new Date ((await octokit.request(`GET /repos/${owner}/${repo}/commits/${lastCommit.payload.commits[0].sha}`, {
                owner: owner,
                repo: repo,
                ref: lastCommit.payload.commits[0].sha,
                headers: octokitHeaders
            })).data.commit.author.date);

            project.outdatedFeedback = Math.round((commitDate.getTime() - commentDate.getTime()) / (1000 * 3600 * 24));;
        }

        return project;
    })

    return await Promise.all(newProjects);
}

export default function StudentIndexOld({ setLoggedIn }) {
    const [userData, setUserData] = useState();
    const [projects, setProjects] = useState();
    const [classes, setClasses] = useState();
    const [show, setShow] = useState(false); // insert project modal
    const [show2, setShow2] = useState(false); // delete project modal
    const [show3, setShow3] = useState(false); // modify project modal
    const [selProject, setSelProject] = useState('blank'); // project to be deleted/modified

    // Fetch/modify student data
    const getStudentData = async () => {
        const resp = await fetch(`${backendLink}/api/users/current-user`, {
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
            const resp = await fetch(`${backendLink}/api/students/${asyncUserData.student_id}/projects`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                credentials: 'include',
                method: 'GET'
            });

            let userProjects = {};
            if (resp.status == 200) {
                userProjects = await getGitHubData(await resp.json(), asyncUserData);
            }

            setProjects(userProjects);
        };
        getStudentProjects();

        const getClasses = async () => {
            const resp = await fetch(`${backendLink}/api/students/${asyncUserData.user_id}/classes`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                credentials: 'include',
                method: 'GET'
            });

            setClasses(await resp.json());
        };
        getClasses();
    };

    useEffect(() => {
        getStudentData();
    }, [])
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);
    const handleClose3 = () => setShow3(false);
    const handleShow3 = () => setShow3(true);

    // List student's classes in the
    // insert project modal
    const listClasses = () => {
        if(classes) {
            return classes.map(cls => {
                return (
                    <option key={cls.class_id} id={"p-cls-" + cls.class_id}>{cls.name}</option>
                )
            });
        }
    }

    // List student's projects
    const listProjects = () => {
        if (!projects || Object.keys(projects).length == 0) {
            return <p id="noProject">Nu ai niciun proiect adăugat. Adaugă un proiect cu butonul de mai sus.</p>;
        } else {
            return (
                <Table style={{ color: 'white', textAlign: 'center' }}>
                    <thead>
                        <tr>
                            <th>Nume</th>
                            <th>Link</th>
                            <th>Starred</th>
                            <th>Materie</th>
                            <th>Observații</th>
                            <th>Ultimul update</th>
                            <th>Ultimul feedback</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            projects.map(project => {
                                if (project.starred)
                                    var star = <FontAwesomeIcon icon={faStar} style={{ color: '#ffff00' }} />;
                                else 
                                    var star = <FontAwesomeIcon icon={faRStar} />;

                                if (project.observations) var obs = project.observations;
                                else var obs = '-';
                            
                                return (
                                    <tr key={project.project_id}>
                                        <td>{project.name}</td>
                                        <td><a href={project.github_link} target="blank">{project.github_link}</a></td>
                                        <td>{star}</td>
                                        <td>{classes.filter(e => e.class_id = project.class_id)[0].name}</td>
                                        <td>{obs}</td>
                                        <td>{projectStatusText(project.outdatedProject)}</td>
                                        <td>{projectStatusText(project.outdatedFeedback)}</td>
                                        <td>
                                            <div className='d-flex gap-2'>
                                                <Button variant="danger" title="Șterge proiectul" onClick={deletionModal.bind(this, [project])} className="w-100">
                                                    <FontAwesomeIcon icon={faTrashCan} />
                                                </Button>
                                                <Button variant="success" title="Editează proiectul" onClick={editModal.bind(this, [project])} className="w-100">
                                                    <FontAwesomeIcon icon={faPen} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </Table>
            )
        }
    };

    // Post a project to the DB
    const postProject = async (event) => {
        handleClose();

        const postProjectAPI = async (projectData) => {
            return fetch(`${backendLink}/api/projects`, {
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
            student_id: userData.user_id,
            class_id: classes.filter(e => e.name = event.target.formProjectClass.value)[0].class_id,
            name: event.target.formProjectName.value,
            github_link: event.target.formProjectLink.value
        };
        await postProjectAPI(projectData);
        getStudentData();
    };

    // Set project to be deleted
    // and show the delete project modal
    const deletionModal = (project) => {
        setSelProject(project[0]);
        handleShow2();
    };

    // Delete a project from the DB
    const deleteProject = async () => {
        fetch(`${backendLink}/api/projects/${selProject.project_id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            credentials: 'include',
            method: 'DELETE'
        }).then((res) => res);

        handleClose2();
        getStudentData();
    };

    // Set project to be modified
    // and show the modify project modal
    const editModal = (project) => {
        setSelProject(project[0]);
        handleShow3();
    };

    // Modify a project from the DB
    const editProject = async (event) => {
        handleClose3();

        const editProjectAPI = async (projectData) => {
            return fetch(`${backendLink}/api/projects/${projectData.project_id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                credentials: 'include',
                method: 'PUT',
                body: JSON.stringify(projectData),
            }).then((res) => res);
        };

        const projectData = {
            student_id: userData.user_id,
            class_id: event.target.formProjectClass.value,
            name: event.target.formProjectName.value,
            github_link: event.target.formProjectLink.value
        };
        await editProjectAPI(projectData);
        getStudentData();
    }

    // Logout user
    const logout = async () => {
        fetch(`${backendLink}/api/auth/logout`, {
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            credentials: 'include',
            method: 'GET'
        }).then((res) => res);

        setLoggedIn(false);
    }

    // Modals and main element
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
                            <Form.Group controlId="formProjectClass" style={{ marginTop: '1em' }}>
                                <Form.Label>Materia proiectului</Form.Label>
                                <Form.Select defaultValue={"placeholder"}>
                                    <option value="placeholder" disabled>Selectează materia</option>
                                    {listClasses()}
                                </Form.Select>
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
                        Ești sigur că vrei să ștergi proiectul {''} <span style={{ fontWeight: 'bold' }}>{selProject.name}</span>?
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

                <Modal show={show3} onHide={handleClose3} centered backdrop="static">
                    <Modal.Header closeButton>
                        <Modal.Title>Modifică datele proiectului</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form id="editProjectForm" onSubmit={editProject}>
                            <Form.Group controlId="formProjectId" hidden>
                                <Form.Control value={selProject.project_id} readOnly></Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formProjectName">
                                <Form.Label>Numele proiectului</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Introdu numele (max. 50 de litere)"
                                    defaultValue={selProject.name}
                                    required
                                ></Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formProjectLink" style={{ marginTop: '1em' }}>
                                <Form.Label>Link-ul proiectului (GitHub)</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="https://github.com/username/proiect"
                                    required
                                    defaultValue={selProject.github_link}
                                    pattern="https:\/\/github.com\/[A-Za-z0-9]+\/.+"
                                ></Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formProjectClass" style={{ marginTop: '1em' }}>
                                <Form.Label>Materia proiectului</Form.Label>
                                <Form.Select defaultValue={"placeholder"}>
                                    <option value="placeholder" disabled>Selectează materia</option>
                                    {listClasses()}
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

                <h1>Salut, {userData.last_name}!</h1>
                <div id="projectsDiv">
                    <h2>Proiectele tale</h2>
                    <Button variant="primary" onClick={handleShow} title="Adaugă un proiect">
                        <FontAwesomeIcon icon={faPlus} /> Proiect
                    </Button>
                    <hr></hr>
                    {listProjects()}
                </div>

                <Button variant='danger' onClick={logout}>Delogare</Button>
            </div>
        );
    }
}
