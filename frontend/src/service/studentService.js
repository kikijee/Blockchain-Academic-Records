import axios from 'axios';
import config from '../config/frontend.config'


const API_URL = config.SERVER_URL 

const studentAxios = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    "withCredentials": true
});

export async function getInstitutions(body) {
    try {
        const response = await studentAxios.get('student/get-institutions')
        return response.data
    } catch (error) {
        console.error("Error during GET for institutions:", error.response.data.message);
        return error.response;
    }
}

export async function getRecords() {
    try {
        const response = await studentAxios.get('student/find-record-by-studentid')
        return response.data
    } catch (error) {
        console.log("Error from userService: ", error.response.data.message)
        return error.response;
    }
}

export async function requestRecord(body) {
    try {
        const response = await studentAxios.post('student/request-record', {
            UserID: body.UserID,
            InstitutionID: body.InstitutionID,
            Description: body.Description,
            RecordType: body.RecordType,
            Status: "Pending School" //Always this value when created
        })
        return response
    } catch (error) {
        console.error("Error during POST for record request:", error.response.data.message);
        return error.response;
    }
}


export async function getPendingRecordsByStudentID(body) {
    try {
        const response = await studentAxios.get('student/pending-records')
        return response.data
    } catch (error) {
        console.error("Error during GET for pending records:", error.response.data.message);
        return error.response;
    }
}

export async function deletePendingRecord(body) {
    try {
        const response = await studentAxios.delete(`student/delete-pending-record/${body.id}`)
        return response.data
    } catch (error) {
        console.error("Error during DELETE for pending records:", error.response.data);
        return error.response;
    }
}


export async function updatePendingRecord(body) {
    try {
        const response = await studentAxios.put('student/resend-pending-record', {
            PendingRecordID: body.PendingRecordID,
            Description: body.Description,
            RecordType: body.RecordType,
            Status: "Pending School" //Always this value when created
        })
        return response
    } catch (error) {
        console.error("Error during update for pending records:", error.response.data);
        return error.response;
    }
}
