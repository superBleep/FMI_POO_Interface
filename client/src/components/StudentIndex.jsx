import { Octokit } from '@octokit-next/core';
import { React, useEffect, useState } from 'react';
import '../css/StudentIndex.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { faStar as faRStar } from '@fortawesome/free-regular-svg-icons';

const backendLink = `http://${import.meta.env.VITE_DOMAIN}:${import.meta.env.VITE_BACKEND_PORT}`;
const octokit = new Octokit({
    auth: import.meta.env.GITHUB_TOKEN
});

function outdatedColor(nrDays) {
    if(nrDays) {
        let dayPercent = 255 * 0.1;
        let red = 0, green = 255;
    
        red += Math.round(nrDays * dayPercent);
        green -= Math.round(nrDays * dayPercent);
    
        if(red > 255)
            red = 255
        if(green < 0)
            green = 0
    
        red = red.toString(16).padStart(2, '0');
        green = green.toString(16).padStart(2, '0');

        let colorString = ['#', red, green, '00'].join('');
        return {backgroundColor: colorString, color: 'black'};
    }
    else
        return {backgroundColor: '#00FF00', color: 'black'};
}

async function getGitHubData(userProjects) {
    userProjects.map(project => {
        Object.assign(project, {
            starred: false,
            outdated: 0
        });
    })

    let newProjects = userProjects.map(async project => {
        const matches = (project.github_link).matchAll(".*\/(.*)\/(.*)").next().value;
        let owner = matches[1];
        let repo = matches[2];

        let allStarred = (await octokit.request(`GET /repos/${owner}/${repo}/stargazers`, {
            owner: owner,
            repo: repo,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        })).data;

        let defaultBranch = (await octokit.request(`GET /repos/${owner}/${repo}`, {
            owner: owner,
            repo: repo,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        })).data.default_branch;
        let commentsURL = (await octokit.request(`GET /repos/${owner}/${repo}/branches/${defaultBranch}`, {
            owner: owner,
            repo: repo,
            branch: defaultBranch,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        })).data.commit.comments_url;
        let comments = (await octokit.request(`GET ${commentsURL}`)).data;
        let commentDate = new Date(comments[comments.length - 1].updated_at);
        let currentDate = new Date();
        project.outdated = Math.round((currentDate.getTime() - commentDate.getTime()) / (1000 * 3600 * 24));

        for(let user of allStarred) {
            if(user.login == 'mcmarius') // hardcoded!!!
                project.starred = true;
        }

        return project;
    })

    return await Promise.all(newProjects);
}

export default function StudentIndex() {
    const [userData, setUserData] = useState();
    const [studentProjects, setStudentProjects] = useState();
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [toDelete, setToDelete] = useState('blank');

    const [change, setChange] = useState(false);

    useEffect(() => {
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
                const resp = await fetch(`${backendLink}/api/projects/${asyncUserData.user_id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    mode: 'cors',
                    credentials: 'include',
                    method: 'GET'
                });

                let userProjects = {};
                if (resp.status == 200) {
                    userProjects = await getGitHubData(await resp.json());
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

    const listProjects = () => {
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
                        {
                            studentProjects.map(project => {
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
                                        <td>{obs}</td>
                                        <td>
                                            <div id="outdated" style={outdatedColor(9)}>
                                                <span>{project.outdated} zile</span>
                                            </div>
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
                            })
                        }
                    </tbody>
                </Table>
            );
        }
    };

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
            user_id: userData.user_id,
            name: event.target.formProjectName.value,
            github_link: event.target.formProjectLink.value,
            class_id: event.target.formProjectClass.value
        };
        change ? setChange(false) : setChange(true);
        await postProjectAPI(projectData);
    };

    const deletionModal = (project) => {
        setToDelete(project[0]);
        handleShow2();
    };

    const deleteProject = async () => {
        fetch(`${backendLink}/api/projects/${toDelete.project_id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            credentials: 'include',
            method: 'DELETE'
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
                            <Form.Group controlId="formProjectClass" style={{ marginTop: '1em' }}>
                                <Form.Label>Materia proiectului</Form.Label>
                                <Form.Select>
                                    <option>Selectează materia</option>
                                    <option value="abd1cf1e-14ae-4934-91df-60aeb747bed9">POO</option>
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
                        Ești sigur că vrei să ștergi proiectul {''} <span style={{ fontWeight: 'bold' }}>{toDelete.name}</span>?
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

                <h1>Salut, {userData.last_name}!</h1>
                <div id="projectsDiv">
                    <h2>Proiectele tale</h2>
                    <Button variant="primary" onClick={handleShow} title="Adaugă un proiect">
                        <FontAwesomeIcon icon={faPlus} /> Proiect
                    </Button>
                    <hr></hr>
                    {listProjects()}
                </div>
            </div>
        );
    }
}
