import React, {useEffect, useState} from "react";
import { ethers } from "ethers";
import {connectWallet, switchNetwork, connectContract} from "./utils/connect";

function App() {
  const [signer,setSigner] =useState(null)
  const [contract,setContract] =useState(null)
  const [currentAccount,setCurrentAccount] =useState(null)
  const [isPollingOfficer,setIsPollingOfficer]=useState(false)
  const [candidateAddresses,setCandidateAddresses]=useState(null)
  const[name,setName]=useState('')
  const initializeWalletConnect = async () => {
    const signer = await connectWallet();
    if (signer) {
      const isNetworkSwitched= await switchNetwork()
      setSigner(signer);
      if(isNetworkSwitched){
        const contract = await connectContract(signer);
        setContract(contract);
        let currentAccountAddress=await signer.getAddress()
        const pollingOfficerAddress = await contract.pollingOfficer();
        if (currentAccountAddress === pollingOfficerAddress) {
          setIsPollingOfficer(true)
        }
        setCurrentAccount(currentAccountAddress);
      }

    }
  }
  const disconnectWallet = () => {
    setSigner(null);
    setContract(null);
    setCurrentAccount(null);
    setIsPollingOfficer(null)
  };
  const getAllCandidatesAddresses=async () => {
    if (contract) {
      setCandidateAddresses(await contract.getAllCandidates());
    }
  }
  const registerCandidate=async ()=>{
    if (contract) {
      setCandidateAddresses(await contract.registerCandidate(name));
    }
  }

  return (
    <div className="App">
      <button onClick={signer?disconnectWallet:initializeWalletConnect}>{signer?"Disconnect":"Connect to wallet"}</button>

      {isPollingOfficer?'Connected to polling officer':currentAccount}
      <br />
      {isPollingOfficer?<>
        <button onClick={getAllCandidatesAddresses}>All Candidates</button>
        {console.log(candidateAddresses,'candidateAddresses')}

      </>:<>
        <br/>
        <input type={"text"} onChange={(val)=>setName(val.target.value)} value={name}/>
      <button onClick={registerCandidate}>Register candidate</button>

      </>}
    </div>
  );
}

export default App;