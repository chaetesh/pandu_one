import { abi } from "./constants.js";
import { ethers } from "./ethers.js";

const contractAddress = "0x696083a889ab7799cf66512dd7b2b770f0ac9aa7";
const contractABI = abi;

const connectButton = document.getElementById("connectButton");
connectButton.onclick = connect;
const sendButton = document.getElementById("send");
sendButton.onclick = sendTransaction;
const getButton = document.getElementById("get");
getButton.onclick = getData;

async function connect() {
  if (window.ethereum) {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    document.getElementById("connectButton").innerHTML = "Connected";
  } else {
    alert("Please install Metamask");
  }
}

async function sendTransaction() {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
      const transactionResponse = await contract.ProductAdd(
        1,
        "test",
        "test",
        "tes",
        "test",
        "test",
        "text"
      );

      // Listen for the transaction to be mined, wait until mined
      await listenForTransactionMine(transactionResponse, provider); // await is working as we are waiting for promise
      console.log("Done!");
    }

    catch (error) {
      console.error("Transaction failed:", error);
    }
  } else {
    alert("Please install Metamask");
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`);
  // This promise will wait for until the listner is completed and will call resolve if its completed succesfully else reject
  return new Promise((resolve, reject) => {
    // listen for this transaction to finish( This listner will call callback-function once there is one confirmation)
    provider.once(transactionResponse.hash, (transactionReciept) => {
      // Print the number of confirmations
      console.log(
        `Completed with ${transactionReciept.confirmations} Confirmations`
      );
      resolve();
    });
  });
}

async function getData() {
  if (window.ethereum) {
    console.log("getting....");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    try {
      const transactionResponse = await contract.GetProduct(1);
      console.log(transactionResponse);
    } catch (error) {
      console.log(error);
    }
  }
}