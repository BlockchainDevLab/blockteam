const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const {
    loadFixture
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const { ethersInstance } = require("ethers");


describe("BondsStorage", function () {

    async function deployBonds() {


        const [owner, addr1, addr2] = await ethers.getSigners()

        const BondsStorage = await ethers.getContractFactory("BondsStorage")
        const bondStorage = await BondsStorage.deploy()
        await bondStorage.waitForDeployment()

        console.log(await bondStorage.getAddress())

        return { BondsStorage, bondStorage, owner, addr1, addr2 }

    }

    describe("Deployment", function () {

        it("Should set the right owner, name, symbol", async function () {

            const {
                BondsStorage, bondStorage, owner, addr1, addr2
            } = await loadFixture(deployBonds)

            //expect(await bondInstance.name()).to.equal("TFP")
        })

    })


    describe("BondsType", function () {

        it("ADD BondsType", async function () {

            const {
                BondsStorage, bondStorage, owner, addr1, addr2
            } = await loadFixture(deployBonds)


            await bondStorage.addBondsType(1,
                "BTN",
                "Bônus do Tesouro Nacional")


            const bondType = await bondStorage.getBondsType(1)
            //console.log(bondType)
            expect(bondType[1]).to.equal("BTN")
            expect(bondType[2]).to.equal("Bônus do Tesouro Nacional")

        })


        it("ADD BondsType - error BondsTypeExist", async function () {

            const {
                BondsStorage, bondStorage, owner, addr1, addr2
            } = await loadFixture(deployBonds)


            await bondStorage.addBondsType(1,
                "BTN",
                "Bônus do Tesouro Nacional")


            await expect(
                bondStorage.addBondsType(1,
                    "BTNX",
                    "Bônus do Tesouro Nacional")).to.be.revertedWithCustomError(bondStorage,
                        'BondsTypeExist')


        })


        it("GET  BondsType", async function () {

            const {
                Bonds, bondStorage, owner, addr1, addr2
            } = await loadFixture(deployBonds)

            await bondStorage.addBondsType(1,
                "BTN",
                "Bônus do Tesouro Nacional")

            const bondType = await bondStorage.getBondsType(1)
            //console.log(bondType)
            expect(bondType[1]).to.equal("BTN")
            expect(bondType[2]).to.equal("Bônus do Tesouro Nacional")

        })

        it("GET  BondsType error :BondsTypeNotExist", async function () {

            const {
                Bonds, bondStorage, owner, addr1, addr2
            } = await loadFixture(deployBonds)

            await bondStorage.addBondsType(1,
                "BTN",
                "Bônus do Tesouro Nacional")

            await expect(
                bondStorage.getBondsType(10)).to.be.revertedWithCustomError(bondStorage,
                    'BondsTypeNotExist')
        })

        it("GET  BondsType", async function () {

            const {
                Bonds, bondStorage, owner, addr1, addr2
            } = await loadFixture(deployBonds)

            await bondStorage.addBondsType(1,
                "BTN",
                "Bônus do Tesouro Nacional")

            await bondStorage.addBondsType(2,
                "LTN",
                "Letra do Tesouro Nacional")


            await bondStorage.addBondsType(3,
                "NTN-A1",
                "NTN-A1 – Notas do Tesouro Nacional Subsérie A1")

            const idxBondType = await bondStorage.getBondsTypes()
            expect(idxBondType[0]).to.equal(1)
            expect(idxBondType[1]).to.equal(2)

        })

        it("ADD Metadata BondsType", async function () {

            const {
                Bonds, bondStorage, owner, addr1, addr2
            } = await loadFixture(deployBonds)


            await bondStorage.addBondsType(100,
                "BTN",
                "Bônus do Tesouro Nacional")


            const stnRole = ethers.encodeBytes32String("STN_ROLE")
            const b3Role = ethers.encodeBytes32String("B3_ROLE")
            const typeMetadatas = [
                { Title: "symbol", _Type: "string", Description: "the collateral token's symbol", RoleAcess: stnRole },
                { Title: "token address", _Type: "address", Description: "the collateral token's address", RoleAcess: stnRole },
                { Title: "interest rate type", _Type: "int", Description: "the interest rate type", RoleAcess: stnRole },
                { Title: "period", _Type: "int", Description: "the base period for the class", RoleAcess: stnRole },
                { Title: "ISIN", _Type: "string", Description: "International Securities Identification Number", RoleAcess: b3Role },
            ]

            let metadataIds = [];
            for (const metadata of typeMetadatas) {
                const index = typeMetadatas.indexOf(metadata);
                metadataIds.push(index + 200)
            }

            //console.log(metadataIds)
            await bondStorage.addBondsTypeMetadata(100, metadataIds, typeMetadatas)
            const idxMetadatas = await bondStorage.getIdxBondsTypeMetadata(100)
            console.log(idxMetadatas[0])
            const metadata = await bondStorage.getBondsTypeMetadata(
                100,
                idxMetadatas[0]
            )
            console.log(metadata)
            expect(metadata[0]).to.equal("symbol")
            expect(metadata[2]).to.equal("the collateral token's symbol")

        })


        it("createTreasuryBondsValues", async function () {

            const {
                Bonds, bondStorage, owner, addr1, addr2
            } = await loadFixture(deployBonds)



            await bondStorage.addBondsType(100,
                "BTN",
                "Bônus do Tesouro Nacional")


            const stnRole = ethers.encodeBytes32String("STN_ROLE")
            const b3Role = ethers.encodeBytes32String("B3_ROLE")
            const typeMetadatas = [
                { Title: "symbol", _Type: "string", Description: "the collateral token's symbol", RoleAcess: stnRole },
                { Title: "token address", _Type: "address", Description: "the collateral token's address", RoleAcess: stnRole },
                { Title: "interest rate type", _Type: "int", Description: "the interest rate type", RoleAcess: stnRole },
                { Title: "period", _Type: "int", Description: "the base period for the class", RoleAcess: stnRole },
                { Title: "ISIN", _Type: "string", Description: "International Securities Identification Number", RoleAcess: b3Role },
            ]

            let metadataIds = [];
            for (const metadata of typeMetadatas) {
                const index = typeMetadatas.indexOf(metadata);
                metadataIds.push(index + 200)
            }

            //console.log(metadataIds)
            await bondStorage.addBondsTypeMetadata(100, metadataIds, typeMetadatas)
            const idxMetadatas = await bondStorage.getIdxBondsTypeMetadata(100)
            console.log(idxMetadatas[0])
            const metadata = await bondStorage.getBondsTypeMetadata(
                100,
                idxMetadatas[0]
            )
            console.log(metadata)
            expect(metadata[0]).to.equal("symbol")
            expect(metadata[2]).to.equal("the collateral token's symbol")


            const transaction = {
                'Id': 202201100,
                'TypeID': 100,
                'Name': 'TESTE TYPE 2',
                'Code': 'BRTS1003',
                'CodeISIN': 'BRSTNCLTN7W3',
                'Amount': 100,
                'MaturityDate': new Date(2025, 12, 1).getTime()
            }
            
            await bondStorage.createTreasuryBonds(transaction)

            const defaultValue = {
                stringValue: "",
                uintValue: 0,
                addressValue: "0x0000000000000000000000000000000000000000",
                boolValue: false,
                bytesValue: ethers.encodeBytes32String(""),
            }
            const bondsValues = [
                { ...defaultValue, stringValue: "NTBN" },
                { ...defaultValue, addressValue: '0xf57107A130a7170fb1dE16424046B553f2701c23' },
                { ...defaultValue, uintValue: 5 },
                { ...defaultValue, uintValue: 3600 * 24 * 180 }, // 6 months
                { ...defaultValue, stringValue: "BRSTNCLTN7W3" },
            ]

            await bondStorage.createTreasuryBondsValues(
                202201100,
                metadataIds,
                bondsValues
            )

            const bondsMetaValues = await bondStorage.getTreasuryBondsValues(202201100)
            console.log("BONDS VALUES")
            //console.log(bondsMetaValues)
            const strJSON = await bondStorage.constructTokenURI()
            console.log(strJSON)
        
            /*
            await bondInstance.createTreasuryBondsValues(
                uint256 bondID,
                uint256[] calldata metadataIds,
                Values[] calldata values
            )*/

        })

    })

});