// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

/**
 * @title Configurable Token
 * @author Arian Hosseini
 * @notice A Simple ERC-20 Token
 */
contract Token {
    /// @notice EIP-20 token name for this token
    string public name;

    /// @notice EIP-20 token symbol for this token
    string public symbol;

    /// @notice EIP-20 token decimals for this token
    uint8 public decimals = 18;

    /// @notice Total number of tokens in circulation
    uint256 public totalSupply;

	/// @notice Official record of token balances for each account
	mapping (address => uint256) internal balances;

    constructor(string memory _name, string memory _symbol, uint256 _totalSupply) {
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply * (10 ** decimals);
    }

	function balanceOf(address account) public view returns (uint256 balance) {
		return balances[account];
	}
}
