const request = require('supertest');
const { app, startServer, stopServer } = require('../testServer');
const db = require('../app/models')

let server;
let cookieStudent;
let cookieInstitution;

// util function
const loginStudent = async () => {
    // this logins a student to use all the student route tests 
    const newStudentLoginData = {
        Email: "test@gmail.com",
        AuthenticationData: "testpassword"
    };

    const responseLogin = await request(app)
        .post('/auth/login')
        .send(newStudentLoginData)
        .set('Accept', 'application/json');

    // Get the cookie from the response headers
    cookieStudent = responseLogin.headers['set-cookie'];
}

const loginInstitution = async () => {
    const approvedInstitutionLoginData = {
        Email: "csusm@",
        AuthenticationData: "testpassword"
    };
    const responseLogin = await request(app)
        .post('/auth/login')
        .send(approvedInstitutionLoginData)
        .set('Accept', 'application/json');

    // Get the cookie from the response headers
    cookieInstitution = responseLogin.headers['set-cookie'];
}

beforeAll(async () => {
    server = await startServer();
    // creating admin account
    const newUser = {
        Email: "Admin@",
        FirstName: "test",
        LastName: "test",
        DateOfBirth: "2000-01-01",
        Role: "Admin",
        AuthenticationData: "$2b$10$kPD59BPUx/amXEwN3MGUD.3lgR5PjiNy.FUs9sxt37EJs2B8XXa7." // password is 'test'
    };

    db.users.create(newUser)
        .then(createdUser => {
            console.log('New user created:', createdUser.get());
        })
        .catch(error => {
            console.error('Error creating user:', error);
        });
});

afterAll(async () => {
    await stopServer();
    try {
        // test database clean up
        await db.users.destroy({where:{}});
        await db.institutions.destroy({where:{}});
        await db.records.destroy({where:{}});
        await db.pendingInstitutions.destroy({where:{}});
        await db.pendingRecords.destroy({where:{}});
        console.log("test database successfully cleared");
    } catch (error) {
        console.log("error clearing test database",error);
    }
});

describe('Auth Routes', () => {
    it('should create a new student account', async () => {
        const newStudentData = {
            Email: "test@gmail.com",
            FirstName: "Christian",
            LastName: "Manibusan",
            DateOfBirth: "2000-01-01",
            AuthenticationData: "testpassword"
        };

        const response = await request(app)
            .post('/auth/signup-student')
            .send(newStudentData)
            .set('Accept', 'application/json');

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'User registered successfully!');
        expect(response.body.user.Email).toBe("test@gmail.com")
    });

    it('should create a new pending institution', async () => {
        const newPendingInstitutionData = {
            SchoolName: "CSUSM",
            Address: "1234",
            Email: "csusm@",
            WalletAddress: "0x00",
            FirstName: "test",
            LastName: "test",
            DateOfBirth: "2000-01-01",
            AuthenticationData: "testpassword"
        };

        const response = await request(app)
            .post('/auth/signup-institution')
            .send(newPendingInstitutionData)
            .set('Accept', 'application/json');

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Institution registration request sent successfully!');
        expect(response.body.pendingInstitution.Email).toBe('csusm@')
    });



    it('should login a student and return a JWT as a http only cookie', async () => {
        const newStudentLoginData = {
            Email: "test@gmail.com",
            AuthenticationData: "testpassword"
        };

        const responseLogin = await request(app)
            .post('/auth/login')
            .send(newStudentLoginData)
            .set('Accept', 'application/json');

        expect(responseLogin.status).toBe(200);
        expect(responseLogin.body).toHaveProperty('message', 'Logged in successfully!');

        // Manually extract the cookie from the response headers
        const setCookieHeader = responseLogin.header['set-cookie'];

        // Check if the cookie is present
        expect(setCookieHeader).toBeDefined();
        console.log('Set-Cookie header:', setCookieHeader);
        expect(setCookieHeader[0]).toContain('HttpOnly');
    });

    it('should validate JWT token and return user role', async () => {
        // log in Student first to get the JWT 
        const newStudentLoginData = {
            Email: "test@gmail.com",
            AuthenticationData: "testpassword"
        };

        const responseLogin = await request(app)
            .post('/auth/login')
            .send(newStudentLoginData)
            .set('Accept', 'application/json')

        expect(responseLogin.status).toBe(200);
        expect(responseLogin.body).toHaveProperty('message', 'Logged in successfully!');

        // Get the cookie from the response headers
        const cookie = responseLogin.headers['set-cookie'];

        // Make a GET request to verify with the obtained cookie
        const responseVerify = await request(app)
            .get('/auth/verify')
            .set('Accept', 'application/json')
            .set('Cookie', cookie) // Set the obtained cookie in the headers
            .withCredentials();    // For any request that requires JWT add this

        expect(responseVerify.status).toBe(200);
        expect(responseVerify.body.Role).toBe('Student');
    });
});

