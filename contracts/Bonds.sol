// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./templates/NftTemplate.sol";
import "./security/AccessControlProxy.sol";
import "./libraries/BondsLibrary.sol";

contract Bonds is NftTemplate, AccessControlProxy {
    mapping(uint256 => TypeBonds) mapBondTypes;
    mapping(uint256 => TreasuryBonds) mapBonds;
    uint256[] idxBondTypes;

    error BondsTypeNotExist(uint id);
    error BondsTypeExist(uint id);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {}

    function initialize(
        address initialOwner,
        address accessControl,
        string memory _name,
        string memory _symbol
    ) public initializer {
        _NftTemplate_init(initialOwner, _name, _symbol);
        _AccessControlProxy_init(accessControl);
    }

    function issue(address to, Transaction calldata transaction) external {
        //TODO CHECKS 
        TreasuryBonds storage treasuryBonds = mapBonds[transaction.TypeID];
        treasuryBonds.Id = transaction.Id;
        treasuryBonds.TypeID = transaction.TypeID;
        treasuryBonds.Name = transaction.Name;
        treasuryBonds.Code = transaction.Code;
        treasuryBonds.CodeISIN = transaction.CodeISIN;
        treasuryBonds.Amount = transaction.Amount;
        treasuryBonds.MaturityDate = transaction.MaturityDate;

        _mint(to, transaction.TypeID, transaction.Amount, "");
    }

    function addBondsType(
        uint256 typeID,
        string memory nameType,
        string memory descriptionType
    ) external onlyOwner {
        if (_existsBondType(typeID)) {
            revert BondsTypeExist(typeID);
        }

        TypeBonds storage newBondsType = mapBondTypes[typeID];
        newBondsType.Description = descriptionType;
        newBondsType.Name = nameType;
        newBondsType.TypeID = typeID;
        idxBondTypes.push(typeID);
    }

    function getBondsType(
        uint256 id
    ) external view returns (uint256, string memory, string memory) {
        if (!_existsBondType(id)) {
            revert BondsTypeNotExist(id);
        }

        TypeBonds storage resultBond = mapBondTypes[id];

        return (resultBond.TypeID, resultBond.Name, resultBond.Description);
    }

    function getBondsTypes() external view returns (uint256[] memory) {
        return idxBondTypes;
    }

    // ~~~~~~~~~~~~~~~~~~~~ Various Checks ~~~~~~~~~~~~~~~~~~~~
    function _existsBondType(uint256 id) internal view virtual returns (bool) {
        return mapBondTypes[id].TypeID != 0;
    }
}
