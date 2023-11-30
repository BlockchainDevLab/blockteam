const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const {
  loadFixture
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");


describe("NftTemplate", function () {

  async function deployNFTTemplate() {

    const ContractFactory = await ethers.getContractFactory("NftTemplate")

    const initialOwner = (await ethers.getSigners())[0].address

    const [owner, addr1, addr2] = await ethers.getSigners()

    const instance = await upgrades.deployProxy(ContractFactory, [initialOwner, "TITULO PUBLICO FEDERAL BR", "TPF"], { initializer: ContractFactory.initialize_nft })

    await instance.waitForDeployment()


    return {
      ContractFactory, instance, owner, addr1, addr2
    }

  }


  it("Test contract", async function () {


    
  });
});