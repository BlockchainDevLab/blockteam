// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./templates/NftTemplate.sol";
import "./security/AccessControlProxy.sol";
//, AccessControlProxy
import "./BondsStorage.sol";

contract Bonds is NftTemplate {
    
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
        //_AccessControlProxy_init(accessControl);
        bondsStorage = BondsStorage(bondsStorageAddress);
    }

    function issue(address to, Transaction calldata transaction) external {
        if (!bondsStorage.existsBondType(transaction.TypeID)) {
            revert BondsStorage.BondsTypeNotExist(transaction.TypeID);
        }

        bondsStorage.createTreasuryBonds(transaction);
        _mint(to, transaction.TypeID, transaction.Amount, "");
    }
}
