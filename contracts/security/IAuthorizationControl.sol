// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IAuthorizationControl {
    function ensureValidName(bytes32 role) external;

    function requireRole(
        bytes32 role,
        address caller
    ) external view returns (bool);

    function requireRoleGroup(
        bytes32 group,
        bytes32 role,
        address caller
    ) external view returns (bool);

    function getMaster() external view returns (address);
}
