import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyRole } from '../service/authService';  
import LoadingScreen from '../components/loadingScreen';


const PrivateRouteAdmin = ({ children }) => {
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const verify = async () => {
            try {
                const response = await verifyRole();
                if (response.Role === 'Admin') {
                    setVerified(true);
                }
            } catch (error) {
                console.error("Role verification failed:", error);
            } finally {
                setLoading(false);
            }
        };

        verify();
    },[]);

    if (loading) {
        return <LoadingScreen/>  
    }

    return verified ? children : (navigate('/login'), null);
};

export default PrivateRouteAdmin;
