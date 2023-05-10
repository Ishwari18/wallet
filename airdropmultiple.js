const { ethers } = require('ethers');
const airdropAbi = [
  'function bulkAirdropERC20(address _token, address[] _to, uint256[] _value) external',
  'function bulkAirdropERC721(address _token, address[] _to, uint256[] _id) external'
];
const airdropAddress = '0x811512Fd8079252E4e5888eBfebE2589c9515480'; // Replace with the Airdrop contract address
const providerUrl = 'https://sepolia.infura.io/v3/fb42577745e24d429d936f65b43cca0b'; // Replace with the Ethereum node URL
const privateKey = 'fdc3d7a7ef1129116fbf4d565cff4ce9f86570e67ed6a7cf84281acab26986fc'; // Replace with the private key of the sending address
const provider = new ethers.providers.JsonRpcProvider(providerUrl);
const wallet = new ethers.Wallet(privateKey, provider);
const airdropContract = new ethers.Contract(airdropAddress, airdropAbi, wallet);

async function bulkAirdropERC20(tokenAddress, recipients, amounts) {
  const tokenContract = new ethers.Contract(tokenAddress, ['function approve(address spender, uint256 amount) returns (bool)'], wallet);
  await tokenContract.approve(airdropAddress, ethers.constants.MaxUint256);
  await airdropContract.bulkAirdropERC20(tokenAddress, recipients, amounts);
}

async function bulkAirdropERC721() {
    const tokenAddressA = '0xCF2f99838637A447A27c698128cbd174b1BCAFBf'; // set token address here
    const recipientsA = ['0x3A98Be1D1628B6A107BC2636cB2d4a4C422B59E5']; // set recipient addresses here
    const idsA = [6]; // set token ids here
    await airdropContract.bulkAirdropERC721(tokenAddressA, recipientsA, idsA);

    const tokenAddressB = '0xa43c9E8678cB4cd16f3d83bA6914966324bd9Afa '; // set token address here
    const recipientsB = ['0x5bB80ecf6d7b8D7421EeAfa71dD6beAe60b8841f']; // set recipient addresses here
    const idsB = [4, 5]; // set token ids here
    await airdropContract.bulkAirdropERC721(tokenAddressB, recipientsB, idsB);
}
  
// Parse command line arguments
const args = process.argv.slice(2);

// Call appropriate function based on command line arguments
if (args[0] === 'erc20') {
  bulkAirdropERC20(tokenAddress, recipients, amounts);
} else if (args[0] === 'erc721') {
  bulkAirdropERC721();
} else {
  console.log('Invalid command');
}

//erc721: node airdrop.js erc721 addresses tokenIds