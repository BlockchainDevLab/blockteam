// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

abstract contract Master {
    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    event MasterTransferred(address indexed user, address indexed newMaster);

    /*//////////////////////////////////////////////////////////////
                            OWNERSHIP STORAGE
    //////////////////////////////////////////////////////////////*/

    address public master;

    modifier onlyMaster() virtual {
        require(msg.sender == master, "UNAUTHORIZED");

        _;
    }

    /*//////////////////////////////////////////////////////////////
                               CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor(address _master) {
        master = _master;

        emit MasterTransferred(address(0), _master);
    }

    /*//////////////////////////////////////////////////////////////
                             OWNERSHIP LOGIC
    //////////////////////////////////////////////////////////////*/

    function transferMaster(address newMaster) public virtual onlyMaster {
        require(newMaster != address(0), "Invalid address(0)");
        master = newMaster;
        emit MasterTransferred(msg.sender, newMaster);
    }
}
