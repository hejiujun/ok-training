//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Treasury.sol";
import "./Comm.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

contract Gov {
    address public treasury;
    address public comm;
    uint256 proposalThreshold = 10e18; // 10 = 1 of COM
    uint256 succeeded = 10;
    uint256 failed = 10;
    bool active = false;
    uint256 startDelayPeriod = 0;
    uint256 endDelayPeriod = startDelayPeriod + 3 days;
    /// @notice The total number of proposals
    uint256 public proposalCount;
    bool unlock = false;

    struct Voter {
        /// @notice Whether or not a vote has been cast
        bool hasVoted;
        /// @notice Whether or not the voter supports the proposal
        bool support;
        /// @notice The number of votes the voter had, which were cast
        uint256 votes;
    }
    struct Proposal {
        uint256 id;
        address proposer;
        uint256 forVotes;
        uint256 againstVotes;
    }
    mapping(uint256 => Proposal) public proposals;
    mapping(address => Voter) public voters;

    constructor(
        address _comm,
        address _treasury,
        uint256 proposalId
    ) public {
        treasury = _treasury;
        comm = _comm;
        active = true;
        Proposal memory newProposal = Proposal({
            id: proposalId,
            proposer: msg.sender,
            forVotes: 0,
            againstVotes: 0
        });
        proposals[newProposal.id] = newProposal;
    }

    function vote(
        address voter,
        uint256 proposalId,
        bool support
    ) public {
        require(active, "not active proposal");
        Proposal storage proposal = proposals[proposalId];
        Voter storage sender = voters[voter];
        require(!sender.hasVoted, "Already voted.");
        uint256 balance = Comm(comm).balanceOf(msg.sender);
        require(
            balance >= proposalThreshold,
            "proposer votes below proposal threshold"
        );
        uint256 votes = SafeMath.div(balance, proposalThreshold);

        if (support) {
            proposal.forVotes = SafeMath.add(proposal.forVotes, votes);
        } else {
            proposal.againstVotes = SafeMath.add(proposal.againstVotes, votes);
        }

        sender.hasVoted = true;
        sender.support = support;
        sender.votes = votes;

        if (!unlock && proposal.forVotes >= succeeded) {
            startDelayPeriod = block.timestamp;
        }
    }

    function propose(uint256 proposalId) external {
         console.log("proposals[1].forVotes:", proposals[proposalId].forVotes);
        require(
            proposals[proposalId].forVotes >= succeeded,
            "cannot executed proposal"
        );
        require(block.timestamp >= endDelayPeriod, "invalid time");
        Treasury(treasury).withdraw(msg.sender);
    }
}
