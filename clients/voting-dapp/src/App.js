import { useState, useEffect } from "react";
import { ethers } from "ethers";
import VotingSystem from "./artifacts/contracts/VotingSystem.sol/VotingSystem.json"
import VotingToken from "./artifacts/contracts/VotingToken.sol/VotingToken.json"

const VOTING_TOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const VOTING_SYSTEM_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

function App() {
  const [account, setAccount] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [contract, setContract] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [voteAmount, setVoteAmount] = useState("");
  const [newProposal, setNewProposal] = useState("");
  const [votingToken, setVotingToken] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        
        const votingToken = new ethers.Contract(VOTING_TOKEN_ADDRESS, VotingToken.abi, signer);
        const votingSystem = new ethers.Contract(VOTING_SYSTEM_ADDRESS, VotingSystem.abi, signer);
        setVotingToken(votingToken);
        setContract(votingSystem);

        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);

        // const code = await provider.getCode(VOTING_TOKEN_ADDRESS);
        // console.log("Contract Code:", code);
        // if (code === "0x") {
        //   console.error("Error: No contract deployed at this address!");
        // }

        // const votingSystemOwner = await votingSystem.owner();
        // console.log("Contract votingSystem Owner Address:", votingSystemOwner);


        // const votingTokenOwner = await votingToken.owner();
        // console.log("Contract votingToken Owner Address:", votingTokenOwner);


        const balance = await votingToken.balanceOf(accounts[0]);

        console.log("User Balance:", ethers.utils.formatEther(balance));

        
        setTokenBalance(ethers.utils.formatEther(balance));

        const proposals = await votingSystem.getProposals();
        setProposals(proposals);
      }
    };
    init();
  }, []);

  const createProposal = async () => {
    const tx = await contract.createProposal(newProposal);
    await tx.wait();
    window.location.reload();
  };

  const vote = async (proposalId) => {
    // console.log("------------proposalId------", proposalId, "---------------voteAmount---------", voteAmount);
    // const tx = await contract.vote(proposalId, ethers.utils.parseEther(voteAmount));
    // await tx.wait();
    // window.location.reload();

    const tx = await votingToken.approve(VOTING_SYSTEM_ADDRESS, ethers.utils.parseEther(voteAmount)); // Approve 2 tokens
    await tx.wait();
    await contract.vote(proposalId, ethers.utils.parseEther(voteAmount));
    window.location.reload();

  };

  return (
    <div>
      <h1>Token-Based Voting DApp</h1>
      {account ? <p>Connected: {account}</p> : <p>Please connect your wallet</p>}
      <p>Balance: {tokenBalance} VOTE</p>

      <h2>Create Proposal</h2>
      <input onChange={(e) => setNewProposal(e.target.value)} placeholder="Proposal description" />
      <button onClick={createProposal}>Submit</button>

      <h2>Proposals</h2>
      {proposals.map((p, i) => (
        <div key={i}>
          <p>{p.description} - Votes: {p.voteCount.toString()}</p>
          <input onChange={(e) => setVoteAmount(e.target.value)} placeholder="Amount to vote" />
          <button onClick={() => vote(i)}>Vote</button>
        </div>
      ))}
    </div>
  );
}

export default App;
