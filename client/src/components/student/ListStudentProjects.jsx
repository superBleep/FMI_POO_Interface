import Table from 'react-bootstrap/esm/Table.js';
import Button from 'react-bootstrap/esm/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faRStar } from '@fortawesome/free-regular-svg-icons';
import { faPen, faStar, faTrashCan, faCheck } from '@fortawesome/free-solid-svg-icons';

// Change bg color of time (in days)
// elapsed from the last professor comment
// on the latest commit (main branch)
export function outdatedColor(nrDays) {
    if(nrDays >= 0) {
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
    else if(nrDays == -1 || nrDays == -3 || nrDays == -2) {
        return {backgroundColor: '#A0A0A0', color: 'black'};
    } else
        return {backgroundColor: '#00FF00', color: 'black'};
}

// Set the project status based on time data
export function projectStatusText(time) {
    var text;

    switch(time) {
        case -1: // No comments on the repo
            text = <div className="outdated" style={outdatedColor(time)}>
                <span>Necomentat</span>
            </div>
            break;
        case -2: // Project is very old
            text = <div className="outdated" style={outdatedColor(time)}>
                prea vechi
            </div>
            break;
        case -3: // Outdated project / feedback
            text = <div className="outdated" style={{backgroundColor: '#00FF00'}}>
                <FontAwesomeIcon icon={faCheck} color='black'/>
            </div>
            break;
        default:
            text = <div className="outdated" style={outdatedColor(time)}>
                {time} zile
            </div>
            break;
    }

    return text;
}

export function ListStudentProjects(props) {
    // Return a message if there are no projects
    if(!Object.keys(props.projects).length)
        return <p id='noProject'>Nu ai niciun proiect adăugat. Adaugă un proiect cu butonul de mai sus.</p>;
    else return (
        <Table style={{ color: 'white', textAlign: 'center'}}>
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
                    props.projects.map(p => {
                        if(p.starred) var star = <FontAwesomeIcon icon={faStar} style={{ color: '#ffff00' }} />;
                        else var star = <FontAwesomeIcon icon={faRStar} />;

                        if(p.observations) var obs = p.observations;
                        else var obs = '-';

                        return (
                            <tr key={p.project_id}>
                                <td>{p.name}</td>
                                <td><a href={p.github_link} target='blank'>{p.github_link}</a></td>
                                <td>{star}</td>
                                <td>{props.studentClasses.filter(c => c.class_id = p.class_id)[0].name}</td>
                                <td>{obs}</td>
                                <td>{projectStatusText(p.outdatedProject)}</td>
                                <td>{projectStatusText(p.outdatedFeedback)}</td>
                                <td>
                                    <div className='d-flex gap-2'>
                                        <Button variant='danger' title='Șterge proiectul' className='w-100' onClick={() => {props.setSelectedProj(p); props.hShowDel();}}>
                                            <FontAwesomeIcon icon={faTrashCan} />
                                        </Button>
                                        <Button variant='success' title='Editează proiectul' className='w-100' onClick={() => {props.setSelectedProj(p); props.hShowUp();}}>
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