const { ethers, upgrades } = require("hardhat")

require('dotenv').config()

const { OWNER } = process.env

async function main() {


    // SECURIRY 
    const AuthorizationControl = await hre.ethers.getContractFactory('AuthorizationControl')
    const authorizationControl = await AuthorizationControl.deploy(OWNER)
    await authorizationControl.waitForDeployment()
    console.log("AuthorizationControl deployed to:", await authorizationControl.getAddress())

    const AccessControl = await hre.ethers.getContractFactory('AccessControl')
    const accessControl = await AccessControl.deploy(await authorizationControl.getAddress())
    await accessControl.waitForDeployment()

    //NFT RENDER 
    const NFTRenderer = await ethers.getContractFactory("NFTRenderer")
    const nftRenderer = await NFTRenderer.deploy()
    console.log("NFTRenderer deployed to: ", await nftRenderer.getAddress())

    //BONDS STORAGE
    const BondsStorage = await ethers.getContractFactory("BondsStorage", {
        libraries: {
            NFTRenderer: await nftRenderer.getAddress(),
        },
    })
    const bondStorage = await BondsStorage.deploy(await accessControl.getAddress())
    await bondStorage.waitForDeployment()

    console.log("BondsStorage deployed to:", await bondStorage.getAddress())

    const Bonds = await ethers.getContractFactory("Bonds");
    const bondInstance = await upgrades.deployProxy(Bonds, [OWNER, await accessControl.getAddress(), await bondStorage.getAddress(), "TFP", "TESOURO FEDERAL PUBLICO BR"]);
    await bondInstance.waitForDeployment()

    console.log("Bonds deployed to:       ", await bondInstance.getAddress())

}

main();