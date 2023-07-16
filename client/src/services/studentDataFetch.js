import getGitHubData from './githubAPI.js';
import { backendLink } from './constants.js';

export async function getStudentData() {
    const resp = await fetch(`${backendLink}/api/users/current-user`, {
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'include',
        method: 'GET',
    });
    
    return (await resp.json()).userData;
}

export async function getStudentProjects(student_id) {
    const resp = await fetch(`${backendLink}/api/students/${student_id}/projects`, {
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'include',
        method: 'GET'
    });

    return await getGitHubData(await resp.json(), student_id);
}

export async function getStudentClasses(student_id) {
    const resp = await fetch(`${backendLink}/api/students/${student_id}/classes`, {
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'include',
        method: 'GET'
    });

    return await resp.json();
}