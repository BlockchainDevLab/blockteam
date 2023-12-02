// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../libraries/BondsLibrary.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract BondsMetadata {
    mapping(uint256 => TypeBonds) mapBondTypes;
    mapping(uint256 => TreasuryBonds) mapBonds;
    uint256[] idxBondTypes;

    error BondsTypeNotExist(uint id);
    error BondsTypeExist(uint id);
    error ArrayWithDifferentSizes();
    error TreasuryBondsNotExist(uint256 id);

    /*
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
    }*/

    function addBondsType(
        uint256 typeID,
        string memory nameType,
        string memory descriptionType
    ) external {
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
    ) external {
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

    function createTreasuryBondsValues(
        uint256 bondID,
        uint256[] calldata metadataIds,
        Values[] calldata values
    ) external {
        if (!_existsTreasuryBonds(bondID)) {
            revert TreasuryBondsNotExist(bondID);
        }

        if (metadataIds.length != values.length) {
            revert ArrayWithDifferentSizes();
        }

        TreasuryBonds storage treasuryBonds = mapBonds[bondID];

        for (uint256 i; i < metadataIds.length; i++) {
            treasuryBonds.Values[metadataIds[i]] = values[i];
        }
    }

    function getTreasuryBondsValues(
        uint256 bondID
    ) external view returns (TreasuryBondsValue[] memory) {
        if (!_existsTreasuryBonds(bondID)) {
            revert TreasuryBondsNotExist(bondID);
        }

        TreasuryBonds storage treasuryBonds = mapBonds[bondID];
        TypeBonds storage typeBond = mapBondTypes[treasuryBonds.TypeID];
        uint256[] memory idxMetadatas = mapBondTypes[treasuryBonds.TypeID]
            .idxMetadatas;
        TreasuryBondsValue[] memory tBondsValues = new TreasuryBondsValue[](
            idxMetadatas.length
        );

        for (uint i = 0; i < idxMetadatas.length; i++) {
            
            Metadata memory metadata = typeBond.Metadatas[idxMetadatas[i]];
            TreasuryBondsValue memory tbondsValue;
            tBondsValues[i].Title = metadata.Title;
            tBondsValues[i]._Type = metadata._Type;
            tBondsValues[i].Description = metadata.Description;
            tBondsValues[i].Value = getStringValue("type" ,treasuryBonds.Values[idxMetadatas[i]]);          
        }

        return tBondsValues;
    }

    // ~~~~~~~~~~~~~~~~~~~~ Various Checks ~~~~~~~~~~~~~~~~~~~~
    function _existsBondType(uint256 id) internal view virtual returns (bool) {
        return mapBondTypes[id].TypeID != 0;
    }

    function _existsTreasuryBonds(
        uint256 id
    ) internal view virtual returns (bool) {
        return mapBonds[id].Id != 0;
    }
}
