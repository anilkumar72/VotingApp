import {ethers} from "ethers";
import VotingSystemArtifact from "../artifacts/contracts/VotingSystem.sol/VotingSystem.json";

const votingContractAddress = "0xb04735c9ce81CD56e9F35cd9EcB076293604211B";
const contractABI = VotingSystemArtifact.abi
const winEth = window.ethereum;

export async function connectWallet() {
    if (typeof winEth !== 'undefined') {
        try {
            await winEth.request({method: 'eth_requestAccounts'});
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            console.log("Wallet connected:", signer);
            return signer;
        } catch (error) {
            console.error("User rejected the request:", error);
        }
    } else {
        console.error("MetaMask is not installed");
    }
}

export async function connectContract(signer) {
    const contract = new ethers.Contract(votingContractAddress, contractABI, signer);
    console.log("Contract connected:", contract);
    return contract;
}

export async function switchNetwork() {
    const polygonTestnet = {
        chainId: '0x13882',
        chainName: 'Polygon amoy',
        nativeCurrency: {
            name: 'MATIC',
            symbol: 'MATIC',
            decimals: 18
        },
        rpcUrls: ['https://rpc-amoy.polygon.technology/'],
        blockExplorerUrls: ['https://amoy.polygonscan.com/']
    };
    try {
        await winEth.request({method: 'wallet_switchEthereumChain', params: [{chainId: polygonTestnet.chainId}]});
        console.log("Switched to Polygon");
        return true;
    } catch (switchError) {
        if (switchError.code === 4902) {
            try {
                await winEth.request({method: 'wallet_addEthereumChain', params: [polygonTestnet]})
                return true;

            } catch (addError) {

                console.error("Failed to add Polygon network:", addError);
                return false;
            }
        } else {
            console.error("Failed to switch to Polygon network:", switchError);
            return false;

        }
    }

}