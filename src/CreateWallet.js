import { React, useState, useRef } from "react";
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
  const [showDropdown, setShowDropdown] = useState(false);
  const [networkDropdown, setNetworkDropdown] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  //const [gasLimit, setgasLimit] = useState("200");

  //console.log(network);
  async function handleCreateWallet() {
    const newWallet = ethers.Wallet.createRandom();
    setWallet(newWallet);
    // setMnemonic(newWallet.mnemonic.phrase);
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
      //const provider = new ethers.providers.Web3Provider(window.ethereum);
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

  // async function sendEth(e) {
  //   e.preventDefault();
  //   try {
  //     if (!recipient || !amount)
  //       throw new Error("Recipient address and amount are required");
  //     const tx = {
  //       to: recipient,
  //       value: ethers.utils.parseEther(amount),
  //     };
  //     const signedTx = await wallet.signTransaction(tx);
  //     const txResponse = await provider.sendTransaction(signedTx);
  //     console.log(
  //       `Transaction sent: https://goerli.etherscan.io/tx/${txResponse.hash}`
  //     );
  //   } catch (error) {
  //     console.error(error);
  //     alert("Failed to send ETH");
  //   }

  async function sendEth(e) {
    e.preventDefault();
    try {
      if (!recipient || !amount)
        throw new Error("Recipient address and amount are required");
        const tx = {
          to: recipient,
          value: ethers.utils.parseEther(amount),
          gasLimit: ethers.BigNumber.from("21000"), // set the gas limit to 21000 Wei
        };
      const signedTx = await wallet.signTransaction(tx);
      const txResponse = await provider.sendTransaction(signedTx);
      console.log(
        `Transaction sent: https://goerli.etherscan.io/tx/${txResponse.hash}`
      );
    } catch (error) {
      console.error(error);
      alert("Failed to send ETH");
    }
  }

  return (
    <>
      <div>
        {/* Wallet creation options */}
        {wallet === null && (
          <div>
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
            <p>
              Balance:{" "}
              {wallet.balance}
                
            </p>
            {showPrivateKey ? (
              <p>Private Key: {wallet.privateKey}</p>
            ) : (
              <button onClick={handleShowPrivateKey}>Show Private Key</button>
            )}

            <form onSubmit={sendEth}>
              <div className="form-group">
                <label htmlFor="recipient">Recipient address:</label>
                <input
                  type="text"
                  className="form-control"
                  id="recipient"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="amount">Amount (ETH):</label>
                <input
                  type="text"
                  className="form-control"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              {/* <div className="form-group">
                <label htmlFor="gas-price">Gas Limit (Gwei):</label>
                <input
                  type="text"
                  className="form-control"
                  id="gas-price"
                  value={gasLimit}
                  onChange={(e) => setgasLimit(e.target.value)}
                />
              </div> */}

              <button type="submit" className="btn btn-primary">
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
