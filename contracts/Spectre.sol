// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SpectreToken.sol";
import "./Token.sol";

/**
 * @title Spectre Decentralized Exchange
 * @author Arian Hosseini
 * @notice the smart contract that handles all the functionalities of Spectre DEX
 */
contract Spectre { 
    address public feeAccount;
    uint24 public feePercent;


    /// @notice a record of all deposited amounts of each user for all tokens
    mapping (address => mapping (address => uint256)) internal depositedTokens;

    event Deposit(address token, address user, uint256 amount, uint256 balance);

    constructor(address _feeAccount, uint24 _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }
}
