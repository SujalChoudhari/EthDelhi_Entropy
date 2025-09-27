// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RatingSystem {
    // Stores the total cumulative rating score for an item ID
    mapping(uint256 => uint256) public totalScores;

    // Stores the number of individual ratings submitted for an item ID
    mapping(uint256 => uint256) public numRatings;

    // Event to log successful rating submissions for off-chain monitoring
    event RatingSubmitted(uint256 indexed itemId, uint8 rating, address rater);

    /**
     * @notice Allows a user to submit a rating for a specific item.
     * @param _itemId The unique identifier of the item being rated.
     * @param _rating The rating value (e.g., 1 to 5).
     */
    function submitRating(uint256 _itemId, uint8 _rating) public {
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");
        
        totalScores[_itemId] += _rating;
        numRatings[_itemId]++;

        emit RatingSubmitted(_itemId, _rating, msg.sender);
    }
    
    /**
     * @notice Calculates the integer average rating for an item.
     * @param _itemId The unique identifier of the item.
     * @return The average rating (integer division).
     */
    function getAverageRating(uint256 _itemId) public view returns (uint256) {
        if (numRatings[_itemId] == 0) {
            return 0;
        }
        // Integer division is used here for simplicity.
        return totalScores[_itemId] / numRatings[_itemId];
    }
}