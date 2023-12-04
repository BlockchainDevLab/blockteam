// SPDX-License-Identifier: MIT
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

pragma solidity ^0.8.20;

struct TypeBonds {
    uint256 TypeID;
    string Name;
    string Description;
    string Fee; 
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


// ------------------------------------------------------------------------
    // Calculate year/month/day from the number of days since 1970/01/01 using
    // the date conversion algorithm from
    //   http://aa.usno.navy.mil/faq/docs/JD_Formula.php
    // and adding the offset 2440588 so that 1970/01/01 is day 0
    //
    // int L = days + 68569 + offset
    // int N = 4 * L / 146097
    // L = L - (146097 * N + 3) / 4
    // year = 4000 * (L + 1) / 1461001
    // L = L - 1461 * year / 4 + 31
    // month = 80 * L / 2447
    // dd = L - 2447 * month / 80
    // L = month / 11
    // month = month + 2 - 12 * L
    // year = 100 * (N - 49) + year + L
    // ------------------------------------------------------------------------

    uint constant SECONDS_PER_DAY = 24 * 60 * 60;
    uint constant SECONDS_PER_HOUR = 60 * 60;
    uint constant SECONDS_PER_MINUTE = 60;
    int constant OFFSET19700101 = 2440588;

    function _daysToDate(
        uint _days
    )  pure returns (uint year, uint month, uint day) {
        int __days = int(_days);

        int L = __days + 68569 + OFFSET19700101;
        int N = (4 * L) / 146097;
        L = L - (146097 * N + 3) / 4;
        int _year = (4000 * (L + 1)) / 1461001;
        L = L - (1461 * _year) / 4 + 31;
        int _month = (80 * L) / 2447;
        int _day = L - (2447 * _month) / 80;
        L = _month / 11;
        _month = _month + 2 - 12 * L;
        _year = 100 * (N - 49) + _year + L;

        year = uint(_year);
        month = uint(_month);
        day = uint(_day);
    }

    function TimestampToDateYMD(
        uint timestamp
    )  pure returns (uint year, uint month, uint day) {
        (year, month, day) = _daysToDate(timestamp / SECONDS_PER_DAY);
    }
