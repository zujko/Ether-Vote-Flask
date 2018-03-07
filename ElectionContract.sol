pragma solidity ^0.4.20;

contract Election {

  // Represents a Candidate in the election
  struct Candidate {
    bytes32 name;
    uint voteCount;
  }
  
  // Represents a single voter
  // voted specifies if they have already voted
  // voteIndex specifies who they voted for
  // weight makes sure only people we authorize can vote
  struct Voter {
    bool voted;
    uint voteIndex;
    uint weight;
  }
  
  // This address represents the person who created the contract
  // and who can authorize voters
  address public owner;

  // Name of the election
  string public name;

  // Hash table which represents an address and voter object
  // The address is the address of the Voter
  mapping(address => Voter) public voters;

  // public list of Candidate's in the election
  Candidate[] public candidates;

  uint public electionEnd;

  event ElectionResult(bytes32 name, uint voteCount);

  function getElectionName() constant returns(string) {
    return name;
  }

  // Constructor
  function Election(string _name, uint durationMin, bytes32[] candidateLst) {
    owner = msg.sender; 
    name = _name;
    
    // the 'now' variable is the creation time of the current block
    electionEnd = now + (durationMin * 1 minutes);

    for(uint x=0; x < candidateLst.length; x++) {
      candidates.push(Candidate(candidateLst[x], 0));
    }
  }

  // voteIndex is the index of the candidate in the list
  function vote(uint voteIndex) {
    // Make sure election has not ended
    require(now < electionEnd);

    // Make sure voter has not already voted
    require(!voters[msg.sender].voted);
    
    candidates[voteIndex].voteCount += voters[msg.sender].weight;

    voters[msg.sender].voteIndex = voteIndex;
    voters[msg.sender].voted = true; 
  }


  function authorizeVoters(address[] _voters) {
    // Ensure only the owner can authorize users
    require(msg.sender == owner);

    for(uint x=0; x < _voters.length; x++) {
      address voter = _voters[x];
      if(!voters[voter].voted) {
        voters[voter].weight = 1;
      } else {
        continue;
      }
    }
  }
  
  function electionResult() {
    // Ensure only owner can see result
    require(msg.sender == owner);
    // Ensure election is actually over
    require(now >= electionEnd);

    for(uint x=0; x < candidates.length; x++) {
      ElectionResult(candidates[x].name, candidates[x].voteCount);
    }
  }

  function getCandidatesCount() public constant returns(uint) {
    return candidates.length;
  }

  function getUser(uint index) public constant returns(bytes32, uint) {
    return (candidates[index].name, candidates[index].voteCount);
  }

}
