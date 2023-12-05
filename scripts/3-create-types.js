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


    await bondStorage.addBondsType(100,
        "LTF-A",
        "Letras Financeiras do Tesouro Série A",
        "6% a.a")
    
    console.log("ADD Bonds Type BondsStorage...")
    const stnRole = ethers.encodeBytes32String("STN_ROLE")
    const b3Role = ethers.encodeBytes32String("B3_ROLE")
    const typeMetadatas = [
        { Title: "beneficiario", _Type: "string", Description: "Link do IPFS", RoleAcess: stnRole },
        { Title: "taxa", _Type: "int", Description: "taxa de juros", RoleAcess: stnRole },
        { Title: "period", _Type: "int", Description: "the base period for the class", RoleAcess: stnRole },
        { Title: "ISIN", _Type: "string", Description: "International Securities Identification Number", RoleAcess: b3Role },
    ]

    let metadataIds = [];
    for (const metadata of typeMetadatas) {
        const index = typeMetadatas.indexOf(metadata);
        metadataIds.push(index + 200)
    }

    console.log("ADD Bonds metadata...")
    await bondStorage.addBondsTypeMetadata(100, metadataIds, typeMetadatas)

}

main();