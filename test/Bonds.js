const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const {
    loadFixture
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const { ethersInstance } = require("ethers");


describe("Bonds", function () {

    async function deployBonds() {


        const [owner, addr1, addr2] = await ethers.getSigners()

        //const instance = await upgrades.deployProxy('ContractFactory', [initialOwner])


        //security 
        const AuthorizationControl = await hre.ethers.getContractFactory('AuthorizationControl')
        const authorizationControl = await AuthorizationControl.deploy(owner.address)
        await authorizationControl.waitForDeployment()



        //console.log(await authorizationControl.getAddress())

        const AccessControl = await hre.ethers.getContractFactory('AccessControl')
        const accessControl = await AccessControl.deploy(await authorizationControl.getAddress())
        await accessControl.waitForDeployment()

        // const instanceAccessControl = await upgrades.deployProxy(AccessControl, [await authorizationControl.getAddress()]);
        //await instanceAccessControl.waitForDeployment();

        //BONDS STORAGE 
        const NFTRenderer = await ethers.getContractFactory("NFTRenderer")
        const nftRenderer = await NFTRenderer.deploy()

        const BondsStorage = await ethers.getContractFactory("BondsStorage", {
            libraries: {
                NFTRenderer: await nftRenderer.getAddress(),
            },
        })
        const bondStorage = await BondsStorage.deploy(await accessControl.getAddress())
        await bondStorage.waitForDeployment()

        //console.log(await bondStorage.getAddress())



        const Bonds = await ethers.getContractFactory("Bonds");
        //const bondInstance = await Bonds.deploy(await accessControl.getAddress())
        const bondInstance = await upgrades.deployProxy(Bonds, [owner.address, await accessControl.getAddress(), await bondStorage.getAddress(), "TFP", "TESOURO FEDERAL PUBLICO BR"]);
        await bondInstance.waitForDeployment()

        return { Bonds, bondInstance, bondStorage, owner, addr1, addr2, authorizationControl }

    }

    describe("Deployment", function () {

        it("Should set the right owner, name, symbol", async function () {

            const {
                Bonds, bondInstance, bondStorage, owner, addr1, addr2, authorizationControl
            } = await loadFixture(deployBonds)
            expect(await bondInstance.name()).to.equal("TFP")
        })

    })


    describe("ISSUE  Bonds ", function () {


        it("ISSUE  Bonds ", async function () {

            const {
                Bonds, bondInstance, bondStorage, owner, addr1, addr2, authorizationControl
            } = await loadFixture(deployBonds)
            expect(await bondInstance.owner()).to.equal(owner.address)



            //ADD SECURITY 
            //Bonds, bondInstance, bondStorage, owner, addr1, addr2, authorizationControl

            const stn_group = ethers.encodeBytes32String("stn_group")

            const create_type_role = ethers.encodeBytes32String("create_type_role")
            await authorizationControl.saveRoleGroup(stn_group, create_type_role, owner.address)

            const issue_role = ethers.encodeBytes32String("issue_role")
            await authorizationControl.saveRoleGroup(stn_group, issue_role, owner.address)

            const create_bond_role = ethers.encodeBytes32String("create_bond_role")  //create_bond_role
            await authorizationControl.saveRoleGroup(stn_group, create_bond_role, owner.address)

            const create_bond_values_role = ethers.encodeBytes32String("create_bond_values_role")
            await authorizationControl.saveRole(create_bond_values_role, owner.address)

            await bondStorage.addBondsType(1,
                "BTN",
                "Bônus do Tesouro Nacional",
                '6% a.a')

            await bondStorage.addBondsType(2,
                "LTN",
                "Letra do Tesouro Nacional",
                "Deságio sobre o valor nominal.")


            await bondStorage.addBondsType(3,
                "NTN-A1",
                "NTN-A1 – Notas do Tesouro Nacional Subsérie A1",
                '6% a.a')

            const idxBondType = await bondStorage.getBondsTypes()
            expect(idxBondType[0]).to.equal(1)
            expect(idxBondType[1]).to.equal(2)

            const transaction = {
                'Id': 100,
                'TypeID': 2,
                'Name': 'TESTE TYPE 2',
                'Code': 'BRTS1003',
                'CodeISIN': 'BRSTNCLTN7W3',
                'Amount': 100,
                'MaturityDate': new Date(2025, 12, 1).getTime()
            }




            await bondInstance.issue(addr1.address, transaction)
            //const jsonURI = await bondInstance.getBondsDataJSON(100)
            //console.log(jsonURI)
        })

        it("createTreasuryBondsValues", async function () {

            const {
                Bonds, bondInstance, bondStorage, owner, addr1, addr2, authorizationControl
            } = await loadFixture(deployBonds)


            const stn_group = ethers.encodeBytes32String("stn_group")

            const create_type_role = ethers.encodeBytes32String("create_type_role")
            await authorizationControl.saveRoleGroup(stn_group, create_type_role, owner.address)

            const issue_role = ethers.encodeBytes32String("issue_role")
            await authorizationControl.saveRoleGroup(stn_group, issue_role, owner.address)


            const create_bond_role = ethers.encodeBytes32String("create_bond_role")  //create_bond_role
            await authorizationControl.saveRoleGroup(stn_group, create_bond_role, owner.address)

            const create_bond_values_role = ethers.encodeBytes32String("create_bond_values_role")
            await authorizationControl.saveRole(create_bond_values_role, owner.address)


            await bondStorage.addBondsType(100,
                "BTN",
                "Bônus do Tesouro Nacional",
                "6% a.a")


            const stnRole = ethers.encodeBytes32String("STN_ROLE")
            const b3Role = ethers.encodeBytes32String("B_ROLE")

            //console.log(stnRole)

            //await authorizationControl.saveRole(stnRole, owner.address);
            //await authorizationControl.saveRole(b3Role, owner.address);


            //Entendendo o ISSB (International Sustainability Standards Board)

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
            //console.log(metadata)
            expect(metadata[0]).to.equal("symbol")
            expect(metadata[2]).to.equal("the collateral token's symbol")

            const date = new Date('2025-12-22');
            const unixTimestamp = Math.floor(date.getTime() / 1000);

            const transaction = {
                'Id': 202201100,
                'TypeID': 100,
                'Name': 'TESTE TYPE 2',
                'Code': 'BRTS1003',
                'CodeISIN': 'BRSTNCLTN7W3',
                'Amount': 100,
                'MaturityDate': 1765211486
            }

            await bondInstance.issue(addr1.address, transaction)

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
                { ...defaultValue, uintValue: 0 },
                { ...defaultValue, uintValue: 3600 * 24 * 180 }, // 6 months
                { ...defaultValue, stringValue: "BRSTNCLTN7W3" },
            ]

            try {

                await bondStorage.createTreasuryBondsValues(
                    202201100,
                    metadataIds,
                    bondsValues
                )
            } catch (e) {
                console.log(e)
            }


            const bondsMetaValues = await bondStorage.getTreasuryBondsValues(202201100)
            //console.log("BONDS VALUES")
            //console.log(bondsMetaValues)


            /*
            await bondInstance.createTreasuryBondsValues(
                uint256 bondID,
                uint256[] calldata metadataIds,
                Values[] calldata values
            )*/

        })

    })

});