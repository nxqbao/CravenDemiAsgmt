// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Counter} from "../src/Counter.sol";

contract CounterTest is Test {
    Counter public counter;

    event CountChanged(uint256 newCount);

    function setUp() public {
        counter = new Counter();
    }

    function test_InitialCount() public {
        assertEq(counter.count(), 0);
    }

    function test_Increment() public {
        counter.increment();
        assertEq(counter.count(), 1);
    }

    function test_IncrementEmitsEvent() public {
        vm.expectEmit(true, true, true, true);
        emit CountChanged(1);
        counter.increment();
    }

    function test_Decrement() public {
        counter.increment(); // count = 1
        counter.decrement();
        assertEq(counter.count(), 0);
    }

    function test_DecrementEmitsEvent() public {
        counter.increment(); // count = 1
        vm.expectEmit(true, true, true, true);
        emit CountChanged(0);
        counter.decrement();
    }

    function test_DecrementBelowZeroReverts() public {
        vm.expectRevert("Count cannot go below 0");
        counter.decrement();
    }

    function test_MultipleOperations() public {
        counter.increment();
        counter.increment();
        assertEq(counter.count(), 2);

        counter.decrement();
        assertEq(counter.count(), 1);

        counter.decrement();
        assertEq(counter.count(), 0);
    }
}
