import { React, useState, useEffect } from "react";
import networks from "./networks.js";
import "./CreateWallet.css";
const ethers = require("ethers");
const provider = new ethers.providers.JsonRpcProvider(networks.sepolia.rpcUrl);

export default function CreateWallet() {
  const [wallet, setWallet] = useState(null);
  const [privateKey, setPrivateKey] = useState("");
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [mnemonic, setMnemonic] = useState("");
  const [network, setNetwork] = useState(networks[0]);
  const [accounts, setAccounts] = useState([]);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [nfts, setNfts] = useState(null);
  const [erc20Tokens, setERC20Tokens] = useState([]);

  async function handleCreateWallet() {
    const newWallet = ethers.Wallet.createRandom();
    setWallet(newWallet);
    setMnemonic(newWallet.mnemonic.phrase);
    return newWallet;
  }

  async function handleImportWallet() {
    try {
      const privateKey = prompt("Enter your private key");
      if (!privateKey) throw new Error("Invalid private key");
      const wallet = new ethers.Wallet(privateKey, provider);
      const accounts = await getAccounts();
      if (!accounts) throw new Error("Accounts not found");
      accounts.push(wallet.address);
      setWallet(wallet);
    } catch (error) {
      console.error(error);
      alert("Failed to import wallet");
    }
  }

  async function getAccounts() {
    try {
      const accounts = await provider.listAccounts();
      return accounts;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  const handleShowPrivateKey = () => {
    setShowPrivateKey(true);
  };
  function handleCopyMnemonic() {
    navigator.clipboard.writeText(mnemonic);
    alert("Mnemonic copied to clipboard!");
  }
  const handleRecipientChange = (event) => {
    setRecipient(event.target.value);
  };
  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleSend = async () => {
    if (!wallet) {
      alert("Wallet not created yet. Please create a wallet first.");
      return;
    }
    try {
      const signer = wallet.connect(provider);
      const tx = await signer.sendTransaction({
        to: recipient,
        value: ethers.utils.parseEther(amount),
        gasLimit: 21000,
      });
      await tx.wait();
      alert(`Transaction successful with hash: ${tx.hash}`);
      console.log(`Transaction successful with hash: ${tx.hash}`);
    } catch (error) {
      console.error(error);
      if (error.message.includes("insufficient funds")) {
        alert("Insufficient balance. Required balance");
      } else {
        alert("Transaction failed. Please try again later.");
      }
    }
  };

  async function getNFTs() {
    if (!wallet) {
      alert("Wallet not created yet. Please create a wallet first.");
      return;
    }

    const address = wallet.address;
    const abi = [
      "function balanceOf(address owner) view returns (uint256)",
      "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
      "function tokenURI(uint256 tokenId) view returns (string)",
    ];
    const contractAddress = "0x7cF4a7Aa06092ccBBD8D0f2AB6207F1610Ab8353"; // Replace with the address of the NFT contract
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const balance = await contract.balanceOf(address);
    const tokens = [];
    for (let i = 0; i < balance.toNumber(); i++) {
      const tokenId = await contract.tokenOfOwnerByIndex(address, i);
      const uri = await contract.tokenURI(tokenId);
      tokens.push({ id: tokenId.toNumber(), uri });
    }

    const tableRows = tokens.map((token) => (
      <tr key={token.id}>
        <td>{token.id}</td>
        <td>
          <a href={token.uri}>{token.uri}</a>
        </td>
        <td>
          <img src={token.image} alt={`NFT ${token.id}`} />
        </td>
      </tr>
    ));
    setNfts(
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>URI</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
    );
  }
  async function handleGetERC20Tokens() {
    if (!wallet) {
      alert("Wallet not created yet. Please create a wallet first.");
      return;
    }

    const address = wallet.address;
    const abi = [
      "function balanceOf(address owner) view returns (uint256)",
      "function symbol() view returns (string)",
      "function name() view returns (string)",
    ];

    const erc20TokenAddresses = [
      "0x20230f0a43d64d70d67999d6c1fC06dcBB4610F2",
    ]; // Replace with an array of ERC20 token addresses

    const erc20Tokens = [];

    for (let i = 0; i < erc20TokenAddresses.length; i++) {
      const contractAddress = erc20TokenAddresses[i];
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const balance = await contract.balanceOf(address);
      const symbol = await contract.symbol();
      const name = await contract.name();
      erc20Tokens.push({
        address: contractAddress,
        balance: balance.toString(),
        symbol,
        name,
      });
    }

    setERC20Tokens(erc20Tokens);
  }

  const erc20TokensTable =
    erc20Tokens.length > 0 ? (
      <table>
        <thead>
          <tr>
            <th>Token Name</th>
            <th>Token Symbol</th>
            <th>Balance</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {erc20Tokens.map((token) => (
            <tr key={token.address}>
              <td>{token.name}</td>
              <td>{token.symbol}</td>
              <td>{ethers.utils.formatEther(token.balance)}</td>
              <td>{token.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>No ERC20 tokens found.</p>
    );

  return (
    <>
      <div>
        {/* Wallet creation options */}
        {wallet === null && (
          <div className="walletcreatebtns">
            <p id="first">New to videowiki wallet?</p>
            <button onClick={handleCreateWallet}>Create Wallet</button>
            <button onClick={handleImportWallet}>Import Wallet</button>
          </div>
        )}

        {showMnemonic && (
          <div>
            <p>Mnemonic: {mnemonic}</p>
            <button onClick={handleCopyMnemonic}>Copy Mnemonic</button>
          </div>
        )}

        {/* Dashboard */}
        {wallet && (
          <div>
            <p>Address: {wallet.address}</p>
            <p>Balance: {wallet.balance}</p>
            {showPrivateKey ? (
              <p>Private Key: {wallet.privateKey}</p>
            ) : (
              <button onClick={handleShowPrivateKey}>Show Private Key</button>
            )}

            <div>
              <label>Recipient:</label>
              <input
                type="text"
                value={recipient}
                onChange={handleRecipientChange}
              />
              <label>Amount:</label>
              <input type="text" value={amount} onChange={handleAmountChange} />
              <button onClick={handleSend}>Send</button>
            </div>

            <div>
              <button onClick={getNFTs}>Get NFTs</button>
              <button onClick={handleGetERC20Tokens}>Get ERC20 Tokens</button>
              {nfts}
              {erc20TokensTable}
            </div>
      
          </div>
        )}
      </div>
    </>
  );
}
