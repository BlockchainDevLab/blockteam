// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./security/AccessControlProxy.sol";

contract AccessControlRoleGroup {

    bytes32 constant B3_GROUP = "b3_group";

    bytes32 constant STN_GROUP = "stn_group";

    bytes32 constant ISSUE_ROLE = "issue_role";

    bytes32 constant CREATE_TYPE_ROLE = "create_type_role";

    bytes32 constant CREATE_BOND_ROLE = "create_bond_role";

    bytes32 constant CREATE_BOND_VALUES = "create_bond_values_role";
}
