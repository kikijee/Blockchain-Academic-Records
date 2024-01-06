import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyRole } from '../service/authService';  

const PrivateRoute = ({ Role, children }) => {
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const verify = async () => {
            try {
                const response = await verifyRole();
                if (response.Message === "Role verified successfully!") {
                    setVerified(true);
                }
            } catch (error) {
                console.error("Role verification failed:", error);
            } finally {
                setLoading(false);
            }
        };

        verify();
    }, [Role]);

    if (loading) {
        return <div>Loading...</div>;  
    }

    return verified ? children : (navigate('/login'), null);
};

export default PrivateRoute;
