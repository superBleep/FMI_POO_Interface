import { useState, useEffect } from 'react';
import '../../css/StudentIndex.css';
import { getStudentData, getStudentProjects, getStudentClasses } from '../../services/studentDataFetch.js';
import { ListStudentProjects } from '../student/ListStudentProjects.jsx';
import Button from 'react-bootstrap/esm/Button.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import AddProject from '../student/AddProject';
import DeleteProject from '../student/DeleteProject';
import UpdateProject from '../student/UpdateProject';
import { backendLink } from '../../services/constants';

export default function StudentIndex({ setLoggedIn }) {
    const [refresh, setRefresh] = useState(false);

    const [studentData, setStudentData] = useState({});
    const [studentProjects, setStudentProjects] = useState({});
    const [studentClasses, setStudentClasses] = useState({});

    // Add project modal
    const [showAdd, setShowAdd] = useState(false); 
    const hCloseAdd = () => setShowAdd(false);
    const hShowAdd = () => setShowAdd(true);
    
    // Slected project for deletion/update
    const [selectedProj, setSelectedProj] = useState({});

    // Delete project modal
    const [showDel, setShowDel] = useState(false);
    const hCloseDel = () => setShowDel(false);
    const hShowDel = () => setShowDel(true);

    // Update project modal
    const [showUp, setShowUp] = useState(false);
    const hCloseUp = () => setShowUp(false);
    const hShowUp = () => setShowUp(true);

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

    useEffect(() => {
        const asf1 = async() => {setStudentData(await getStudentData())}
        const asf2 = async() => {setStudentProjects(await getStudentProjects(studentData.student_id))}
        const asf3 = async() => {setStudentClasses(await getStudentClasses(studentData.student_id))}

        asf1();
        asf2();
        asf3();
    }, [refresh]);

    return (        
        <div id='studentIndex' className='text-white'>
            <AddProject refresh={refresh} setRefresh={setRefresh} studentId={studentData.student_id} studentClasses={studentClasses} show={showAdd} handleClose={hCloseAdd} handleShow={hShowAdd}  />
            <DeleteProject refresh={refresh} setRefresh={setRefresh} selectedProj={selectedProj} show={showDel} handleClose={hCloseDel} handleShow={hShowDel} />
            <UpdateProject refresh={refresh} setRefresh={setRefresh} studentId={studentData.student_id} studentClasses={studentClasses} selectedProj={selectedProj} show={showUp} handleClose={hCloseUp} handleShow={hShowUp} />

            <h1>Salut, {studentData.last_name}!</h1>

            <div id='projectsDiv'>
                <h2>Proiectele tale</h2>
                <Button variant='primary' title='Adaugă un proiect' onClick={hShowAdd}>
                    <FontAwesomeIcon icon={faPlus} /> Proiect
                </Button>
                <hr />
                <ListStudentProjects projects={studentProjects} studentClasses={studentClasses} setSelectedProj={setSelectedProj} hShowDel={hShowDel} hShowUp={hShowUp}/>
            </div>

            <Button variant='danger' onClick={logout}>Delogare</Button>
        </div>
    );
}