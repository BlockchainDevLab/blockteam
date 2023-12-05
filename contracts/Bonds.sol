// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./templates/NftTemplate.sol";
import "./AccessControlRoleGroup.sol";
//, AccessControlProxy
import "./BondsStorage.sol";

contract Bonds is NftTemplate, AccessControlRoleGroup , AccessControlProxy {
    BondsStorage bondsStorage;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {}

    function initialize(
        address initialOwner,
        address accessControl,
        address bondsStorageAddress,
        string memory _name,
        string memory _symbol
    ) public initializer {
        _NftTemplate_init(initialOwner, _name, _symbol);
        AccessControlProxyInit(accessControl);
        bondsStorage = BondsStorage(bondsStorageAddress);
    }

    function issue(address to, Transaction calldata transaction) external 
       onlyRoleGroup(
        AccessControlRoleGroup.STN_GROUP,
        AccessControlRoleGroup.ISSUE_ROLE
    ) {
        if (!bondsStorage.existsBondType(transaction.TypeID)) {
            revert BondsStorage.BondsTypeNotExist(transaction.TypeID);
        }

        //int256 maxSupply= 
        /*typeBond[uint256, string  , string  , uint256]  =  bondsStorage.getBondsType(transaction.TypeID);
        if (typeBond[3] != transaction.MaxSupply) {
            revert BondsStorage.TreasuryBondsMaxSupply(transaction.Id);
        }*/


        bondsStorage.createTreasuryBonds(transaction);
        _mint(to, transaction.Id, transaction.Amount, "");
    }

    function uri(
        uint256 id
    ) public view virtual override returns (string memory) {
        return bondsStorage.constructTokenURI(id);
    }

    //code ISIN :US-000402625-0   NA-000K0VF05-4 BRSTNCLTN7S1  BRSTNCLTN7W3 BRSTNCNTB682  BRSTNCNTB0A6
}
