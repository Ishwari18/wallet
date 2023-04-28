import { React, useState, useEffect } from "react";
import networks from "./networks.js";
import "./CreateWallet.css";
const ethers = require("ethers");
const provider = new ethers.providers.JsonRpcProvider(networks.goerli.rpcUrl);

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

  // useEffect(() => {
  //   const newWallet = ethers.Wallet.createRandom();
  //   setWallet(newWallet);
  // }, []);

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
      const signer = provider.getSigner();
      const accounts = await signer.getAddress();
      return [accounts];
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
      }
      else {
        alert("Transaction failed. Please try again later.");
      }
    }
  }

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
          </div>
        )}
      </div>
    </>
  );
}
