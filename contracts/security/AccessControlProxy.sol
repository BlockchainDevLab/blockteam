// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./AccessControl.sol";

contract AccessControlProxy  {
    AccessControl accessControl;

    // =========  ERRORS ========= //
    error ROLES_RequireRole(bytes32 role);
    error ROLES_RequireRoleGroup(bytes32 group, bytes32 role);

    //======MODIFIER ==========//
    modifier onlyRole(bytes32 role) {
        if (!accessControl.verifyRole(role, msg.sender))
            revert ROLES_RequireRole(role);
        _;
    }

    modifier onlyRoleGroup(bytes32 group, bytes32 role) {
        if (!accessControl.verifyRoleGroup(group, role, msg.sender))
            revert ROLES_RequireRoleGroup(group, role);
        _;
    }

  
    constructor() {
       
    }

    function  AccessControlProxyInit(
        address addrAccessControl
    ) internal {
        accessControl = AccessControl(addrAccessControl);
    }

    function getAccessControl() external view returns (address) {
        return address(accessControl);
    }

    function getAuthorizationControl() external view returns (address) {
        return accessControl.getAuthorizationControl();
    }
}
