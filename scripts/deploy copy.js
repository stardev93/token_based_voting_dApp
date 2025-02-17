const hre = require("hardhat");
async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with:", deployer.address);

  const VotingToken = await hre.ethers.getContractFactory("VotingToken");
  const votingToken = await VotingToken.deploy(1000); // Initial supply of 1000 tokens
//   await votingToken.deployed();

  console.log("VotingToken deployed at:", votingToken.address);

  const VotingSystem = await hre.ethers.getContractFactory("VotingSystem");
  const votingSystem = await VotingSystem.deploy(votingToken.address);
//   await votingSystem.deployed();

  console.log("VotingSystem deployed at:", votingSystem.address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
