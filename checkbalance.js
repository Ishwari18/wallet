const { ethers } = require("ethers");

// Replace with your own private key
const privateKey =
  "0xebb67e3cd45212fab888ad86013d217005e7feb55c71ade8ddd087e66589a31d";

async function checkBalance() {
  try {
    // Create a new wallet using the private key
    const wallet = new ethers.Wallet(privateKey);

    // Connect to the Goerli testnet
    // Connect to the Goerli testnet
    const provider = new ethers.providers.JsonRpcProvider(
      "https://goerli.infura.io/v3/fb42577745e24d429d936f65b43cca0b"
    );

    // Get the balance of the wallet
    const balance = await provider.getBalance(wallet.address);

    console.log(`Wallet address: ${wallet.address}`);
    console.log(`Balance: ${ethers.utils.formatEther(balance)} ETH`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
}

checkBalance();
