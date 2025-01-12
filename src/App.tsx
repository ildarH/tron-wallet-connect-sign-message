import './styles/index.css';
import UniversalProvider from "@walletconnect/universal-provider";
import { Web3Modal } from '@web3modal/standalone'
import { useEffect, useState } from "react";
import { TronService, TronChains } from "./utils/tronService";
import { verifySignMessage } from "./utils/messageHandler";
import { CopyButton } from './components/CopyButton'
import { TestVerification } from './components/TestVerification';
import { VerificationDetails } from './types';
import { VerificationResult } from './components/VerificationResult';

const projectId = import.meta.env.VITE_PROJECT_ID as string;
const isTestMode = import.meta.env.DEV && import.meta.env.VITE_TEST_MODE === 'true';


if (!projectId) {
  throw new Error("Missing VITE_PROJECT_ID environment variable");
}

const events: string[] = [];

// 1. select chains (tron)
const chains = [`tron:${TronChains.Mainnet}`];

// 2. select methods (tron)
const methods = ["tron_signMessage", "tron_signTransaction"];

// 3. create modal instance
const modal = new Web3Modal({
  projectId,
  standaloneChains: chains,
  themeMode: 'dark',
  walletConnectVersion: 2
});



const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState<number | null>(null);

  // 4. create State for Universal Provider and tronService
  const [provider, setProvider] = useState<UniversalProvider | null>(null);
  const [tronService, setTronService] = useState<TronService | null>(null);
  const [signMessage, setSignMessage] = useState<string | null>(null);
  const [isSigningMessage, setIsSigningMessage] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationDetails>({ 
    status: 'idle' 
  });

  // В компоненте App добавить новое состояние для ввода сообщения
  const [messageInput, setMessageInput] = useState("Message to sign");

  // 5. initialize Universal Provider onLoad
  useEffect(() => {
    async function setOnInitProvider() {
      const providerValue = await UniversalProvider.init({
        logger: "error", // log level
        projectId: projectId,
        metadata: {
          name: "WalletConnect x Tron",
          description: "Tron integration with WalletConnect's Universal Provider",
          url: "https://walletconnect.com/",
          icons: ["https://avatars.githubusercontent.com/u/37784886"],
        },
      });

      setProvider(providerValue);
    }

    setOnInitProvider();

  }, []);

  // 6. set tronService and address on setProvider
  useEffect(() => {
    if (!provider) return;

    provider.on("display_uri", async (uri: string) => {
      console.log("uri", uri);
      await modal.openModal({
        uri,
      });
    });
  }, [provider]);


  // 7. get balance when connected
  useEffect(() => {
    async function getBalanceInit() {
      if (!tronService) return;
      const res = await tronService.getBalance(address!);
      setBalance(res!);
    }

    if (!isConnected) return;
    getBalanceInit();
    setSignMessage(messageInput); // Устанавливаем начальное сообщение
  }, [isConnected, tronService]);

  // 8. handle connect event
  const connect = async () => {
    try {
      if (!provider) return;

      await provider.connect({
        optionalNamespaces: {
          tron: {
            methods,
            chains,
            events,
          },
        },
      });

      const tronServiceValue = new TronService(provider);
      setTronService(tronServiceValue);

      console.log("session?", provider);
      setAddress(provider.session?.namespaces.tron?.accounts[0].split(":")[2]!);

      setIsConnected(true);
    } catch (error) {
      console.error("Connection error:", error);
    } finally {
      modal.closeModal();
    }
  };

  // 9. handle disconnect event
  const disconnect = async () => {
    await provider!.disconnect();
    setIsConnected(false);
  };

  // 10. handle get Balance, signMessage and sendTransaction
  const handleSign = async () => {
    setIsSigningMessage(true);
    setVerificationResult({ status: 'idle' });
    
    try {
      const signResult = await tronService!.signMessage(
        signMessage!,
        address!
      );

      console.log("result sign: ", signResult);

      const verifyResult = await verifySignMessage(
        address!, 
        signMessage!, 
        signResult.result
      );

      console.log("verifyResult", verifyResult);
      
      setVerificationResult({
        status: verifyResult.isValid ? 'success' : 'error',
        message: verifyResult.message,
        signature: signResult.result,
        signedMessage: signMessage
      });
    } catch (error) {
      console.log("error sign: ", error);
      setVerificationResult({
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to sign message'
      });
    } finally {
      setIsSigningMessage(false);
    }
  };

  const handleGetBalance = async () => {
    const res = await tronService!.getBalance(address!);
    console.log(res);
    setBalance(res);
  };

  const handleSendTransaction = async () => {
    console.log("signing");
    const res = await tronService!.sendTransaction(address!, 100);
    console.log("result send tx: ", res);
  };

  return (
    <div className="App center-content">
      <h2>TRON Message Signing with WalletConnect + TrustWallet</h2>
      {isConnected ? (
        <>
          <p className="address-info">
            <label>Wallet Address</label>
            <div className="address-container">
              <span className="monospace-text">
                {address}
              </span>
              <CopyButton text={address} />
            </div>
          </p>
          <input
            type="text"
            value={messageInput}
            onChange={(e) => {
              setMessageInput(e.target.value);
              setSignMessage(e.target.value);
            }}
            placeholder="Message to sign"
            className="input-message"
          />
          <div className="btn-container">
            <button 
              disabled={!signMessage || isSigningMessage} 
              onClick={handleSign}
            >
              {isSigningMessage ? 'Signing...' : 'Sign MSG'}
            </button>
            <button onClick={disconnect}>Disconnect</button>
          </div>
          {verificationResult.status !== 'idle' && (
            <VerificationResult result={verificationResult} />
          )}
        </>
      ) : (
        <>
          <button onClick={connect}>Connect</button>
          {isTestMode && <TestVerification messageInput={messageInput} />}
        </>
      )}
    </div>
  );
};

export default App;
