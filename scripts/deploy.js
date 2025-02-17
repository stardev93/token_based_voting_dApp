const { ethers } = require("hardhat");
async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with:", deployer.address);

    const VotingToken = await ethers.getContractFactory("VotingToken");
    const votingToken = await VotingToken.deploy(1000); // Initial supply of 1000 tokens

    // await votingToken.deployed();

    console.log("VotingToken deployed at:", votingToken.target);

    const VotingSystem = await ethers.getContractFactory("VotingSystem");
    const votingSystem = await VotingSystem.deploy(votingToken.target);
    // await votingSystem.deployed();

    console.log("VotingSystem deployed at:", votingSystem.target);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
