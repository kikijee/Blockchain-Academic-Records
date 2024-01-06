// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract BlockEdu{
    address owner;  // wallet address of admin
    mapping(address => bool) public institution_addresses;  // map of all signed up institutions
    mapping(bytes32 => bytes32) public studentRecord; // map of all students' data including ipfs hash

    // response struct used for return value of validate function
    struct Response{    
        bool valid;     // flag for if valid record
        bool updated;   // flag for if record is up to date
    }

    // test pure function
    function greet() public pure returns(string memory){
        return "HELLO";
    }

    //  would make more sense for this function to be named "add_student"?
    //  uses the hash as the key and value
    function add_record(bytes32 _hash) public {
        //if record is valid, add to studentRecord mapping
        require((institution_addresses[msg.sender] == true) || (msg.sender == owner));
        studentRecord[_hash] = "VALID";
    }

    function remove_record(bytes32 _hash) public {
        //remove hash from map by making entry empty (0x00)
        require((institution_addresses[msg.sender] == true) || (msg.sender == owner));
        studentRecord[_hash] = 0x00;
    }

    function update_record(bytes32 _oldHash, bytes32 _newHash) public{
        require((institution_addresses[msg.sender] == true) || (msg.sender == owner));
        studentRecord[_oldHash] = "OUTDATED";
        studentRecord[_newHash] = "VALID";
    }

    // constuctor is invoked once(when smart contract is deployed)
    // will set the 'owner' address of this contract
    constructor() {
        owner = msg.sender; // owner address will be the admin wallet address 
    }

    // this function will add a Institutions public wallet address to our institutionAddresses map
    // the function can ONLY be executed by the owner of the smart contract
    function add_institution(address _address) public {
        require(msg.sender == owner);   // check to see if the owner of this contract is the one calling the function
        institution_addresses[_address] = true; // creating key value pair of the institution wallet address and true indicating that they have been validated
    }

    function remove_institution(address _address) public{
        require(msg.sender == owner);
        institution_addresses[_address] = false;
    }

    function validate_record(bytes32 _hash) public view returns(Response memory){
            // case 1: record does not exist on blockchain
            if(studentRecord[_hash] == 0x00){return Response(false,false);} 
            // case 2: record exists on blockchain and is the most up to date version
            else if(studentRecord[_hash] == "VALID"){return Response(true,true);}
            // case 3: record exists on blockchain but not up to date
            else{return Response(true,false);}
        }

    // test to see if record is valid
    function checkStudentMap(bytes32 _hash) public view returns(bool){
        if(studentRecord[_hash] == "VALID"){
        return true;
        }
        return false;
    }

    // test to see if institution wallet address is valid
    function checkWalletAddress(address _a) public view returns(bool){
        return institution_addresses[_a];
    }
}