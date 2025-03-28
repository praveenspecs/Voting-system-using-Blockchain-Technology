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