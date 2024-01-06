import axios from 'axios';
import config from '../config/frontend.config';


const API_URL = config.SERVER_URL

const authAxios = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    "withCredentials": true // added this for local testing
});

async function signUpStudent(body) {
    try {
        const response = await authAxios.post('/auth/signup-student', {
            Email: body.Email,
            FirstName: body.FirstName,
            LastName: body.LastName,
            DateOfBirth: body.DateOfBirth,
            AuthenticationData: body.AuthenticationData
        });
        return response;
    } catch (error) {
        console.error("Error during student sign up:", error.response.data.message);
        return error.response;
    }
}

async function signUpInstitution(body) {
    try {
        const response = await authAxios.post('/auth/signup-institution', {
            SchoolName: body.SchoolName,
            Address: body.Address,
            Email: body.Email,
            WalletAddress: body.WalletAddress,
            FirstName: body.FirstName,
            LastName: body.LastName,
            DateOfBirth: body.DateOfBirth,
            AuthenticationData: body.AuthenticationData
        });
        return response;
    } catch (error) {
        console.error("Error during institution sign up:", error.response.data.message);
        return error.response;
    }
}

async function login(body) {
    try {
        const response = await authAxios.post('/auth/login', {
            Email: body.Email,
            AuthenticationData: body.AuthenticationData
        });

        if (response.status === 200 && response.data && response.data.User) {
            return response.data.User;
        } else {
            console.error("Unexpected server response:", response);
            throw new Error("Failed to log in. Unexpected response from server.");
        }

    } catch (error) {
        if (error.response) {
            console.error("Error response:", error.response.data);
            throw new Error(error.response.data.message || "Failed to log in. Please check your credentials.");
        } else if (error.request) {
            console.error("No response received:", error.request);
            throw new Error("Failed to log in. Server did not respond.");
        } else {
            console.error("Error setting up request:", error.message);
            throw new Error("Failed to log in. Please try again.");
        }
    }
}

async function logout() {
    try {
        sessionStorage.removeItem('user');
        const response = await authAxios.delete('/Auth/logout', { withCredentials: true });
        return response.message
    } catch (error) {
        console.log(error)
    }
}

// Exports directly here (don't need to add at the end to exports)
export const verifyRole = async () => {
    try {
        const response = await authAxios.get('/auth/verify', { withCredentials: true });

        return response.data;
    } catch (error) {
        console.error("Error verifying role:", error);
        throw error;
    }
};

async function approve(body) {
    try {
        const response = await authAxios.post('/admin/approve-institution', { id: body.pendinginstitutionid });
        return response.data;
    } catch (error) {
        console.error("Error during approval:", error);
        throw new Error("Failed to approve institution.");
    }
}

async function decline(body) {
    try {
        const response = await authAxios.post('/admin/decline-institution', { id: body.pendinginstitutionid });
        return response.data;
    } catch (error) {
        console.error("Error during declining:", error);
        throw new Error("Failed to decline institution.");
    }
}

async function getPendingInstitutions() {
    try {
        const response = await authAxios.get('/admin/get-pending-institutions');
        return response.data;
    } catch (error) {
        console.error("Error getting pending institutions:", error);
        throw new Error("Failed to retrieve pending institutions.");
    }
}

export {
    signUpStudent,
    signUpInstitution,
    login,
    logout,
    approve,
    decline,
    getPendingInstitutions
};
