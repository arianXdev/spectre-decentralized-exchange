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

    /// @notice a record of all orders
    mapping (uint256 => _Order) public orders;

    /// @notice a record of all cancelled orders
    mapping (uint256 => bool) public cancelledOrders;

    uint256 public orderCount;


    /// @notice a record of all deposited amounts of each user for all tokens
    mapping (address => mapping (address => uint256)) internal depositedTokens;

    event Deposit(address token, address user, uint256 amount, uint256 balance);
    event Withdraw(address token, address user, uint256 amount, uint256 balance);
    event Order(
        uint256 id,
        address user,
        address tokenGet, 
        uint256 amountGet,
        address tokenGive, 
        uint256 amountGive,
        uint256 timestamp
    );
    event CancelOrder(
        uint256 id,
        address user,
        address tokenGet, 
        uint256 amountGet,
        address tokenGive, 
        uint256 amountGive,
        uint256 timestamp
    );

    // A way to model the order
    struct _Order {
        uint256 id; // unique identifer for each order
        address user; // the user who made the order
        address tokenGet; // address of the token they receive
        uint256 amountGet; // amount they receive
        address tokenGive; // address of the token they give
        uint256 amountGive; // amount they give
        uint256 timestamp; // when order was created
    }

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

    // ORDERS
    /// @param _tokenGive (the token they want to spend) - which token, and how much (_amountGive)?
    /// @param _tokenGet (the token they want to receive) - which token, and how much (_amountGet)?
    function makeOrder(address _tokenGet, uint _amountGet, address _tokenGive, uint256 _amountGive) public {
        require(balanceOf(_tokenGive, msg.sender) >= _amountGive, "You haven't deposited any tokens yet!");

        orderCount += 1;
        orders[orderCount] = _Order(
            orderCount,
            msg.sender,
            _tokenGet, 
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );

        emit Order(orderCount, msg.sender, _tokenGet, _amountGet, _tokenGive, _amountGive, block.timestamp);
    }

    function cancelOrder(uint256 _id) public {

        // Fetching the order
        _Order storage order = orders[_id];

        // Ensure the caller of the function is the owner of the order
        require(address(order.user) == msg.sender);

        // Order must exist
        require(order.id == _id, "the Order not found!"); 

        // Cancel the order
        cancelledOrders[_id] = true;

        emit CancelOrder(order.id, msg.sender, order.tokenGet, order.amountGet, order.tokenGive, order.amountGive, block.timestamp);
    }

    function fillOrder(uint256 _id) public {
        // Fetch the order
        _Order storage order = orders[_id];

        // Swapping Tokens (Trading)
        _trade(order.id, order.user, order.tokenGet, order.amountGet, order.tokenGive, order.amountGive);
    }

    function _trade(uint256 _orderId, address _user, address _tokenGet, uint256 _amountGet, address _tokenGive, uint256 _amountGive) internal {
        // Fee is paid by the user who filled the order (msg.sender)
        // Fee is deducted from _amountGet
        uint256 _feeAmount = (_amountGet * feePercent) / 100;

        // Execute the trade
        // msg.sender is the user who is filled the order, while _user is who created the order
        depositedTokens[_tokenGet][msg.sender] -= _amountGet + _feeAmount;
        depositedTokens[_tokenGet][_user] += _amountGet;

        // Charge fees
        depositedTokens[_tokenGet][feeAccount] += _feeAmount;

        depositedTokens[_tokenGive][_user] -= _amountGive;
        depositedTokens[_tokenGive][msg.sender] += _amountGive;
    }
}
