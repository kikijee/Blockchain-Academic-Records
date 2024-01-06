import axios from 'axios';
import config from '../config/frontend.config'

const API_URL = config.SERVER_URL

const guestAxios = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    "withCredentials": true
});

export async function fetchRecord(body) {
    try {
        const response = await guestAxios.post('guest/fetch-record', body, {
            responseType: 'blob' // Handle PDF file stream
        });
        return response;
    } catch (error) {
        console.error("Error fetching record:", error.response?.data || error.message);
        throw error; // Propagate error for handling in component
    }
}

// api call to rehash record info
export async function getRecordHash(body) {
    try {
        console.log(body)
        const response = await guestAxios.post('guest/construct-record-hash', {
            FirstName: body.FirstName,
            LastName: body.LastName,
            DateOfBirth: body.DateOfBirth,
            IPFSHash: body.IPFS_Hash
        })
        return response
    } catch (error) {
        console.error("Error during rehashing record:", error.response.data);
        return error.response;
    }
}

export async function getRecordAddress(ipfsHash) {
    try {
        const response = await guestAxios.post('guest/get-transaction-address', {
            IPFS_Hash: ipfsHash
        })
        return response
    } catch (error) {
        console.error("Error during getting record transaction address:", error.response.data);
        return error.response;
    }
}
