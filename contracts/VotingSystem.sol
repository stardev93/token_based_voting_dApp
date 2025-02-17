// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract VotingSystem {
    IERC20 public voteToken;
    address public owner;

    struct Proposal {
        string description;
        uint256 voteCount;
    }

    Proposal[] public proposals;
    
    mapping(address => mapping(uint256 => bool)) public hasVoted;

    event ProposalCreated(uint256 proposalId, string description);
    event Voted(address indexed voter, uint256 proposalId, uint256 amount);

    constructor(address tokenAddress) {
        voteToken = IERC20(tokenAddress);
        owner = msg.sender;
    }

    function createProposal(string memory _description) public {
        require(msg.sender == owner, "Only owner can create proposals");
        proposals.push(Proposal({description: _description, voteCount: 0}));
        emit ProposalCreated(proposals.length - 1, _description);
    }

    function vote(uint256 proposalId, uint256 amount) public {
        require(proposalId < proposals.length, "Proposal does not exist");
        require(!hasVoted[msg.sender][proposalId], "Already voted");
        require(voteToken.balanceOf(msg.sender) >= amount, "Not enough tokens");

        voteToken.transferFrom(msg.sender, owner, amount);
        proposals[proposalId].voteCount += amount;
        hasVoted[msg.sender][proposalId] = true;

        emit Voted(msg.sender, proposalId, amount);
    }

    function getProposals() public view returns (Proposal[] memory) {
        return proposals;
    }
}
