// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
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
    event Withdraw(address token, address user, uint256 amount, uint256 balance);


    constructor(address _feeAccount, uint24 _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    /// @notice deposit lets users deposit their token into the exchange
    function deposit(address _tokenAddr, uint256 _amount) public {
        if (_tokenAddr == address(Token(_tokenAddr))) {
            require(Token(_tokenAddr).transferFrom(msg.sender, address(this), _amount));
            depositedTokens[_tokenAddr][msg.sender] += _amount;
            
        } else if (_tokenAddr == address(SpectreToken(_tokenAddr))) {
            
            require(SpectreToken(_tokenAddr).transferFrom(msg.sender, address(this), _amount));
            depositedTokens[_tokenAddr][msg.sender] += _amount;
        }

        emit Deposit(_tokenAddr, msg.sender, _amount, depositedTokens[_tokenAddr][msg.sender]);
    } 

    /// @notice withdraw lets users withdraw their tokens
    function withdraw(address _tokenAddr, uint256 _amount) public {
        require(depositedTokens[_tokenAddr][msg.sender] >= _amount, "You haven't deposited any tokens yet!");

        if (_tokenAddr == address(Token(_tokenAddr))) {
            Token(_tokenAddr).transfer(msg.sender, _amount);
            depositedTokens[_tokenAddr][msg.sender] -= _amount;
        } else if (_tokenAddr == address(SpectreToken(_tokenAddr))) {
            SpectreToken(_tokenAddr).transfer(msg.sender, _amount);
            depositedTokens[_tokenAddr][msg.sender] -= _amount;
        }

        emit Withdraw(_tokenAddr, msg.sender, _amount, depositedTokens[_tokenAddr][msg.sender]);
    }

    /// @notice get the deposited amount of each user for all tokens
    /// @param _token is the token contract address
     function balanceOf(address _token, address _user) public view returns (uint256 depositedBalance) {
        return depositedTokens[_token][_user];
    }
}
