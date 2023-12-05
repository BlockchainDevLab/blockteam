const { ethers } = require("ethers");


require('dotenv').config()

const { OWNER } = process.env

async function main() {

    const AUTH_CONTROL = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

    const AuthorizationControl = await hre.ethers.getContractFactory("AuthorizationControl")


    console.log("Attach AuthorizationControl...")
    const authorizationControl = await AuthorizationControl.attach(AUTH_CONTROL)

    const stn_group = ethers.encodeBytes32String("stn_group")

    const create_type_role = ethers.encodeBytes32String("create_type_role")
    await authorizationControl.saveRoleGroup(stn_group, create_type_role, OWNER)

    const issue_role = ethers.encodeBytes32String("issue_role")
    await authorizationControl.saveRoleGroup(stn_group, issue_role, OWNER)

    const create_bond_role = ethers.encodeBytes32String("create_bond_role")
    await authorizationControl.saveRoleGroup(stn_group, create_bond_role, OWNER)

    const create_bond_values_role = ethers.encodeBytes32String("create_bond_values_role")
    await authorizationControl.saveRole(create_bond_values_role, OWNER)
    console.log("...")

}

main();