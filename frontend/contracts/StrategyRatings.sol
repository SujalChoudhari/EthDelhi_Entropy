// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StrategyRatings {
    struct RatingInfo {
        uint256 totalScore;
        uint256 numRatings;
        mapping(address => bool) hasRated;
    }

    mapping(string => RatingInfo) private ratings;

    event Rated(string indexed strategyId, address indexed rater, uint8 score);

    function rate(string calldata strategyId, uint8 score) external {
        require(score >= 1 && score <= 5, "Score must be 1-5");
        RatingInfo storage info = ratings[strategyId];
        require(!info.hasRated[msg.sender], "Already rated");
        info.totalScore += score;
        info.numRatings += 1;
        info.hasRated[msg.sender] = true;
        emit Rated(strategyId, msg.sender, score);
    }

    function getRating(string calldata strategyId) external view returns (uint256 average, uint256 count) {
        RatingInfo storage info = ratings[strategyId];
        if (info.numRatings == 0) {
            return (0, 0);
        }
        return (info.totalScore / info.numRatings, info.numRatings);
    }
}
