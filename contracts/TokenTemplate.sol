// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20CappedUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract TokenTemplate is
    Initializable,
    ERC20CappedUpgradeable,
    ERC20BurnableUpgradeable,
    OwnableUpgradeable
{
    constructor() {}

    function initialize(
        string memory nm,
        string memory symbol,
        address owner,
        uint256 totalSupply
    ) public initializer {
        __ERC20_init(nm, symbol);
        __ERC20Burnable_init();
        __Ownable_init(owner);
        __ERC20Capped_init(totalSupply);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        //require(totalSupply() + amount <= cap(), "TOKEN: limit exceeded");
        _mint(to, amount);
    }

    function _update(
        address from,
        address to,
        uint256 value
    ) internal virtual override(ERC20CappedUpgradeable, ERC20Upgradeable) {
        super._update(from, to, value);
    }
}