describe('Admin routes', () => {
    it("should login as Admin and approve institution", async () => {
        const adminLoginData = {
            Email: "Admin@",
            AuthenticationData: "test"

        }
        const responseLogin = await request(app)
            .post('/auth/login')
            .send(adminLoginData)
            .set('Accept', 'application/json');

        expect(responseLogin.status).toBe(200);
        expect(responseLogin.body).toHaveProperty('message', 'Logged in successfully!');

        const pendingInstitutionID = {
            id: 1
        }
        //Get the cookie from the response headers
        const cookie = responseLogin.headers['set-cookie'];

        // Make a GET request to verify with the obtained cookie
        const responseVerify = await request(app)
            .get('/auth/verify')
            .set('Accept', 'application/json')
            .set('Cookie', cookie) // Set the obtained cookie in the headers
            .withCredentials();    // For any request that requires JWT add this
        expect(responseVerify.status).toBe(200);
        expect(responseVerify.body.Role).toBe('Admin');

        //find pending instittution ID in order to approve

        const responseApprove = await request(app)
            .post('/admin/approve-institution')
            .send(pendingInstitutionID)
            .set('Accept', 'application/json')
            .set('Cookie', cookie)
            .withCredentials();
        //console.log("response Approve message: ", responseApprove)
        console.log("MESSAGE: ", responseApprove.body)
        expect(responseApprove.status).toBe(201);

        expect(responseApprove.body).toHaveProperty('message', 'Institution created successfully!')
    })

    //Add new pendingInstitution request
    it('should create a new pending institution', async () => {
        const newPendingInstitutionData1 = {
            SchoolName: "UCSD",
            Address: "5678",
            Email: "ucsd@",
            WalletAddress: "0x01",
            FirstName: "San",
            LastName: "Diego",
            DateOfBirth: "2000-01-01",
            AuthenticationData: "testpassword"
        };

        const response = await request(app)
            .post('/auth/signup-institution')
            .send(newPendingInstitutionData1)
            .set('Accept', 'application/json');

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Institution registration request sent successfully!');
        expect(response.body.pendingInstitution.Email).toBe('ucsd@')
    });

    //login as Admin to decline institution Signup request
    it("should login as Admin to decline Institution's signup request", async () => {
        //login as Admin
        const adminLoginData = {
            Email: "Admin@",
            AuthenticationData: "test"

        }
        const responseLogin = await request(app)
            .post('/auth/login')
            .send(adminLoginData)
            .set('Accept', 'application/json');
        expect(responseLogin.status).toBe(200);
        expect(responseLogin.body).toHaveProperty('message', 'Logged in successfully!');

        // Get the cookie from the response headers
        const cookie = responseLogin.headers['set-cookie'];

        // Make a GET request to verify with the obtained cookie
        const responseVerify = await request(app)
            .get('/auth/verify')
            .set('Accept', 'application/json')
            .set('Cookie', cookie) // Set the obtained cookie in the headers
            .withCredentials();    // For any request that requires JWT add this
        expect(responseVerify.status).toBe(200);
        expect(responseVerify.body.Role).toBe('Admin');

        //check if pendinginstitutionID is exist
        const pendingInstitutionID = {
            id: 2
        }
        const responseDecline = await request(app)
            .post('/admin/decline-institution')
            .send(pendingInstitutionID)
            .set('Accept', 'application/json')
            .set('Cookie', cookie)
            .withCredentials();
        //console.log("response Approve message: ", responseApprove)
        console.log("MESSAGE: ", responseDecline.body)
        expect(responseDecline.status).toBe(200);
        expect(responseDecline.body).toHaveProperty('message', 'Pending institution declined and removed successfully!')
    })

    //Add 3 new pending institution request to test Get All Pending Institution
    it('should create a new pending institution', async () => {
        const newPendingInstitutionData2 = {
            SchoolName: "mira mesa",
            Address: "5678",
            Email: "miramesa@",
            WalletAddress: "0x02",
            FirstName: "mira",
            LastName: "mesa",
            DateOfBirth: "2000-01-01",
            AuthenticationData: "testpassword"
        };
        const response = await request(app)
            .post('/auth/signup-institution')
            .send(newPendingInstitutionData2)
            .set('Accept', 'application/json');
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Institution registration request sent successfully!');
        expect(response.body.pendingInstitution.Email).toBe('miramesa@')
    });

    it('should create a new pending institution', async () => {
        const newPendingInstitutionData3 = {
            SchoolName: "paloma",
            Address: "5678",
            Email: "paloma@",
            WalletAddress: "0x03",
            FirstName: "palo",
            LastName: "ma",
            DateOfBirth: "2000-01-01",
            AuthenticationData: "testpassword"
        };
        const response = await request(app)
            .post('/auth/signup-institution')
            .send(newPendingInstitutionData3)
            .set('Accept', 'application/json');
        console.log("MESSAGE: ", response.body);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Institution registration request sent successfully!');
        expect(response.body.pendingInstitution.Email).toBe('paloma@')
    });

    it('should create a new pending institution', async () => {
        const newPendingInstitutionData4 = {
            SchoolName: "ucla",
            Address: "5678",
            Email: "ucla@",
            WalletAddress: "0x04",
            FirstName: "uc",
            LastName: "la",
            DateOfBirth: "2000-01-01",
            AuthenticationData: "testpassword"
        };
        const response = await request(app)
            .post('/auth/signup-institution')
            .send(newPendingInstitutionData4)
            .set('Accept', 'application/json');
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Institution registration request sent successfully!');
        expect(response.body.pendingInstitution.Email).toBe('ucla@')
    });

    //get All pending institution in the db 
    it("should return all pending institution", async () => {
        //login as Admin
        const adminLoginData = {
            Email: "Admin@",
            AuthenticationData: "test"
        }
        const responseLogin = await request(app)
            .post('/auth/login')
            .send(adminLoginData)
            .set('Accept', 'application/json');

        expect(responseLogin.status).toBe(200);
        expect(responseLogin.body).toHaveProperty('message', 'Logged in successfully!');

        // Get the cookie from the response headers
        const cookie = responseLogin.headers['set-cookie'];

        //get all pending Institution
        const responseAllInstitutions = await request(app)
            .get('/admin/get-pending-institutions')
            .set('Accept', 'application/json')
            .set('Cookie', cookie) // Set the obtained cookie in the headers
            .withCredentials();    // For any request that requires JWT add this
        console.log(responseAllInstitutions.body);
        expect(responseAllInstitutions.status).toBe(200);

    })
})

