import { useState, useEffect } from 'react';
import '../../css/StudentIndex.css';
import { getStudentData, getStudentProjects, getStudentClasses } from '../../services/studentDataFetch.js';
import { listStudentProjects } from '../../services/studentProjects.jsx';
import hash from 'object-hash';
import Button from 'react-bootstrap/esm/Button.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import AddProject from '../student/AddProject';

export default function StudentIndex({ setLoggedIn }) {
    const [studentData, setStudentData] = useState({});
    const [studentProjects, setStudentProjects] = useState({});
    const [studentClasses, setStudentClasses] = useState({});

    const [showAdd, setShowAdd] = useState(false); // add project modal

    const hCloseAdd = () => setShowAdd(false);
    const hShowAdd = () => setShowAdd(true);

    useEffect(() => {
        const asf1 = async() => {setStudentData(await getStudentData())}
        const asf2 = async() => {setStudentProjects(await getStudentProjects(studentData.student_id))}
        const asf3 = async() => {setStudentClasses(await getStudentClasses(studentData.student_id))}

        asf1();
        asf2();
        asf3();

        console.log(studentProjects)
    }, [hash(studentData), hash(studentProjects), hash(studentClasses)]);

    return (        
        <div id='studentIndex' className='text-white'>
            <AddProject studentClasses={studentClasses} show={showAdd} handleClose={hCloseAdd} handleShow={hShowAdd} studentId={studentData.student_id} />

            <h1>Salut, {studentData.last_name}!</h1>

            <div id='projectsDiv'>
                <h2>Proiectele tale</h2>
                <Button variant='primary' title='Adaugă un proiect' onClick={hShowAdd}>
                    <FontAwesomeIcon icon={faPlus} /> Proiect
                </Button>
                <hr />
                {listStudentProjects(studentProjects)}
            </div>
        </div>
    );
}