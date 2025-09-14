// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Counter} from "../src/Counter.sol";

contract CounterScript is Script {
    Counter public counter;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        counter = new Counter();

        vm.stopBroadcast();

        // Export contract address and ABI for frontend use
        console.log("Counter deployed at:", address(counter));
        console.log("ABI:", "Counter.json will be generated in out/Counter.sol/Counter.json");
    }
}
