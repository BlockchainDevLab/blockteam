// SPDX-License-Identifier: MIT

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
    bytes bytesValue;
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

//code ISIN :US-000402625-0   NA-000K0VF05-4 BRSTNCLTN7S1  BRSTNCLTN7W3 BRSTNCNTB682  BRSTNCNTB0A6
