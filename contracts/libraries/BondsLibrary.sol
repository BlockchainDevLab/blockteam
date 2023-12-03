// SPDX-License-Identifier: MIT
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

pragma solidity ^0.8.20;

struct TypeBonds {
    uint256 TypeID;
    string Name;
    string Description;
    uint256[] idxMetadatas;
    mapping(uint256 => Metadata) Metadatas;
}

struct TreasuryBonds {
    uint256 Id;
    uint256 TypeID;
    string Code;
    string CodeISIN;
    string Name;
    uint256 MaturityDate;
    uint256 Amount;
    mapping(uint256 => Values) Values;
}

struct Metadata {
    string Title;
    string _Type;
    string Description;
    bytes32 RoleAcess;
}

struct Values {
    string stringValue;
    uint uintValue;
    address addressValue;
    bool boolValue;
    bytes32 bytesValue;
}

struct TreasuryBondsValue {
    string Title;
    string _Type;
    string Description;
    string Value;
}

struct Transaction {
    uint256 Id;
    uint256 TypeID;
    string Name;
    string Code;
    string CodeISIN;
    uint256 Amount;
    uint256 MaturityDate;
}


function getStringValue(
    string memory typeValue,
    Values memory values
) pure returns (string memory) {
    string memory vl = "";
    if (Strings.equal(typeValue, "int")) {
        vl = Strings.toString(values.uintValue);
    } else if (Strings.equal(typeValue, "string")) {
        vl = values.stringValue;
    } else if (Strings.equal(typeValue, "address")) {
        vl = Strings.toHexString(values.addressValue);
    } else if (Strings.equal(typeValue, "bool")) {
        vl = values.boolValue ? "true" : "false";
    } else if (Strings.equal(typeValue, "bytes32")) {
        vl = string(abi.encodePacked(values.bytesValue));
    } else {
        vl = "";
    }

    return vl;
}

//code ISIN :US-000402625-0   NA-000K0VF05-4 BRSTNCLTN7S1  BRSTNCLTN7W3 BRSTNCNTB682  BRSTNCNTB0A6
