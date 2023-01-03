// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

/**
 * @title Spectre Token
 * @author Arian Hosseini
 * @notice A Simple ERC-20 Token
 */
contract SpectreToken {
    /// @notice EIP-20 token name for this token
    string public constant name = "Spectre";

    /// @notice EIP-20 token symbol for this token
    string public constant symbol = "SPEC";

    /// @notice EIP-20 token decimals for this token
    uint8 public constant decimals = 18;

    /// @notice Total number of tokens in circulation
    uint256 public totalSupply = 1000000e18; // 1 million SPEC

	/// @notice Official record of token balances for each account
    mapping (address => uint256) internal balances;

    constructor() {
        balances[msg.sender] = totalSupply;
    }

	/**
		* @notice Get the number of tokens held by the `account`
		* @param account The address of the account to get the balance of
		* @return The number of tokens held
	*/
    function balanceOf(address account) public view returns (uint256) {
        return balances[account];
    }
}
