// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./templates/NftTemplate.sol";
import "./security/AccessControlProxy.sol";
import "./libraries/BondsLibrary.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract Bonds is NftTemplate, AccessControlProxy {
    mapping(uint256 => TypeBonds) mapBondTypes;
    mapping(uint256 => TreasuryBonds) mapBonds;
    uint256[] idxBondTypes;

    error BondsTypeNotExist(uint id);
    error BondsTypeExist(uint id);
    error ArrayWithDifferentSizes();

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

    function getBondsDataJSON(uint256 id) public view returns (string memory) {
        bytes memory metadata = "{";
        bytes memory metadataParcial;
        TreasuryBonds storage treasuryBonds = mapBonds[id];

        metadataParcial = abi.encodePacked(
            '"',
            "name",
            '":',
            '"',
            treasuryBonds.Name,
            '",'
        );
        metadata = abi.encodePacked(metadata, metadataParcial);

        metadata = abi.encodePacked(metadata, '"attributes": [');

        metadata = abi.encodePacked(metadata, "] }");

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(metadata)
                )
            );
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
        uint256 typeId
    ) external view returns (uint256, string memory, string memory) {
        if (!_existsBondType(typeId)) {
            revert BondsTypeNotExist(typeId);
        }

        TypeBonds storage resultBond = mapBondTypes[typeId];

        return (resultBond.TypeID, resultBond.Name, resultBond.Description);
    }

    function getBondsTypes() external view returns (uint256[] memory) {
        return idxBondTypes;
    }

    function addBondsTypeMetadata(
        uint256 typeId,
        uint[] memory metadataIds,
        Metadata[] memory metadatas
    ) external onlyOwner {
        if (!_existsBondType(typeId)) {
            revert BondsTypeNotExist(typeId);
        }

        if (metadataIds.length != metadatas.length) {
            revert ArrayWithDifferentSizes();
        }

        TypeBonds storage typeBond = mapBondTypes[typeId];

        for (uint256 i; i < metadataIds.length; i++) {
            typeBond.Metadatas[metadataIds[i]] = metadatas[i];
            typeBond.idxMetadatas.push(metadataIds[i]);
        }
    }

    function getIdxBondsTypeMetadata(
        uint256 typeId
    ) external view returns (uint256[] memory) {
        if (!_existsBondType(typeId)) {
            revert BondsTypeNotExist(typeId);
        }

        TypeBonds storage typeBond = mapBondTypes[typeId];

        return typeBond.idxMetadatas;
    }

    function getBondsTypeMetadata(
        uint256 typeId,
        uint256 idMetadata
    ) external view returns (Metadata memory) {

        if (!_existsBondType(typeId)) {
            revert BondsTypeNotExist(typeId);
        }

        TypeBonds storage typeBond = mapBondTypes[typeId];
        return typeBond.Metadatas[idMetadata];
    }

    // ~~~~~~~~~~~~~~~~~~~~ Various Checks ~~~~~~~~~~~~~~~~~~~~
    function _existsBondType(uint256 id) internal view virtual returns (bool) {
        return mapBondTypes[id].TypeID != 0;
    }
}
