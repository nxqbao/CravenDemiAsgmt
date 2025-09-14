// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Counter {
    uint256 public count;

    event CountChanged(uint256 newCount);

    function increment() public {
        count++;
        emit CountChanged(count);
    }

    function decrement() public {
        require(count > 0, "Count cannot go below 0");
        count--;
        emit CountChanged(count);
    }
}
