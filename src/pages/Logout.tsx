import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';

const Logout = () => {

    const { logout } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        logout();
        navigate('/login');
    });

    return ( <></> )
};

export default Logout;