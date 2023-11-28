const {
    time,
    loadFixture
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("TokenTemplate", function () {

    async function deployTokenTemplate() {

        const [owner, addr1, addr2] = await ethers.getSigners()

        const TokenTemplate = await ethers.getContractFactory(
            "TokenTemplate"
        )
        const token = await TokenTemplate.deploy()
        const nm = "TTESTE"
        const sb = "TK"
        const cap = ethers.parseUnits("1000", 18)
        //console.log("Deploying TokenTemplate...")
        await token.initialize(nm, sb, owner.address, cap)
        //console.log("TokenTemplate deployed to:", await token.getAddress())

        return {
            TokenTemplate, token, owner, addr1, addr2, nm, sb, cap
        }

    }

    describe("Deployment", function () {

        it("Should set the right owner, name, symbol, cap, totalSupply(0)", async function () {

            const { TokenTemplate, token, owner, addr1, addr2, nm, sb, cap } = await loadFixture(deployTokenTemplate)
            expect(await token.owner()).to.equal(owner.address)
            expect(await token.cap()).to.equal(cap)
            expect(await token.name()).to.equal(nm)
            expect(await token.symbol()).to.equal(sb)
            expect(await token.totalSupply()).to.equal(0)

        })

    })

    describe("Mint", function () {

        describe("Validations", function () {


            it("Should revert with the right  custom error ERC20ExceededCap", async function () {

                const { TokenTemplate, token, owner, addr1, addr2, nm, sb, cap } = await loadFixture(deployTokenTemplate)

                await token.mint(addr1.address, ethers.parseUnits("100", 18))

                await expect(token.mint(addr2.address, ethers.parseUnits("1000", 18))).to.be.revertedWithCustomError(token,
                    'ERC20ExceededCap')
            })

            it("Should revert with the right error if called from not owner account", async function () {

                const { TokenTemplate, token, owner, addr1, addr2, nm, sb, cap } = await loadFixture(deployTokenTemplate)

                token.connect(addr1).mint(owner.address, 100)


                await expect(token.connect(addr1).mint(owner.address, 100)).to.be.revertedWithCustomError(token,
                    'OwnableUnauthorizedAccount')
            });

        });

        describe("Mints", function () {

            it("Should assign the total supply of tokens to the owner", async function () {

                const { TokenTemplate, token, owner, addr1, addr2, nm, sb, cap } = await loadFixture(deployTokenTemplate)
                await token.mint(owner.address, cap)
                const ownerBalance = await token.balanceOf(owner.address)
                expect(ownerBalance).to.equal(cap)
                expect(await token.totalSupply()).to.equal(ownerBalance)
            })

            it("Should mint the 100.25 tokens to the another address", async function () {

                const { TokenTemplate, token, owner, addr1, addr2, nm, sb, cap } = await loadFixture(deployTokenTemplate)
                const vl = ethers.parseUnits("100.25", 18)
                await token.mint(addr1.address, vl)
                const balance = await token.balanceOf(addr1.address)
                expect(balance).to.equal(vl)

            })

            it("Should mint error -> ERC20ExceededCap", async function () {

                const { TokenTemplate, token, owner, addr1, addr2, nm, sb, cap } = await loadFixture(deployTokenTemplate)
                await token.mint(addr1.address, cap)
                const balance = await token.balanceOf(addr1.address)
                expect(balance).to.equal(cap)
                const vl = ethers.parseUnits("100.25", 18)
                await expect(token.mint(addr2.address, vl)).to.be.revertedWithCustomError(token,
                    'ERC20ExceededCap')
            })
        })

    })


    describe("Transactions", function () {


        describe("Transfer", function () {


            it("Should revert with the right  custom error ERC20InsufficientBalance", async function () {

                const { TokenTemplate, token, owner, addr1, addr2, nm, sb, cap } = await loadFixture(deployTokenTemplate)

                await token.mint(addr1.address, ethers.parseUnits("100", 18))

                await expect(token.transfer(addr1.address, ethers.parseUnits("101", 18))).to.be.revertedWithCustomError(token,
                    'ERC20InsufficientBalance')

            })

            it("Should transfer tokens between accounts", async function () {

                const { TokenTemplate, token, owner, addr1, addr2, nm, sb, cap } = await loadFixture(deployTokenTemplate)

                await token.mint(owner.address, ethers.parseUnits("100.1258", 18))

                const tSupply = await token.totalSupply()
                //transfer owner -> add2 
                let vlTransfer = ethers.parseUnits("22.12", 18)
                await expect(
                    token.transfer(addr1.address, vlTransfer),
                ).to.changeTokenBalances(token, [owner, addr1], [-vlTransfer, vlTransfer])

                //transfer addr1 -> add2 
                let vlTransfer2 = ethers.parseUnits("16.15", 18)
                await expect(
                    token.connect(addr1).transfer(addr2.address, vlTransfer2),
                ).to.changeTokenBalances(token, [addr1, addr2], [-vlTransfer2, vlTransfer2])

                let blAddr2 = await token.balanceOf(addr2.address)
                //console.log(blAddr2)
                expect(blAddr2).to.equal(vlTransfer2)

                const tSupplyAfterTransfers = await token.totalSupply()
                expect(tSupply).to.equal(tSupplyAfterTransfers)


            })

            it('Should emit Transfer events', async () => {

                const { TokenTemplate, token, owner, addr1, addr2, nm, sb, cap } = await loadFixture(deployTokenTemplate)

                await token.mint(owner.address, ethers.parseUnits("400", 18))

                // Transfer 50 tokens from owner to addr1
                const vlTransfer = ethers.parseUnits("50", 18)
                await expect(token.transfer(addr1.address, vlTransfer))
                    .to.emit(token, 'Transfer')
                    .withArgs(owner.address, addr1.address, vlTransfer);

                // Transfer 50 tokens from addr1 to addr2
                // We use .connect(signer) to send a transaction from another account
                await expect(token.connect(addr1).transfer(addr2.address, vlTransfer))
                    .to.emit(token, 'Transfer')
                    .withArgs(addr1.address, addr2.address, vlTransfer);
            })

        })



        describe("Allowance/Approve/TransferFrom", function () {

            it('Should setting allowance amount of spender over the caller\'s ', async () => {

                const { TokenTemplate, token, owner, addr1, addr2, nm, sb, cap } = await loadFixture(deployTokenTemplate)

                await token.mint(addr1.address, ethers.parseUnits("400", 18))
                //console.log(`Setting allowance amount of spender over the caller\'s ${sb} tokens...`)
                const approveAmount = 100
                //console.log(`This example allows the contractOwner to spend up to ${approveAmount} of the recipient\'s ${sb} token`)
                const signerContract = await token.connect(addr1); // Creates a new instance of the contract connected to the recipient
                await signerContract.approve(addr2.address, ethers.parseUnits(approveAmount.toString(), 18))
                //console.log(`Spending approved\n`)
                const allowance = await token.allowance(addr1.address, addr2.address)
                //console.log(allowance)
                expect(ethers.parseUnits(approveAmount.toString(), 18)).to.equal(allowance)
            })


            it('Should setting allowance amount of spender over the caller\'s ', async () => {

                const { TokenTemplate, token, owner, addr1, addr2, nm, sb, cap } = await loadFixture(deployTokenTemplate)

                await token.mint(addr1.address, ethers.parseUnits("400", 18))
                //console.log(`Setting allowance amount of spender over the caller\'s ${sb} tokens...`)
                const approveAmount = 100
                //console.log(`This example allows the contractOwner to spend up to ${approveAmount} of the recipient\'s ${sb} token`)
                const signerContract = await token.connect(addr1); // Creates a new instance of the contract connected to the recipient
                await signerContract.approve(addr2.address, ethers.parseUnits(approveAmount.toString(), 18))
                //console.log(`Spending approved\n`)
                const allowance = await token.allowance(addr1.address, addr2.address)
                //console.log(allowance)
                expect(ethers.parseUnits(approveAmount.toString(), 18)).to.equal(allowance)
            })

            it('Emits an approval event with the right arguments', async function () {

                const { TokenTemplate, token, owner, addr1, addr2, nm, sb, cap } = await loadFixture(deployTokenTemplate)

                const approveAmount = 400;
                await token.mint(addr1.address, ethers.parseUnits(approveAmount.toString(), 18))

                const signerContract = await token.connect(addr1)
                await expect(signerContract.approve(addr2.address, ethers.parseUnits(approveAmount.toString(), 18)))
                    .to.emit(token, "Approval")
                    .withArgs(addr1.address, addr2.address, ethers.parseUnits(approveAmount.toString(), 18))
            })


            it('Allows an approved spender to transfer from owner', async function () {

                const { TokenTemplate, token, owner, addr1, addr2, nm, sb, cap } = await loadFixture(deployTokenTemplate)

                const approveAmount = 400
                const approveAmountDecimal = ethers.parseUnits(approveAmount.toString(), 18)
                await token.mint(addr1.address, approveAmountDecimal)
                const signerContract = await token.connect(addr1)

                const transferAmount = 100
                const transferAmountDecimal = ethers.parseUnits(transferAmount.toString(), 18)
                await signerContract.approve(addr2.address, transferAmountDecimal)
                const signerContract2 = await token.connect(addr2)

                await expect(signerContract2.transferFrom(addr1.address, owner.address, transferAmountDecimal)).to.changeTokenBalances(
                    token,
                    [addr1.address, owner.address],
                    [-transferAmountDecimal, transferAmountDecimal]
                )
            })

            it('Should setting allowance amount of spender and error -> ERC20InsufficientAllowance ', async function () {

                const { TokenTemplate, token, owner, addr1, addr2, nm, sb, cap } = await loadFixture(deployTokenTemplate)

                const initialAmount = 100;
                const incrementAmount = 400;

                const initialAmountDecimal = ethers.parseUnits(initialAmount.toString(), 18)
                const incrementAmountDecimal = ethers.parseUnits(incrementAmount.toString(), 18)

                await token.mint(addr1.address, initialAmountDecimal)
                const signerContract = await token.connect(addr1)

                await signerContract.approve(owner.address, initialAmountDecimal)

                const signerContractOwner = await token.connect(owner)
                //const previousAllowance = await token.allowance(addr1.address, owner.address)
                await expect(signerContractOwner.transferFrom(addr1.address, addr2.address, incrementAmountDecimal)).to.be.revertedWithCustomError(token,
                    'ERC20InsufficientAllowance')
            })  //error 'ERC20InsufficientAllowance
        })

    })

    describe("Burn", function () {

        it('Should burn token : burn ', async function () {

            const { TokenTemplate, token, owner, addr1, addr2, nm, sb, cap } = await loadFixture(deployTokenTemplate)

            const initialAmount = 100
            const initialAmountDecimal = ethers.parseUnits(initialAmount.toString(), 18)
            await token.mint(addr1.address, initialAmountDecimal)
            const signerContract = await token.connect(addr1)
            await signerContract.burn(initialAmountDecimal)
            const sp = await token.totalSupply()
            //console.log(sp)
            const bl = await token.balanceOf(addr1.address)
            //console.log(bl)
            expect(sp).to.equal(bl)
            expect(bl).to.equal(0)
        })


        it('Should burn token : burnFrom', async function () {

            const { TokenTemplate, token, owner, addr1, addr2, nm, sb, cap } = await loadFixture(deployTokenTemplate)

            const initialAmount = 100;


            const initialAmountDecimal = ethers.parseUnits(initialAmount.toString(), 18)
            await token.mint(addr1.address, initialAmountDecimal)


            const signerContract = await token.connect(addr1)
            await signerContract.approve(owner.address, initialAmountDecimal)
            const signerContractOwner = await token.connect(owner)
            const previousAllowance = await token.allowance(addr1.address, owner.address)
            await signerContractOwner.burnFrom(addr1.address, previousAllowance)

            const sp = await token.totalSupply()
            //console.log(sp)
            const bl = await token.balanceOf(addr1.address)
            //console.log(bl)
            expect(sp).to.equal(bl)
            expect(bl).to.equal(0)

        })

        it('Should not burn token ERC20InsufficientBalance', async function () {

            const { TokenTemplate, token, owner, addr1, addr2, nm, sb, cap } = await loadFixture(deployTokenTemplate)

            const initialAmount = 100
            const initialAmountDecimal = ethers.parseUnits(initialAmount.toString(), 18)
            await token.mint(addr1.address, initialAmountDecimal)

            const signerContract = await token.connect(addr1)
            const burnAmountDecimal = ethers.parseUnits('1000', 18)

            await expect(signerContract.burn(burnAmountDecimal)).to.be.revertedWithCustomError(signerContract,
                'ERC20InsufficientBalance')
            const sp = await token.totalSupply()
            //console.log(sp)
            const bl = await token.balanceOf(addr1.address)
            //console.log(bl)
            expect(sp).to.equal(bl)
            expect(bl).to.equal(initialAmountDecimal)
        })

    })

})
