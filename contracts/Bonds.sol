// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./templates/NftTemplate.sol";
import "./templates/BondsMetadata.sol";
//import "./security/AccessControlProxy.sol";


contract Bonds is NftTemplate, BondsMetadata {

 

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {}

    function initialize(
        address initialOwner,
        address accessControl,
        string memory _name,
        string memory _symbol
    ) public initializer {
        _NftTemplate_init(initialOwner, _name, _symbol);
        //_AccessControlProxy_init(accessControl);
    }

    function issue(address to, Transaction calldata transaction) external {
        if (!_existsBondType(transaction.TypeID)) {
            revert BondsTypeNotExist(transaction.TypeID);
        }

        //TODO CHECKS
        TreasuryBonds storage treasuryBonds = mapBonds[transaction.Id];
        treasuryBonds.Id = transaction.Id;
        treasuryBonds.TypeID = transaction.TypeID;
        treasuryBonds.Name = transaction.Name;
        treasuryBonds.Code = transaction.Code;
        treasuryBonds.CodeISIN = transaction.CodeISIN;
        treasuryBonds.Amount = transaction.Amount;
        treasuryBonds.MaturityDate = transaction.MaturityDate;

        _mint(to, transaction.TypeID, transaction.Amount, "");
    }

}
