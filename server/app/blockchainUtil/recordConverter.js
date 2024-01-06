const crypto = require('crypto');

// will rehash given record info into a 32 byte string representation
function convertRecordToHash(data){
    const jsonString = JSON.stringify(data);
    const hash = crypto.createHash('sha256').update(jsonString).digest('hex');
    const paddedHash = hash.padStart(64, '0'); // 32 bytes = 64 hex characters
      
    const finalHex = `0x${paddedHash}`;
    return finalHex;
}

module.exports ={convertRecordToHash}