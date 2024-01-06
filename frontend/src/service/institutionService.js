import axios from 'axios';
import config from '../config/frontend.config'

const API_URL = config.SERVER_URL

const institutionAxios = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
});

// Error handling function
const handleError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error("Backend returned status code:", error.response.status);
    console.error("Response data:", error.response.data);
    return {
      isError: true,
      message: error.response.data?.message || 'An error occurred on the server.',
      status: error.response.status
    };
  } else if (error.request) {
    // The request was made but no response was received
    console.error("No response received:", error.request);
    return {
      isError: true,
      message: 'No response received from the server.',
      status: null
    };
  } else {
    // Something happened in setting up the request that triggered an error
    console.error('Error message:', error.message);
    return {
      isError: true,
      message: error.message,
      status: null
    };
  }
};

export async function getCompletedInstitutionRecords() {
  try {
    const response = await institutionAxios.get('/institution/records');

    if (response.data) {
      return { isError: false, data: response.data, status: response.status };
    } else {
      return { isError: true, message: 'Empty response from the server.', status: response.status };
    }
  } catch (error) {
    return handleError(error);
  }
}

export async function getInstitutionPendingRecords() {
  try {
    const response = await institutionAxios.get('/institution/pending-records');
    if (response.data) {
      return { isError: false, data: response.data, status: response.status };
    } else {
      return { isError: true, message: 'Empty response from the server.', status: response.status };
    }
  } catch (error) {
    return handleError(error);
  }
}

export async function completePendingRecord(recordId, file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('pendingRecordID', recordId);

  try {
    const response = await institutionAxios.post('/institution/upload-record', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    });
    return { isError: false, data: response.data, status: response.status };
  } catch (error) {
    return handleError(error);
  }
}

export async function returnInstitutionRecord(pendingRecordID, note) {
  try {
    const response = await institutionAxios.post('/institution/return-record', { PendingRecordID: pendingRecordID, Note: note });
    return { isError: false, data: response.data, status: response.status };
  } catch (error) {
    return handleError(error);
  }
}

// New functions for handling success or fail on blockchain request
export async function finalizeRecord(recordId, transactionAddress) {
  try {
    const response = await institutionAxios.post('/institution/finalize-record', {
      RecordID: recordId,
      TransactionAddress: transactionAddress
    });
    return { isError: false, data: response.data, status: response.status };
  } catch (error) {
    return handleError(error);
  }
}

export async function rollbackRecord(recordId) {
  try {
    const response = await institutionAxios.post('/institution/rollback-record', { PendingRecordID: recordId });
    return { isError: false, data: response.data, status: response.status };
  } catch (error) {
    return handleError(error);
  }
}
