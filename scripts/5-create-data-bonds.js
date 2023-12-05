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

    /////////

    const metadataIds = [ 200, 201, 202, 203] //await bondStorage.getIdxBondsTypeMetadata(100)

    ///

    
    console.log(metadataIds)


    console.log("-------------------------------------")

    
    const defaultValue = {
        stringValue: "",
        uintValue: 0,
        addressValue: "0x0000000000000000000000000000000000000000",
        boolValue: false,
        bytesValue: ethers.encodeBytes32String(""),
    }
    const bondsValues = [
        { ...defaultValue, stringValue: "MINISTERIO DO MEIO AMBIENTE" },
        { ...defaultValue, uintValue: 6 },
        { ...defaultValue, uintValue: 3600 * 24 * 180 }, // 6 months
        { ...defaultValue, stringValue: "BRSTNCLTN7W4" },
    ]

    await bondStorage.createTreasuryBondsValues(
        202201101,
        metadataIds,
        bondsValues
    )

    /*
    const bondsMetaValues = await bondStorage.getTreasuryBondsValues(202201100)
    console.log("BONDS VALUES")
    //console.log(bondsMetaValues)
    const strJSON = await bondStorage.constructTokenURI(202201100)
    console.log(strJSON)*/

}

main();