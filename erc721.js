const { ethers } = require("ethers");
const contractAddress = "0x7cF4a7Aa06092ccBBD8D0f2AB6207F1610Ab8353"; // Replace with your contract address
const contractAbi = [
  "function safeMint(address to, string memory uri) public onlyOwner",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function balanceOf(address owner) public view returns (uint256)",
];

// Replace with your Infura or other Ethereum node endpoint
const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/fb42577745e24d429d936f65b43cca0b");
const wallet = new ethers.Wallet("YOUR-PRIVATE-KEY", provider); // Replace with your private key

const contract = new ethers.Contract(contractAddress, contractAbi, wallet);

// Mint a new token
async function mintToken(to, uri) {
  const tx = await contract.safeMint(to, uri);
  await tx.wait();
  console.log(`Minted token ${await contract.tokenURI(0)} to ${to}`);
}

// Transfer a token
async function transferToken(tokenId, to) {
  const tx = await contract["safeTransferFrom(address,address,uint256)"](await contract.ownerOf(tokenId), to, tokenId);
  await tx.wait();
  console.log(`Transferred token ${tokenId} to ${to}`);
}

// Check token balance of an address
async function checkBalance(address) {
  const balance = await contract.balanceOf(address);
  console.log(`Address ${address} has ${balance} tokens`);
}

// Parse command line arguments
const args = process.argv.slice(2);

// Call appropriate function based on command line arguments
if (args[0] === "mint") {
  mintToken(args[1], args[2]);
} else if (args[0] === "transfer") {
  transferToken(args[1], args[2]);
} else if (args[0] === "balance") {
  checkBalance(args[1]);
} else {
  console.log("Invalid command");
}