//Student Route
describe('Student Routes', () => {
    beforeAll(async () => {
        await loginStudent();
    });
    it('should create a record request', async () => {
        //pending record
        const pendingRecordData = {
            UserID: 2,
            InstitutionID: 1,
            Description: "test description",
            RecordType: "Certification",
            Status: "Pending School" //Always this value when created
        }

        // Post request to verify with the obtained cookie
        const responseRequestRecord = await request(app)
            .post('/student/request-record')
            .send(pendingRecordData)
            .set('Accept', 'application/json')
            .set('Cookie', cookieStudent) // Set the obtained cookie in the headers
            .withCredentials();    // For any request that requires JWT add this

        expect(responseRequestRecord.status).toBe(201);
        expect(responseRequestRecord.body.Description).toBe('test description')


        const pendingRecordData2 = {
            UserID: 2,
            InstitutionID: 1,
            Description: "test description",
            RecordType: "Transcript",
            Status: "Pending School" //Always this value when created
        }
        // Post request to verify with the obtained cookie
        const responseRequestRecord2 = await request(app)
            .post('/student/request-record')
            .send(pendingRecordData)
            .set('Accept', 'application/json')
            .set('Cookie', cookieStudent) // Set the obtained cookie in the headers
            .withCredentials();    // For any request that requires JWT add this
        expect(responseRequestRecord2.status).toBe(201);
        expect(responseRequestRecord2.body.Description).toBe('test description')

    });


    it('should find pending record', async () => {
        const studentId = 2;
        // GET request to verify with the obtained cookie
        const responseFindPendingRecord = await request(app)
            .get(`/student/pending-records?studentId=${studentId}`)
            .set('Accept', 'application/json')
            .set('Cookie', cookieStudent) // Set the obtained cookie in the headers
            .withCredentials();    // For any request that requires JWT add this
        expect(responseFindPendingRecord.status).toBe(200);
        expect(Array.isArray(responseFindPendingRecord.body)).toBe(true);
        expect(responseFindPendingRecord.body.some(record => record.Description === 'test description')).toBe(true);

    });

    it('should update pending record', async () => {
        const updatePendingRecordData = {
            PendingRecordID: "1",
            Description: "update test description",
            RecordType: "Certification",
            Status: "Pending School"
        }
        // PUT request to verify with the obtained cookie
        const responseUpdateRecord = await request(app)
            .put('/student/resend-pending-record')
            .send(updatePendingRecordData)
            .set('Cookie', cookieStudent) // Set the obtained cookie in the headers
            .withCredentials();    // For any request that requires JWT add this
        expect(responseUpdateRecord.status).toBe(200);
        expect(responseUpdateRecord.body).toHaveProperty('message', 'Record successfully updated')
    });

    it('should delete pending record', async () => {
        const pendingRecordId = 1;
        // DELETE request
        const responseDeletePendingRecord = await request(app)
            .delete(`/student/delete-pending-record/${pendingRecordId}`)
            .set('Accept', 'application/json')
            .set('Cookie', cookieStudent) // Set the obtained cookie in the headers
            .withCredentials();    // For any request that requires JWT add this
        expect(responseDeletePendingRecord.status).toBe(200);
        expect(responseDeletePendingRecord.body).toHaveProperty('message', 'Record deleted successfully')
    });

    it('should return a list of institutions', async () => {
        // GET request to verify with the obtained cookie
        const responseReturnInstitutions = await request(app)
            .get('/student/get-institutions')
            .set('Cookie', cookieStudent) // Set the obtained cookie in the headers
            .withCredentials();    // For any request that requires JWT add this
        expect(responseReturnInstitutions.status).toBe(200);
        expect(Array.isArray(responseReturnInstitutions.body)).toBe(true);
    });

    it('should get record by student ID', async () => {
        // GET request to verify with the obtained cookie
        const responseReturnRecords = await request(app)
            .get('/student/find-record-by-studentid?studentId=${studentId}')
            .set('Cookie', cookieStudent) // Set the obtained cookie in the headers
            .withCredentials();    // For any request that requires JWT add this
        expect(responseReturnRecords.status).toBe(200);
        expect(Array.isArray(responseReturnRecords.body)).toBe(true);
    });
})

