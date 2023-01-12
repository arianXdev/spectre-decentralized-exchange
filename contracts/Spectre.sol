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

    constructor(address _feeAccount, uint24 _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }
}
