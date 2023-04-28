const { ethers } = require("ethers");

// Replace with your own private key
const privateKey =
  "0xa5510bac38aa562b14be9fcd4033c0ec72bd73d0910e4b564fd3f7bfecd840bc";

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
