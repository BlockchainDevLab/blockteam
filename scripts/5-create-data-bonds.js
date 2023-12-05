const { ethers } = require("ethers");


async function main() {

    const ADR_BONDS_STORAGE = "0xE2A575D903bbaF6802FC975CCEacCb320eB0AF02"
    const ADR_NFT_RENDER = "0xE2A575D903bbaF6802FC975CCEacCb320eB0AF02"
    
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
        202201100,
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