const { ethers } = require('ethers');

// ERC20 Token Contract Address
const tokenAddress = '0x20230f0a43d64d70d67999d6c1fC06dcBB4610F2';

// ABI for ERC20 Token Contract
const tokenAbi = ['function balanceOf(address) view returns (uint256)', 'function transfer(address, uint256) returns (bool)', 'function mint(address, uint256)'];

// Initialize provider and signer
const provider = new ethers.providers.Web3Provider(window.ethereum);
await window.ethereum.enable();
const signer = provider.getSigner();

// Initialize ERC20 Token Contract instance
const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);

async function mintTokens(receiverAddress, amount) {
  // Mint new tokens
  const tx = await tokenContract.mint(receiverAddress, amount);
  console.log(`Minted ${amount} tokens for ${receiverAddress} with tx hash: ${tx.hash}`);
}

async function transferTokens(receiverAddress, amount) {
  // Transfer tokens to receiver address
  const tx = await tokenContract.transfer(receiverAddress, amount);
  console.log(`Transferred ${amount} tokens to ${receiverAddress} with tx hash: ${tx.hash}`);
}

async function checkBalance(address) {
  // Check balance of tokens at an address
  const balance = await tokenContract.balanceOf(address);
  console.log(`Balance of tokens at ${address}: ${balance.toString()}`);
}

// Parse command line arguments
const command = process.argv[2];
const address = process.argv[3];
const amount = process.argv[4];

// Call appropriate function based on command
switch (command) {
  case 'mint':
    mintTokens(address, amount);
    break;
  case 'transfer':
    transferTokens(address, amount);
    break;
  case 'balance':
    checkBalance(address);
    break;
  default:
    console.log('Invalid command. Usage: node script.js <mint|transfer|balance> <address> [amount]');
}
