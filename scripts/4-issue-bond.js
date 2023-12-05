const { ethers } = require("ethers");


async function main() {



    const ADR_BONDS_STORAGE = "0x07a39CAb8C5B1A72Fe00573f5b1e57C4dCeD86Ea"

    const ADR_NFT_RENDER = "0xb9e4a6C619da0f501E08A0017Ac11a8764Dd9156"

    const BondsStorage = await hre.ethers.getContractFactory("BondsStorage", {
        libraries: {
            NFTRenderer: ADR_NFT_RENDER,
        },
    })

    console.log("Attach BondsStorage...")
    const bondStorage = await BondsStorage.attach(ADR_BONDS_STORAGE)


    const ADR_BONDS = "0x47d9b72714323340F594E8A6f8BB3C1Bf0A4259D"
    const ADR_MINT = "0x3F9E5E96b26156541D369e57337881f6BA9Bc6A9"

    const Bonds = await hre.ethers.getContractFactory("Bonds")
    console.log("Attach Bonds...")
    const contract = await Bonds.attach(ADR_BONDS)


    //function issue(address to, Transaction calldata transaction) external

    const transaction = {
        'Id': 202201101,
        'TypeID': 100,
        'Name': 'Global ESG 2031',
        'Code': 'BRTS1004',
        'CodeISIN': 'BRSTNCLTN7W8',
        'Amount': 1000,
        'MaturityDate': 1765211486
    }

    await bondStorage.createTreasuryBonds(transaction);
    await contract.issue(ADR_MINT, transaction)
    console.log("Bonds mint  to:", ADR_MINT)

}

main();