const { ethers } = require("ethers");


async function main() {

    const ADR_BONDS = "0xC2E8B0c3c4FDAD4348aC5de3D43ec8C0231CfB50"
    const ADR_MINT = "0x3F9E5E96b26156541D369e57337881f6BA9Bc6A9"

    const Bonds = await hre.ethers.getContractFactory("Bonds")
    console.log("Attach Bonds...")
    const contract = await Bonds.attach(ADR_BONDS)


    //function issue(address to, Transaction calldata transaction) external

    const transaction = {
        'Id': 202201101,
        'TypeID': 100,
        'Name': 'TESTE 202201101',
        'Code': 'BRTS1004',
        'CodeISIN': 'BRSTNCLTN7W8',
        'Amount': 1000,
        'MaturityDate': 1765211486
    }
    await contract.issue(ADR_MINT, transaction)
    console.log("Bonds mint  to:", ADR_MINT)

}

main();