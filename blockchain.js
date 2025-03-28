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