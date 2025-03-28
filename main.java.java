import { SHA256 } from "crypto-js";

// Block Class - Represents each block in the blockchain
class Block {
  constructor(timestamp, votes, previousHash = "") {
    this.timestamp = timestamp;
    this.votes = votes;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.previousHash +
        this.timestamp +
        JSON.stringify(this.votes) +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }
}

// Blockchain Class - Manages the entire chain
class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingVotes = [];
  }

  createGenesisBlock() {
    return new Block(Date.now(), [], "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addVote(voter, candidate) {
    this.pendingVotes.push({
      voter,
      candidate,
      timestamp: Date.now(),
    });
  }

  minePendingVotes() {
    const block = new Block(
      Date.now(),
      this.pendingVotes,
      this.getLatestBlock().hash
    );
    block.mineBlock(this.difficulty);
    this.chain.push(block);
    this.pendingVotes = [];
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }

  getVoteCount() {
    const voteCount = {};
    for (const block of this.chain) {
      for (const vote of block.votes) {
        voteCount[vote.candidate] = (voteCount[vote.candidate] || 0) + 1;
      }
    }
    return voteCount;
  }

  hasVoted(voter) {
    return this.chain.some(block => 
      block.votes.some(vote => vote.voter === voter)
    );
  }
}
import React, { useState } from "react";
import { motion } from "framer-motion";
import { votingChain } from "./blockchain";

const VotingSystem = () => {
  const [voter, setVoter] = useState("");
  const [candidate, setCandidate] = useState("");
  const [results, setResults] = useState({});

  const handleVote = () => {
    if (!voter || !candidate) {
      alert("Please fill in all fields");
      return;
    }

    if (votingChain.hasVoted(voter)) {
      alert("You have already voted");
      return;
    }

    try {
      votingChain.addVote(voter, candidate);
      votingChain.minePendingVotes();
      alert("Vote recorded successfully!");
      setVoter("");
      setCandidate("");
      updateResults();
    } catch (error) {
      alert("Failed to record vote");
    }
  };

  const updateResults = () => {
    setResults(votingChain.getVoteCount());
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-lg p-8 shadow-xl"
        >
          <h1 className="text-3xl font-bold mb-8 text-center">
            Blockchain Voting System
          </h1>

          {/* Voting Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Voter ID
              </label>
              <input
                type="text"
                value={voter}
                onChange={(e) => setVoter(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-700"
                placeholder="Enter your voter ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Candidate
              </label>
              <input
                type="text"
                value={candidate}
                onChange={(e) => setCandidate(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-700"
                placeholder="Enter candidate name"
              />
            </div>

            <button
              onClick={handleVote}
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded"
            >
              Cast Vote
            </button>
          </div>

          {/* Results Display */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            <div className="space-y-2">
              {Object.entries(results).map(([candidate, votes]) => (
                <div
                  key={candidate}
                  className="flex justify-between items-center bg-gray-700 p-3 rounded"
                >
                  <span>{candidate}</span>
                  <span className="font-bold">{votes} votes</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VotingSystem;