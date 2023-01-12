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

    /// @notice deposit lets users deposit their token into the exchange
    function deposit(address _tokenAddress, uint256 _amount) public {
        if (_tokenAddress == address(Token(_tokenAddress))) {
            require(Token(_tokenAddress).transferFrom(msg.sender, address(this), _amount));
            depositedTokens[_tokenAddress][msg.sender] += _amount;
            
        } else if (_tokenAddress == address(SpectreToken(_tokenAddress))) {
            
            require(SpectreToken(_tokenAddress).transferFrom(msg.sender, address(this), _amount));
            depositedTokens[_tokenAddress][msg.sender] += _amount;
        }

        emit Deposit(_tokenAddress, msg.sender, _amount, depositedTokens[_tokenAddress][msg.sender]);
    } 

    /// @notice get the deposited amount of each user for all tokens
     function balanceOf(address _token, address _user) public view returns (uint256 depositedBalance) {
        return depositedTokens[_token][_user];
    }
}