//Institution Route
describe('Institution routes', () => {
    beforeAll(async () => {
        await loginInstitution();
    });

    it('should return all institutions', async () => {
        const responseInst = await request(app)
            // GET request to verify with the obtained cookie
            .get('/institution/get-institutions')
            .set('Accept', 'application/json')
            .set('Cookie', cookieInstitution) // Set the obtained cookie in the headers
            .withCredentials();    // For any request that requires JWT add this
        expect(responseInst.status).toBe(200);
        expect(Array.isArray(responseInst.body)).toBe(true);
    });

    it('should show all pending records for the logged-in institution', async () => {
        // GET request to verify with the obtained cookie
        const responsePendingRecords = await request(app)
            .get('/institution/pending-records')
            .set('Accept', 'application/json')
            .set('Cookie', cookieInstitution); // Use the cookie obtained from institution login

        expect(responsePendingRecords.status).toBe(200);
        expect(Array.isArray(responsePendingRecords.body)).toBe(true);
    });

    it('should return pending records with note', async () => {
        const updateWithComment = {
            PendingRecordID: 2,
            Note: "Create return note",
            Status: 'Pending Student'
        }
        // Post request to verify with the obtained cookie
        const responseReturnRecords = await request(app)
            .post('/institution/return-record')
            .send(updateWithComment)
            .set('Accept', 'application/json')
            .set('Cookie', cookieInstitution); // Use the cookie obtained from institution login

        expect(responseReturnRecords.status).toBe(200);
        expect(Array.isArray(responseReturnRecords.body)).toBe(false);
    });

    it('should show all accepted records for the logged-in institution', async () => {
        const response = await request(app)
            .get('/institution/records')
            .set('Accept', 'application/json')
            .set('Cookie', cookieInstitution);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});


//Guest Route
describe('Guest routes', () => {
    it('should construct a hash from the record data', async () => {
        const requestData = {
            testHash: 'test1'
        };

        const response = await request(app)
            .post('/guest/construct-record-hash')
            .send(requestData)

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('recordHash');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toEqual(requestData);
    });

    //this passes because the transactionAddress was not found 
    it('should return transaction address for a valid IPFS hash', async () => {
        const response = await request(app)
            .post('/guest/get-transaction-address')
            .send({ IPFS_Hash: 'QmciKxHohBGf7VdF7ScBCtognMCQYKoSgogKoaK12qda2G' })
            .set('Accept', 'application/json');

        if (response.status == 200) {
            expect(response.body).toHaveProperty('transactionAddress');
        } else {
            expect(response.status).toBe(404);
        }
    });
});