// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Spectre Decentralized Exchange
 * @author Arian Hosseini
 * @notice the smart contract that handles all the functionalities of Spectre DEX
 */
contract Spectre { 
    address public feeAccount;

    constructor(address _feeAccount) {
        feeAccount = _feeAccount;
    }
}
