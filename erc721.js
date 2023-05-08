const { ethers } = require("ethers");
const contractAddress = "0xCF2f99838637A447A27c698128cbd174b1BCAFBf"; // Replace with your contract address
const contractAbi = [
  "function safeMint(address to, string memory uri) public",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function balanceOf(address owner) public view returns (uint256)",
  "function setApprovalForAll(address operator, bool approved) external"
];

// Replace with your Infura or other Ethereum node endpoint
const provider = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/fb42577745e24d429d936f65b43cca0b");
const wallet = new ethers.Wallet("fdc3d7a7ef1129116fbf4d565cff4ce9f86570e67ed6a7cf84281acab26986fc", provider); // Replace with your private key

const contract = new ethers.Contract(contractAddress, contractAbi, wallet);

async function mintToken(to, uri, gasLimit) {
  const tx = await contract.safeMint(to, uri, { gasLimit });
  await tx.wait();
  console.log(`Minted token ${await contract.tokenURI(0)} to ${to}`);
}
async function setApprovalForAll(operator, approved, gasLimit) {
  const tx = await contract.setApprovalForAll(operator, approved, { gasLimit });
  await tx.wait();
  console.log(`Set approval for operator ${operator} to ${approved}`);
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
// Call appropriate function based on command line arguments
if (args[0] === "mint") {
  mintToken(args[1], args[2], args[3]);
} else if (args[0] === "transfer") {
  transferToken(args[1], args[2]);
} else if (args[0] === "balance") {
  checkBalance(args[1]);
} else if (args[0] === "approve") {
  setApprovalForAll(args[1], args[2], args[3]);
} else {
  console.log("Invalid command");
}


//command to mint: node erc721.js mint recipientaddress uri gaslimit
// /Command to set approval for all: node erc721.js approve operatoraddress true/false gaslimit