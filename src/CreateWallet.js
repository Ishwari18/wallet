import React, { useState } from "react";
import networks from "./networks.js";
const ethers = require("ethers");
const provider = new ethers.providers.JsonRpcProvider(networks.goerli.rpcUrl);

export default function CreateWallet() {
  const [wallet, setWallet] = useState(null);
  const [mnemonic, setMnemonic] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  async function handleCreateWallet() {
    const newWallet = await ethers.Wallet.createRandom();
    setWallet(newWallet);
    setMnemonic(newWallet.mnemonic.phrase);
    setPrivateKey(newWallet.privateKey);
  }

  async function handleImportWallet() {
    try {
      const privateKey = prompt("Enter your private key");
      if (!privateKey) throw new Error("Invalid private key");
      const wallet = new ethers.Wallet(privateKey, provider);
      const accounts = await getAccounts();
      if (!accounts) throw new Error("Accounts not found");
      accounts.push(wallet.address);
      setAccounts(accounts);
      setWallet(wallet);
    } catch (error) {
      console.error(error);
      alert("Failed to import wallet");
    }
  }

  async function getAccounts() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const accounts = await signer.getAddress();
      setAccounts(accounts);
      return [accounts];
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  function toggleDropdown() {
    setShowDropdown(!showDropdown);
  }

  function handlePrivateKeyChange(event) {
    setPrivateKey(event.target.value);
  }

  return (
    <>
      <div>
        {wallet ? (
          <div>
            <p>Address: {wallet.address}</p>
            <p>Mnemonic: {mnemonic}</p>
            {/* <p>Private Key: {privateKey}</p> */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(mnemonic);
                alert("Mnemonic saved!");
              }}
            >
              Save Mnemonic
            </button>
          </div>
        ) : (
          <div>
            <button onClick={handleCreateWallet}>Create Wallet</button>
            <input
              type="text"
              value={privateKey}
              onChange={handlePrivateKeyChange}
            />
            <button onClick={handleImportWallet}>Import Wallet</button>
          </div>
        )}
      </div>
      <div>
        <button onClick={toggleDropdown}>Accounts</button>
        {showDropdown && (
          <div className="dropdown">
            {accounts.map((account) => (
              <div key={account}>{account}</div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
