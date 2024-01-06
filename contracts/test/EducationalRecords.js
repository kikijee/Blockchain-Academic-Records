const { expect } = require("chai");


describe("greet",function(){
    it("Should return the word HELLO",async function(){
        const BlockEdu = await ethers.getContractFactory("BlockEdu")
        const blockEdu = await BlockEdu.deploy();
        await blockEdu.deployed;

        expect(await blockEdu.greet()).to.equal("HELLO")
    })
})

describe("add record",function(){
    it("Should return true for record that is 'VALID' in studentInfo map",async function(){
    const BlockEdu = await ethers.getContractFactory("BlockEdu")
    const blockEdu = await BlockEdu.deploy();
    await blockEdu.deployed;

    await blockEdu.add_record("0xf346752778bb95fd070e54fdc1813b6720192c95835651e9b5b506389be4e166")
    expect(await blockEdu.checkStudentMap("0xf346752778bb95fd070e54fdc1813b6720192c95835651e9b5b506389be4e166")).to.equal(true)
    })
    it("Should return false for record that is not 'VALID' in studentInfo map",async function(){
        const BlockEdu = await ethers.getContractFactory("BlockEdu")
        const blockEdu = await BlockEdu.deploy();
        await blockEdu.deployed;
    
        await blockEdu.add_record("0xf346752778bb95fd070e9b5b506389be4e166e54fdc1813b6720192c95835651")
        expect(await blockEdu.checkStudentMap("0xf346752778bb95fd070e54fdc1813b6720192c95835651e9b5b506389be4e166")).to.equal(false)
        })
})

describe("remove record", function(){
    it("Should return false for record that is not 'VALID' in studentInfo map",async function(){
    const BlockEdu = await ethers.getContractFactory("BlockEdu")
    const blockEdu = await BlockEdu.deploy();
    await blockEdu.deployed;
    
    await blockEdu.add_record("0xf346752778bb95fd070e54fdc1813b6720192c95835651e9b5b506389be4e166")
    await blockEdu.remove_record("0xf346752778bb95fd070e54fdc1813b6720192c95835651e9b5b506389be4e166")
    expect(await blockEdu.checkStudentMap("0xf346752778bb95fd070e54fdc1813b6720192c95835651e9b5b506389be4e166")).to.equal(false)
    })
    it("Should return true for record that is 'VALID' in studentInfo map",async function(){
        const BlockEdu = await ethers.getContractFactory("BlockEdu")
        const blockEdu = await BlockEdu.deploy();
        await blockEdu.deployed;
        
        await blockEdu.add_record("0xf346752778bb95fd070e54fdc1813b6720192c95835651e9b5b506389be4e166")
        await blockEdu.remove_record("0xfb5b506389be4e166fdc1813346752778bb95fd070e54e9b6720192c95835651")
        expect(await blockEdu.checkStudentMap("0xf346752778bb95fd070e54fdc1813b6720192c95835651e9b5b506389be4e166")).to.equal(true)
    })
})

describe("update record",function(){
    it("Should return true for record that is 'VALID' in studentInfo map",async function(){
    const BlockEdu = await ethers.getContractFactory("BlockEdu")
    const blockEdu = await BlockEdu.deploy();
    await blockEdu.deployed;

    await blockEdu.add_record("0xf346752778bb95fd070e54fdc1813b6720192c95835651e9b5b506389be4e166")
    expect(await blockEdu.checkStudentMap("0xf346752778bb95fd070e54fdc1813b6720192c95835651e9b5b506389be4e166")).to.equal(true)
    })
})

describe("validate record",function(){
    it("Should return true for record that is valid and updated",async function(){
    const BlockEdu = await ethers.getContractFactory("BlockEdu")
    const blockEdu = await BlockEdu.deploy();
    await blockEdu.deployed;

    await blockEdu.add_record("0xf346752778bb95fd070e54fdc1813b6720192c95835651e9b5b506389be4e166")
    const response = await blockEdu.validate_record("0xf346752778bb95fd070e54fdc1813b6720192c95835651e9b5b506389be4e166")
    
    expect(response.valid).to.equal(true) && expect(response.updated).to.equal(true)
    })
    it("Should return false for record that returns that is empty",async function(){
        const BlockEdu = await ethers.getContractFactory("BlockEdu")
        const blockEdu = await BlockEdu.deploy();
        await blockEdu.deployed;
    
        await blockEdu.add_record("0xf346752778bb95fd070e54fdc1813b6720192c95835651e9b5b506389be4e166")
        await blockEdu.remove_record("0xf346752778bb95fd070e54fdc1813b6720192c95835651e9b5b506389be4e166")
        const response = await blockEdu.validate_record("0xf346752778bb95fd070e54fdc1813b6720192c95835651e9b5b506389be4e166")
        expect(response.valid).to.equal(false) && expect(response.updated).to.equal(false)
    })
    it("Should return true,false for record that returns that is valid but outdated",async function(){
        const BlockEdu = await ethers.getContractFactory("BlockEdu")
        const blockEdu = await BlockEdu.deploy();
        await blockEdu.deployed;
    
        await blockEdu.add_record("0xf346752778bb95fd070e54fdc1813b6720192c95835651e9b5b506389be4e166")
        await blockEdu.update_record("0xf346752778bb95fd070e54fdc1813b6720192c95835651e9b5b506389be4e166","0xf778bd0bb5b5295f06570e54e9b6720192c958389be4e166fdc1813346735651")
        const response = await blockEdu.validate_record("0xf346752778bb95fd070e54fdc1813b6720192c95835651e9b5b506389be4e166")
        expect(response.valid).to.equal(true) && expect(response.updated).to.equal(false)
    })
        
})


    


describe("check institution address",function(){
    it("Should return true for a wallet address that is valid",async function(){
        const BlockEdu = await ethers.getContractFactory("BlockEdu")
        const blockEdu = await BlockEdu.deploy();
        await blockEdu.deployed;

        await blockEdu.add_institution("0x301Bd6D48a37979b6C90B564a2088F7abD40aC0d")

        expect(await blockEdu.checkWalletAddress("0x301Bd6D48a37979b6C90B564a2088F7abD40aC0d")).to.equal(true)
    })
    it("Should return false for a wallet address that is invalid", async function(){
        const BlockEdu = await ethers.getContractFactory("BlockEdu")
        const blockEdu = await BlockEdu.deploy();
        await blockEdu.deployed;

        await blockEdu.add_institution("0x301Bd6D48a37979b6C90B564a2088F7abD40aC0d")

        expect(await blockEdu.checkWalletAddress("0x1A52052Bd071787e2068AE7D8743138b43120A71")).to.equal(false)
    })
})