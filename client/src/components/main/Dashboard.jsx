import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import StudentIndex from '../pages/StudentIndex';
import ProfessorIndex from '../pages/ProfessorIndex';
import { backendLink } from '../../services/constants';

export default function Dashboard({ loggedIn, setLoggedIn }) {
    const [userData, setUserData] = useState();

    if(loggedIn) {
        useEffect(() => {
            const getUserData = async() => {
                const resp = await fetch(`${backendLink}/api/users/current-user`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    mode: 'cors',
                    credentials: 'include',
                    method: 'GET',
                });
            
                let asyncUserData = Object.values(await resp.json())[1];
                if(asyncUserData)
                    setUserData(asyncUserData);
            } 
            getUserData();
        });
    
        if(userData) {
            if(userData['student_id']) return <StudentIndex setLoggedIn={setLoggedIn}/>;
            if(userData['professor_id']) return <ProfessorIndex setLoggedIn={setLoggedIn}/>;
        }
    }
}

Dashboard.propTypes = {
    setLoggedIn: PropTypes.func.isRequired,
};