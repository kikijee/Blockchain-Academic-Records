# Developer Documentation
- [Server Side](https://github.com/cj-ledet/Blockchain-Education-Records/blob/main/DevReadMe.md#server-side)

## Server Side
- [How To Run](https://github.com/cj-ledet/Blockchain-Education-Records/blob/main/DevReadMe.md#how-to-run)
- [Configuration](https://github.com/cj-ledet/Blockchain-Education-Records/blob/main/DevReadMe.md#configuration)
- [Database Commands for Testing](https://github.com/cj-ledet/Blockchain-Education-Records/blob/main/DevReadMe.md#database-commands-for-testing)
- [Current Design](https://github.com/cj-ledet/Blockchain-Education-Records/blob/main/DevReadMe.md#current-design)
- [Endpoints](https://github.com/cj-ledet/Blockchain-Education-Records/blob/main/DevReadMe.md#endpoints)
- [JWT](https://github.com/cj-ledet/Blockchain-Education-Records/blob/main/DevReadMe.md#jwt)
- [Axios/Fetch Examples](https://github.com/cj-ledet/Blockchain-Education-Records/blob/main/DevReadMe.md#axiosfetch-call-structure-examples)
### How To Run:
- Navigate (cd) into the ```server``` directory on the terminal
- Run ```npm install``` to install all dependencies *for first time setup*
- Run ```npm run devStart``` to start the server
### Configuration:
- By default, the server runs on port 5000, you can change this in ```server/index.js```<br>
``` javascript
app.listen(5000,()=>{
    console.log("server has started on port 5000");
});
```
- In ```server/db.js``` is where the database connection options are <br>
```javascript
const pool = new Pool({
    user:"postgres",
    password:"root",
    host:"localhost",
    port: 5432,
    database:"blockteam"
})
```
*Important:* we will need to change this depending on the system that we are running the server on.<br>
- In ```server/.env``` contains the the environment variables ```ACCESS_TOKEN_SECRET``` and ```REFRESH_TOKEN_SECRET``` which is used to create and verify JWT tokens
### Database Commands For Testing:
- ```SELECT * FROM <table name>;```
- ```SELECT * FROM <table name> WHERE <attribute> = <value to match>;```
- ```DELETE FROM <table name>```
- ```DELETE FROM <table name> WHERE <attribute> = <value to match>```
- ```INSERT INTO <table name> (<Column Name 1>,<Column Name 2>,<Column Name n>) VALUES (<Value 1>,<Value 2>,<Value n>)```<br><br>
*Important:* If you are inserting into the ```password/authenticationdata``` column manually through the cmd be sure to hash the password string manually and pass that hash as the value<br><br>
  - You can achieve this by typing ```node``` into the console, and then running <br>```await require('bcrypt').hash("thePasswordYouWantToHash",10)``` this will return the hash string to store as password in the database
### Current Design:
#### User creation:
- Currently anyone can make a ```Student``` account, ```Institution``` accounts can be created aswell however must be approved by ```Admin``` accounts.
- To create an ```Admin``` account you must manually ```INSERT``` into the database
### Endpoints:
- [Auth](https://github.com/cj-ledet/Blockchain-Education-Records/blob/main/DevReadMe.md#auth)
- [User](https://github.com/cj-ledet/Blockchain-Education-Records/blob/main/DevReadMe.md#user)
#### Auth:

- [Auth/signUp](https://github.com/cj-ledet/Blockchain-Education-Records/blob/main/DevReadMe.md#httplocalhost5000authsignup)
- [Auth/login](https://github.com/cj-ledet/Blockchain-Education-Records/blob/main/DevReadMe.md#httplocalhost5000authlogin)
- [Auth/refresh_token](https://github.com/cj-ledet/Blockchain-Education-Records/blob/main/DevReadMe.md#httplocalhost5000authrefresh_token)
- [Auth/logout](https://github.com/cj-ledet/Blockchain-Education-Records/blob/main/DevReadMe.md#httplocalhost5000authlogout)
- [Auth/approve](https://github.com/cj-ledet/Blockchain-Education-Records/blob/main/DevReadMe.md#httplocalhost5000authapprove)

- #### ```http://localhost:5000/Auth/signUp```
  - |JWT?|Async?|Type|Who can access|Description|
    |---|---|---|---|---|
    |No|Yes|POST|Anyone|User creation|
  - Request Structure Example:<br>
      - body:
      
      *STUDENT*
      ```json
      {
          "email": "poop@gmail.com",
          "firstname": "Christian",
          "lastname": "Manibusan",
          "dateofbirth": "2000-01-01",
          "authenticationdata": "testpassword",
          "role": "Student"
      }
      ```
      *INSTITUTION*
      ```json
      { 
          "schoolname" :  "Cal State University San Marcos",
          "address" : "I forgot the address",
          "email" : "csusm.edu@gmail.com",
          "firstname" : "pp",
          "lastname" : "poopoo",
          "dateofbirth" : "2000-01-01",
          "authenticationdata" : "testpassword",
          "role": "Institution"
      }
      ```
      - headers:
      ```json
      "headers": {"Content-Type": "application/json"}
      ```
  - Response Structure Example:<br>
  
  *STUDENT*
  ```json
  {
      "user": {
          "userid": 11,
          "email": "mani@gmail.com",
          "firstname": "Christian",
          "lastname": "Manibusan",
          "dateofbirth": "2001-12-25T08:00:00.000Z",
          "authenticationdata": "$2b$10$D5o8uJx/MRSspFD2jlM4T.wA0pGH4T2vDbuSEhHkQ4x/ZqcYoaw4C",
          "role": "Student",
          "created_at": "2023-10-08T22:13:26.470Z"
      }
  }
  ```
  *INSTITUTION*
  ```json
  {
      "user": {
          "pendinginstitutionid": 3,
          "schoolname": "Cal State Long Beach",
          "address": "I forgot the address",
          "email": "LB.edu@gmail.com",
          "firstname": "pp",
          "lastname": "poopoo",
          "dateofbirth": "2000-01-01T08:00:00.000Z",
          "authenticationdata": "$2b$10$E/7KA58UJE1LiCBj12qk6.oBU6JQ19VLZ8wE7tTRZd2QIgx2NB3AG",
          "created_at": "2023-10-08T22:22:04.811Z"
      }
  }
  ```
- #### ```http://localhost:5000/Auth/login```
  - |JWT?|Async?|Type|Who can access|Description|
    |---|---|---|---|---|
    |No|Yes|POST|Anyone|User login|
  - Request Structure Example:<br>
      - body:
      ```json
      {
          "email": "poop@gmail.com",
          "authenticationdata": "testpassword"
      }
      ```
      - headers:
      ```json
      "headers": {"Content-Type": "application/json"}
      ```
  - Response Structure Example:<br>

  ```json
    {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjExLCJlbWFpbCI6Im1hbmlAZ21haWwuY29tIiwiZmlyc3RuYW1lIjoiQ2hyaXN0aWFuIiwibGFzdG5hbWUiOiJNYW5pYnVzYW4iLCJkYXRlb2ZiaXJ0aCI6IjIwMDEtMTItMjVUMDg6MDA6MDAuMDAwWiIsImF1dGhlbnRpY2F0aW9uZGF0YSI6IiQyYiQxMCRENW84dUp4L01SU3NwRkQyamxNNFQud0EwcEdINFQydkRidVNFaEhrUTR4L1pxY1lvYXc0QyIsInJvbGUiOiJTdHVkZW50IiwiY3JlYXRlZF9hdCI6IjIwMjMtMTAtMDhUMjI6MTM6MjYuNDcwWiIsImlhdCI6MTY5NjgwNDc4NX0.j3TEWzSxxq1Z4UpI7lvzAM_Rua6qsSRN-tRNFf12zek",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjExLCJlbWFpbCI6Im1hbmlAZ21haWwuY29tIiwiZmlyc3RuYW1lIjoiQ2hyaXN0aWFuIiwibGFzdG5hbWUiOiJNYW5pYnVzYW4iLCJkYXRlb2ZiaXJ0aCI6IjIwMDEtMTItMjVUMDg6MDA6MDAuMDAwWiIsImF1dGhlbnRpY2F0aW9uZGF0YSI6IiQyYiQxMCRENW84dUp4L01SU3NwRkQyamxNNFQud0EwcEdINFQydkRidVNFaEhrUTR4L1pxY1lvYXc0QyIsInJvbGUiOiJTdHVkZW50IiwiY3JlYXRlZF9hdCI6IjIwMjMtMTAtMDhUMjI6MTM6MjYuNDcwWiIsImlhdCI6MTY5NjgwNDc4NSwiZXhwIjoxNjk3NjY4Nzg1fQ.iJzi3LFlWJtsE-uPEAE5R4SOrkcgvt7xDe_wfpSlsio"
    }
  ```
  *Note:* These tokens contain the user information when decoded, Client-side functions when calling this endpoint need to save only the ```"accessToken"``` in either local storage or something else for easy access
- #### ```http://localhost:5000/Auth/refresh_token```
  - |JWT?|Async?|Type|Who can access|Description|
    |---|---|---|---|---|
    |No|No|GET|Only those who have a valid<br>Refresh Token in their<br>cookies header|Generates new Token<br>and Refresh Token|
- #### ```http://localhost:5000/Auth/logout```
  - |JWT?|Async?|Type|Who can access|Description|
    |---|---|---|---|---|
    |No|No|DELETE|Only those with<br>a valid Refresh Token<br>in their cookies|Deletes Refresh Token<br>in users cookies|
- #### ```http://localhost:5000/Auth/approve```
  - |JWT?|Async?|Type|Who can access|Description|
    |---|---|---|---|---|
    |Yes|Yes|POST|Admin|Approve pending<br>Institution accounts<br>and delete its pending entry|
  - Request Structure Example:<br>
      - body:
      ```json
      {
          "pendinginstitutionid":1
      }
      ```
      - headers:
      ```json
      "headers": {              
          "Authorization": "Bearer <userToken>"
          "Content-Type": "application/json"
      }
      ```

  - Response Structure Example:<br>
  ```json
  {
      "user": {
          "userid": 15,
          "email": "SD.edu@gmail.com",
          "firstname": "pp",
          "lastname": "poopoo",
          "dateofbirth": "2000-01-01T08:00:00.000Z",
          "authenticationdata": "$2b$10$GZTCFFxX1/X/k3/7BL0cEeuOLyQoXXfaX0WVzeSErDETA/LAlwTKC",
          "role": "Institution",
          "created_at": "2023-10-09T00:30:16.027Z"
      },
      "institution": {
          "institutionid": 4,
          "schoolname": "Cal State San Diego",
          "address": "I forgot the address",
          "userid": 15,
          "created_at": "2023-10-09T00:30:16.029Z"
      }
  }
  ```
#### User:

- [User/getUsers](https://github.com/cj-ledet/Blockchain-Education-Records/blob/main/DevReadMe.md#httplocalhost5000usergetusers)

- #### ```http://localhost:5000/User/getUsers```
    - |JWT?|Async?|Type|Who can access|Description|
      |---|---|---|---|---|
      |Yes|Yes|GET|Admin|Returns all users<br>in the database|
    - Request Structure Example:<br>
        - headers:
       ```json
       "headers":{               
           "Authorization": "Bearer <userToken>" 
       }
       ```
   - Response Structure Example:<br>
   ```json
   {
    "users": [
        {
            "userid": 13,
            "email": "poop@gmail.com",
            "firstname": "Christian",
            "lastname": "Manibusan",
            "dateofbirth": "2001-01-04T08:00:00.000Z",
            "authenticationdata": "$2b$10$0fhM07mVJJoVnSlRqrCLD.INb2wb8UV7gifPxZUds5vsYG6TmGWPG",
            "role": "Admin",
            "created_at": "2023-10-08T23:19:21.593Z"
        },
        {
            "userid": 14,
            "email": "LB.edu@gmail.com",
            "firstname": "pp",
            "lastname": "poopoo",
            "dateofbirth": "2000-01-01T08:00:00.000Z",
            "authenticationdata": "$2b$10$qE0z1IsKbZGYKaX5oECJ9.ZCxybg7QuLk7xf.kU13Rcg4MxuzIIzi",
            "role": "Institution",
            "created_at": "2023-10-08T23:20:11.744Z"
        },
        {
            "userid": 15,
            "email": "SD.edu@gmail.com",
            "firstname": "pp",
            "lastname": "poopoo",
            "dateofbirth": "2000-01-01T08:00:00.000Z",
            "authenticationdata": "$2b$10$GZTCFFxX1/X/k3/7BL0cEeuOLyQoXXfaX0WVzeSErDETA/LAlwTKC",
            "role": "Institution",
            "created_at": "2023-10-09T00:30:16.027Z"
        }
    ]
   }
   ```
### Records
- [Records/postRecord](https://github.com/cj-ledet/Blockchain-Education-Records/blob/main/DevReadMe.md#httplocalhost5000recordspostrecord)
- #### ```http://localhost:5000/Records/postRecord```
  - |JWT?|Async?|Type|Who can access|Description|
    |---|---|---|---|---|
    |Yes|Yes|POST|Institutions|post records using hash from<br>ipfs in DB with associated<br>student and institution|
    - Request Structure Example:<br>
        - headers:
       ```json
       "headers": {              
          "Authorization": "Bearer <userToken>"
          "Content-Type": "application/json"
      }
       ```
       - Request Structure Example:<br>
      - body:
      ```json
      {
          "userid": 5,
          "institutionid": 1,
          "ipfs_hash": "bd29und8fn2u843mfiugbrnropek0g3gimf237yu82nne9u30jgmp3oin3r",
      }
      ```
      - Response Structure Example:<br>
      - body:
      ```json
        {
            "user": {
                "recordid": 2,
                "userid": 5,
                "institutionid": 1,
                "ipfs_hash": "bd29und8fn2u843mfiugbrnropek0g3gimf237yu82nne9u30jgmp3oin3r",
                "created_at": "2023-10-17T00:39:07.663Z"
            }
        }
      ```
### JWT
#### What is JWT
- JWT, or JSON Web Token, is an open standard used to share security information between two parties — a client and a server. Each JWT contains encoded JSON objects, including a set of claims. JWTs are signed using a cryptographic algorithm to ensure that the claims cannot be altered after the token is issued.
- Example using an online [decoder](https://jwt.io/):
<img width="712" alt="Screenshot 2023-10-09 123840" src="https://github.com/cj-ledet/Blockchain-Education-Records/assets/84474876/99c97d97-f399-4f51-bde9-b3b0577ec9aa">

#### How to use it
- [Server Side](https://github.com/cj-ledet/Blockchain-Education-Records/blob/main/DevReadMe.md#server-side-1)
- [Client Side](https://github.com/cj-ledet/Blockchain-Education-Records/blob/main/DevReadMe.md#client-side)
##### Server side:
- Use the ```authenticateToken``` function located in ```server/utils/jwt-helpers.js``` as a middleware function on any endpoint that you want to secure.
- Example:
```javascript
/*The authenticate function used below will have access to the request sent in by the client, after validating the token
it will pass a user key-value pair in the request for the rest of the endpoint functionality to use*/
router.get('/getUsers',jwtHelper.authenticateToken,async(req,res)=>{ // using the authenticateToken function here
    try{                                                          
        if(req.user.role != 'Admin'){    // we can see the function using the 'user' key-value pair derived from the authenticateToken function
            return res.status(403).json({error:"Access Denied"});
        }
        const users = await pool.query('SELECT * FROM users');
        res.json({users: users.rows});
    } catch(error){
        res.status(500).json({error:error.message});
    }
})
```
- This not only creates a secure endpoint but also the ```authenticateToken``` function will pass on user information derived from the decoded JWT into the endpoint function's ```req``` object.
##### Client side:
- When using the [login end point](https://github.com/cj-ledet/Blockchain-Education-Records/blob/main/DevReadMe.md#httplocalhost5000authlogin) the result of the endpoint call will contain the JWT token ```accessToken``` the client-side must save this token somewhere for reuse in API calls and using a decoder function to retrieve information about the user's self.
###  Axios/Fetch call structure examples:
- The below example is the structure of what a ```axios``` GET call function should look like with the example of using the ```http://localhost:5000/User/getUsers``` endpoint
```javascript
function getUsers() {
    return new Promise((resolve,reject) =>{
        axios.get('http://localhost:5000/User/getUsers',
        {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Authorization": 'Bearer <JWT Token>'
            }
        }).then((response) => {
            resolve(response.data);
        })
        .catch((error) =>{
            console.log(error);
            reject(error);
        })
    });
}
```
- The below example is the structure of what a ```axios``` POST call function should look like with the example of using the ```http://localhost:5000/Auth/signUp``` endpoint
```javascript
async function signUp(){
     return await axios.post('http://localhost:5000/Auth/signUp',
     {
        "email": "<Some Value>",
        "firstname": "<Some Value>",
        "lastname": "<Some Value>",
        "dateofbirth": "<Some Value>",
        "authenticationdata": "<Some Value>",
        "role": "<Some Value>"
     },
     {
         headers:{
             "Content-Type": "application/json"
         }
     })
}
```
- This site has some pretty good axios call examples https://stackabuse.com/handling-errors-with-axios/


