// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./libraries/BondsLibrary.sol";
import "./libraries/NFTRenderer.sol";

import "./AccessControlRoleGroup.sol";

import "@openzeppelin/contracts/utils/Base64.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract BondsStorage is AccessControlRoleGroup, AccessControlProxy {
    mapping(uint256 => TypeBonds) mapBondTypes;
    mapping(uint256 => TreasuryBonds) mapBonds;
    uint256[] idxBondTypes;

    error BondsTypeNotExist(uint id);
    error BondsTypeExist(uint id);
    error ArrayWithDifferentSizes();
    error TreasuryBondsNotExist(uint256 id);
    error TreasuryBondsMaxSupply(uint256 id);

    constructor(address addrAcessControl) {
        AccessControlProxyInit(addrAcessControl);
    }

    function addBondsType(
        uint256 typeID,
        string memory nameType,
        string memory descriptionType,
        string memory feeType
    )
        external
        onlyRoleGroup(
            AccessControlRoleGroup.STN_GROUP,
            AccessControlRoleGroup.CREATE_TYPE_ROLE
        )
    {
        if (existsBondType(typeID)) {
            revert BondsTypeExist(typeID);
        }

        TypeBonds storage newBondsType = mapBondTypes[typeID];
        newBondsType.Description = descriptionType;
        newBondsType.Name = nameType;
        newBondsType.TypeID = typeID;
        newBondsType.Fee = feeType;
        idxBondTypes.push(typeID);
    }

    function getBondsType(
        uint256 typeId
    ) external view returns (uint256, string memory, string memory, uint256) {
        if (!existsBondType(typeId)) {
            revert BondsTypeNotExist(typeId);
        }

        TypeBonds storage resultBond = mapBondTypes[typeId];

        return (
            resultBond.TypeID,
            resultBond.Name,
            resultBond.Description,
            resultBond.MaxSupply
        );
    }

    function getBondsTypes() external view returns (uint256[] memory) {
        return idxBondTypes;
    }

    function addBondsTypeMetadata(
        uint256 typeId,
        uint[] memory metadataIds,
        Metadata[] memory metadatas
    )
        external
        onlyRoleGroup(
            AccessControlRoleGroup.STN_GROUP,
            AccessControlRoleGroup.CREATE_TYPE_ROLE
        )
    {
        if (!existsBondType(typeId)) {
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
        if (!existsBondType(typeId)) {
            revert BondsTypeNotExist(typeId);
        }

        TypeBonds storage typeBond = mapBondTypes[typeId];

        return typeBond.idxMetadatas;
    }

    function getBondsTypeMetadata(
        uint256 typeId,
        uint256 idMetadata
    ) public view returns (Metadata memory) {
        if (!existsBondType(typeId)) {
            revert BondsTypeNotExist(typeId);
        }

        TypeBonds storage typeBond = mapBondTypes[typeId];
        return typeBond.Metadatas[idMetadata];
    }

    function getBondsTypeMetadataRoleAcess(
        uint256 typeId,
        uint256 idMetadata
    ) public view returns (bytes32) {
        if (!existsBondType(typeId)) {
            revert BondsTypeNotExist(typeId);
        }

        TypeBonds storage typeBond = mapBondTypes[typeId];
        return typeBond.Metadatas[idMetadata].RoleAcess;
    }

    function createTreasuryBonds(
        Transaction calldata transaction
    )
        external
        onlyRoleGroup(
            AccessControlRoleGroup.STN_GROUP,
            AccessControlRoleGroup.CREATE_BOND_ROLE
        )
    {
        if (!existsBondType(transaction.TypeID)) {
            revert BondsTypeNotExist(transaction.TypeID);
        }

        TreasuryBonds storage treasuryBonds = mapBonds[transaction.Id];
        treasuryBonds.Id = transaction.Id;
        treasuryBonds.TypeID = transaction.TypeID;
        treasuryBonds.Name = transaction.Name;
        treasuryBonds.Code = transaction.Code;
        treasuryBonds.CodeISIN = transaction.CodeISIN;
        treasuryBonds.Amount = transaction.Amount;
        treasuryBonds.MaturityDate = transaction.MaturityDate;
    }

    function createTreasuryBondsValues(
        uint256 bondID,
        uint256[] calldata metadataIds,
        Values[] calldata values
    ) external onlyRole(AccessControlRoleGroup.CREATE_BOND_VALUES) {
        if (!existsTreasuryBonds(bondID)) {
            revert TreasuryBondsNotExist(bondID);
        }

        if (metadataIds.length != values.length) {
            revert ArrayWithDifferentSizes();
        }

        TreasuryBonds storage treasuryBonds = mapBonds[bondID];
        //verify roles
        bytes32 role;
        bool hasAcess =true;
        accessControl.verifyRole(role, msg.sender);

        for (uint256 i; i < metadataIds.length; i++) {
            role = getBondsTypeMetadataRoleAcess(
                treasuryBonds.TypeID,
                metadataIds[i]
            );
            accessControl.verifyRole(role, msg.sender);
            hasAcess = accessControl.verifyRole(role, msg.sender);
            if (!hasAcess) {
                revert ROLES_RequireRole(role);
            }
        }

        for (uint256 i; i < metadataIds.length; i++) {
            treasuryBonds.Values[metadataIds[i]] = values[i];
        }
    }

    function getTreasuryBondsValues(
        uint256 bondID
    ) external view returns (TreasuryBondsValue[] memory) {
        if (!existsTreasuryBonds(bondID)) {
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
            //TreasuryBondsValue memory tbondsValue;
            tBondsValues[i].Title = metadata.Title;
            tBondsValues[i]._Type = metadata._Type;
            tBondsValues[i].Description = metadata.Description;
            tBondsValues[i].Value = getStringValue(
                metadata._Type,
                treasuryBonds.Values[idxMetadatas[i]]
            );
        }

        return tBondsValues;
    }

    function constructTokenURI(
        uint256 bondID
    ) public view returns (string memory) {
        string memory name = "";
        string memory image = ""; //Base64.encode(bytes(generateSVGImage(params)));
        string memory description = "";

        TreasuryBonds storage treasuryBonds = mapBonds[bondID];
        TypeBonds storage typeBond = mapBondTypes[treasuryBonds.TypeID];

        name = string(
            abi.encodePacked(
                Strings.toString(treasuryBonds.Id),
                " - ",
                treasuryBonds.Code,
                "-",
                treasuryBonds.Name
            )
        );

        (uint year, uint month, uint day) = TimestampToDateYMD(
            treasuryBonds.MaturityDate
        );

        string memory date = string(
            abi.encodePacked(
                Strings.toString(day),
                "/",
                Strings.toString(month),
                "/",
                Strings.toString(year)
            )
        );

        description = string(
            abi.encodePacked(
                "ID:",
                Strings.toString(treasuryBonds.Id),
                "CODE:",
                treasuryBonds.Code,
                " | ",
                "Name:",
                treasuryBonds.Name,
                typeBond.Name,
                "-",
                typeBond.Description,
                " | ",
                "Amount:",
                Strings.toString(treasuryBonds.Amount),
                " | ",
                "Maturity Date:",
                date
            )
        );

        image = NFTRenderer.render(
            NFTRenderer.RenderParams({
                unitPrice: "???",
                amount: treasuryBonds.Amount,
                fee: typeBond.Fee,
                maturityDate: date,
                code: treasuryBonds.Code,
                codeISIN: treasuryBonds.CodeISIN,
                nameBonds: string(
                    abi.encodePacked(
                        treasuryBonds.Name,
                        " | ",
                        typeBond.Name,
                        "-",
                        typeBond.Description
                    )
                )
            })
        );

        image = Base64.encode(bytes(image));
        uint256[] memory idxMeta = typeBond.idxMetadatas;

        bytes memory attributes = "";
        bytes memory attr = "";
        bytes memory attrParcial;
        for (uint i = 0; i < idxMeta.length; i++) {
            Metadata memory meta = typeBond.Metadatas[idxMeta[i]];
            attrParcial = abi.encodePacked(
                '{ "trait_type": "',
                meta.Title,
                '" , ',
                '"value":"',
                getStringValue(meta._Type, treasuryBonds.Values[idxMeta[i]]),
                '"}'
            );

            if (i < idxMeta.length - 1) {
                attrParcial = abi.encodePacked(attrParcial, ",");
            }

            attr = abi.encodePacked(attr, attrParcial);
        }
        attributes = abi.encodePacked(attributes, attr);

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                name,
                                '", "description":"',
                                description,
                                '", "image": "',
                                "data:image/svg+xml;base64,",
                                image,
                                '", "attributes": [',
                                attributes,
                                "]}"
                            )
                        )
                    )
                )
            );
    }

    function existsBondType(uint256 id) public view returns (bool) {
        return mapBondTypes[id].TypeID != 0;
    }

    function existsTreasuryBonds(
        uint256 id
    ) public view virtual returns (bool) {
        return mapBonds[id].Id != 0;
    }
}
