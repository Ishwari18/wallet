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

async function mintToken() {
  const to = "0x0A59223D2d7018C5d6f5fDD6d9a02Ea6828fD22f";
  const uri = "https://opensea.io/assets/ethereum/0xabcdb5710b88f456fed1e99025379e2969f29610/2981";

  const tx = await contract.safeMint(to, uri);
  await tx.wait();
  console.log(`Minted token to ${to}`);
}
mintToken();

//command to mint: node erc721.js mint recipientaddress uri gaslimit
// /Command to set approval for all: node erc721.js approve operatoraddress true/false gaslimit
//https://opensea.io/assets/ethereum/0xb852c6b5892256c264cc2c888ea462189154d8d7/2397