// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ContentStore {
    mapping(uint256 => string) public cidOf;

    event CIDStored(uint256 indexed id, string cid);

    function storeCID(uint256 id, string calldata cid) external {
        cidOf[id] = cid;
        emit CIDStored(id, cid);
    }

    function getCID(uint256 id) external view returns (string memory) {
        return cidOf[id];
    }
}
