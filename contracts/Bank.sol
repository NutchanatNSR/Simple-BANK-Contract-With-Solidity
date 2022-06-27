// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Bank {
    mapping(address => uint256) public balance;
    uint256 public timeNow;

    struct detailList {
        address owner;
        uint256 amt_deposit; //amt = amount
        uint256 amt_withdraw;
        uint256 time;
    }

    mapping(address => detailList[]) public list;

    function Deposit(uint256 _amount) public {
        require(_amount > 0);
        balance[msg.sender] += _amount; //บวกเงินฝากเข้า

        timeNow = block.timestamp;

        createBankbook(msg.sender, _amount, 0, timeNow);
    }

    function Withdraw(uint256 _amount) public {
        require(balance[msg.sender] >= _amount, "Amount is more than balance."); //เช็คจำนวนที่ต้องการถอนมีน้อยกว่าหรือเท่ากับในบัญชี
        //payable(msg.sender).transfer(_amount); //โอนเงินจำนวน amount to sender
        balance[msg.sender] -= _amount; //แล้วทำการลบเงินตามจำนวนที่ถอน

        timeNow = block.timestamp;

        createBankbook(msg.sender, 0, _amount, timeNow);
    }

    function myBalance() public view returns (uint256) {
        return balance[msg.sender];
    }

    function createBankbook(
        address adr,
        uint256 amt_deposit,
        uint256 amt_withdraw,
        uint256 time
    ) public {
        list[msg.sender].push(detailList(adr, amt_deposit, amt_withdraw, time));
    }

    function myBankbook() public view returns (detailList[] memory) {
        return list[msg.sender];
    }
}
