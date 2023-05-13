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
  const [transactions, setTransactions] = useState([]);

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
    const address = wallet.address;
    const abi = [
      "function balanceOf(address owner) view returns (uint256)",
      "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
      "function tokenURI(uint256 tokenId) view returns (string)",
      "function transferFrom(address from, address to, uint256 tokenId) public",
    ];
    const contracts = [
      {
        address: "0xCF2f99838637A447A27c698128cbd174b1BCAFBf", // Replace with the address of the first NFT contract
        name: "NFT Contract 1",
      },
      {
        address: "0xa43c9E8678cB4cd16f3d83bA6914966324bd9Afa", // Replace with the address of the second NFT contract
        name: "NFT Contract 2",
      },
    ];
    const tokens = [];
    for (let j = 0; j < contracts.length; j++) {
      const contract = new ethers.Contract(contracts[j].address, abi, provider);
      const balance = await contract.balanceOf(address);
      for (let i = 0; i < balance.toNumber(); i++) {
        const tokenId = await contract.tokenOfOwnerByIndex(address, i);
        const uri = await contract.tokenURI(tokenId);
        tokens.push({
          id: tokenId.toNumber(),
          uri,
          name: contracts[j].name,
          contractAddress: contracts[j].address,
        });
      }
    }

    const tableRows = tokens.map((token) => (
      <tr key={token.id + token.contractAddress}>
        <td>{token.id}</td>
        <td>
          <a href={token.uri}>{token.uri}</a>
        </td>
        <td>
          <img src={token.image} alt={`NFT ${token.id}`} />
        </td>
        <td>{token.name}</td>
        <td>{token.contractAddress}</td>
       
      </tr>
    ));
    setNfts(
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>URI</th>
            <th>Image</th>
            <th>Contract Name</th>
            <th>Contract Address</th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
    );
  }

  async function transferAllNFTs() {
    const recipient = prompt("Enter recipient address:");
  if (!recipient) {
    return;
  }

    const address = wallet.address;
    const abi = [
      "function balanceOf(address owner) view returns (uint256)",
      "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
      "function tokenURI(uint256 tokenId) view returns (string)",
      "function transferFrom(address from, address to, uint256 tokenId) public",
    ];
    const contracts = [
      {
        address: "0xCF2f99838637A447A27c698128cbd174b1BCAFBf", // Replace with the address of the first NFT contract
        name: "NFT Contract 1",
      },
      {
        address: "0xa43c9E8678cB4cd16f3d83bA6914966324bd9Afa", // Replace with the address of the second NFT contract
        name: "NFT Contract 2",
      },
    ];
    const tokens = [];
    for (let j = 0; j < contracts.length; j++) {
      const contract = new ethers.Contract(contracts[j].address, abi, provider);
      const balance = await contract.balanceOf(address);
      for (let i = 0; i < balance.toNumber(); i++) {
        const tokenId = await contract.tokenOfOwnerByIndex(address, i);
        const uri = await contract.tokenURI(tokenId);
        tokens.push({
          id: tokenId.toNumber(),
          uri,
          name: contracts[j].name,
          contractAddress: contracts[j].address,
        });
      }
    }
    const signer = wallet.connect(provider);
    for (let i = 0; i < tokens.length; i++) {
      const contractAddress = tokens[i].contractAddress;
      const tokenId = tokens[i].id;
      const abi = [
        "function transferFrom(address from, address to, uint256 tokenId) public",
      ];
      const contract = new ethers.Contract(contractAddress, abi, provider);
      try {
        await contract
          .connect(signer)
          .transferFrom(wallet.address, recipient, tokenId);
        console.log(`NFT ${tokenId} transferred successfully to ${recipient}`);
      } catch (err) {
        console.log(err);
        console.log(`Error transferring NFT ${tokenId}: ${err.message}`);
      }
    }
  }
  
  async function loadTransactions() {
    try {
      const txCount = await provider.getTransactionCount(wallet.address);
      const txs = [];
      for (let i = 0; i < txCount; i++) {
        const txReceipt = await provider.getTransactionReceipt(i);
        const txHash = await txReceipt.transactionHash();
        const tx = await provider.getTransaction(txHash);
        if (tx && (tx.from === wallet.address || tx.to === wallet.address)) {
          txs.push(tx);
        }
      }
      setTransactions(txs);
    } catch (error) {
      console.log("Error loading transactions:", error);
    }
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
    const erc20TokenAddresses = ["0x49A6d8acC5908A8892b9c3B872206C02c14e6C59"]; // Replace with an array of ERC20 token addresses

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
      <p></p>
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
              <button onClick={transferAllNFTs}>Transfer All NFTs</button>

              {nfts}
              {erc20TokensTable}
            </div>
            <div>
              <button onClick={loadTransactions}>View Transactions</button>
              <ul>
                {transactions.map((tx) => (
                  <li key={tx.hash}>
                    <a
                      href={`https://etherscan.io/tx/${tx.hash}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {tx.hash}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
