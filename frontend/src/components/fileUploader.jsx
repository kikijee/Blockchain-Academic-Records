import React from 'react';

export default function FileUploader({ onFileChange, recordId }) {
    return (
        <input
            type="file"
            accept=".pdf"
            onChange={(e) => onFileChange(e, recordId)}
        />
    );
}
