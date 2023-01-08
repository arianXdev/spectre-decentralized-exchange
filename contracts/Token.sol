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

	/// @notice Allowance amounts on behalf of others
    mapping (address => mapping (address => uint256)) public allowance; 

    /// @notice The standard EIP-20 Transfer event
    event Transfer(address indexed from, address indexed to, uint256 amount);

    /// @notice The standard EIP-20 Approval event
    event Approval(address indexed owner, address indexed spender, uint256 amount);


    constructor(string memory _name, string memory _symbol, uint256 _totalSupply) {
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply * (10 ** decimals);
		balances[msg.sender] = totalSupply;
        /// @dev A token contract which creates new tokens SHOULD trigger a Transfer event with the _from address set to 0x0 when tokens are created.
        emit Transfer(address(0), msg.sender, totalSupply);
    }

	/**
		* @notice Get the number of tokens held by the `account`
		* @param account The address of the account to get the balance of
		* @return The number of tokens held
	*/
	function balanceOf(address account) public view returns (uint256) {
		return balances[account];
	}

    function transfer(address _to, uint256 _value) public returns (bool success) {
        // Require that sender has enough tokens to spend
        require(balanceOf(msg.sender) >= _value, "Not enough tokens!");

        // Deduct tokens from the spender
        balances[msg.sender] -= _value;
        // Credit tokens to receiver
        balances[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    /// @notice approve function allows _spender (third-party) to withdraw from your account multiple times, up to the _value (using transferFrom)
    // the preson who's approving and calling this function is always msg.sender
    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);
        return true;
    }
}
