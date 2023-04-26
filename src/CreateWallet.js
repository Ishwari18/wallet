import { React, useState } from "react";
import networks from "./networks.js";
import "./CreateWallet.css";
const ethers = require("ethers");
const provider = new ethers.providers.JsonRpcProvider(networks.goerli.rpcUrl);

export default function CreateWallet() {
  const [wallet, setWallet] = useState(null);
  //const [mnemonic, setMnemonic] = useState("");
  const [network, setNetwork] = useState(networks[0]);
  const [accounts, setAccounts] = useState([]);
  //const [showMnemonic, setShowMnemonic] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [networkDropdown, setNetworkDropdown] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

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

  function handleNetworkChange(event) {
    const selectedNetwork = Object.keys(networks).find(
      (key) => networks[key].name === event.target.value
    );

    console.log(selectedNetwork);
    // use selectedNetwork.rpcUrl to set the provider
    if (selectedNetwork) {
      setNetwork(selectedNetwork);
      provider.resetEventsBlock(0);
      provider.resetCache();
      alert(`Connected to ${selectedNetwork.name}`);
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

  const handleSend = async (event) => {
    event.preventDefault();
    if (recipient.trim() === "" || amount.trim() === "") {
      return;
    }
   const provider = new ethers.providers.JsonRpcProvider(network.rpcUrl);
    const signer = provider.getSigner();
    const tx = await signer.sendTransaction({
      to: recipient.trim(),
      value: ethers.utils.parseEther(amount.trim()),
    });
    console.log("Transaction sent:", tx.hash);
    setRecipient("");
    setAmount("");
  };

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

         Display mnemonic if wallet was created 
         {showMnemonic && (
          <div>
            <p>Mnemonic: {mnemonic}</p>
            <button onClick={handleCopyMnemonic}>Copy Mnemonic</button>
          </div>
        )} 

        {/* Dashboard */}
        {wallet && (
          <div>
            <button onClick={() => setShowDropdown(!showDropdown)}>
              Network: {networks.name}
            </button>
            {showDropdown && (
              <div className="dropdown">
                {Object.values(networks).map((n) => (
                  <div
                    className="networkitem"
                    key={n.name}
                    onClick={handleNetworkChange}
                    value={n.name}
                  >
                    {n.name}
                  </div>
                ))}
              </div>
            )}
            <p>Address: {wallet.address}</p>

            <form onSubmit={handleSend}>
              <input
                type="text"
                placeholder="Recipient address"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
              <input
                type="text"
                placeholder="Amount (ETH)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <button type="submit">Send</button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
