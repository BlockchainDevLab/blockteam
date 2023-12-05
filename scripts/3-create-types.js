const { ethers } = require("ethers");


async function main() {

    const ADR_BONDS_STORAGE = "0xE2A575D903bbaF6802FC975CCEacCb320eB0AF02"

    const ADR_NFT_RENDER = "0xB7A51dD31b5E4336A76C5d170B07650599e8fF66"

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