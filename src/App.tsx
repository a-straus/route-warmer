import { useEffect, useMemo, useState } from "react";
import { Asset, Chain } from "./types";
import axios from "axios";
import "./App.css";
import Dropdown from "./Dropdown";
import AssetGrid from "./AssetGrid";
import AssetDisplay from "./AssetDisplay";
import ChainGrid from "./ChainGrid";
import { useSendIbcTokens, useStargateSigningClient, useAccount, useConnect, useDisconnect, WalletType } from "graz";
import { useFetchTokensOnChain } from "./useFetchTokensOnChain";
import useFetchDestChains from "./useFetchDestChains";
import { convertBech32Address, getFeeAsset } from "./util";
import useSrcChannel from "./useSrcChannel";

function App() {
  const [chains, setChains] = useState<Chain[]>([]);
  const [srcChain, setSrcChain] = useState<Chain | null>(null);
  const [srcAssets, setSrcAssets] = useState<Asset[]>([]);
  const [srcAsset, setSrcAsset] = useState<Asset | null>(null);
  const [destCandidates, setDestCandidates] = useState<Chain[]>([]);
  const [destChains, setDestChains] = useState<Chain[]>([]);
  const [channel, setChannel] = useState<string | null>(null);

  const { data: account, isConnected } = useAccount({ chainId: srcChain?.chain_id });
  const { data: signingClient } = useStargateSigningClient({ chainId: srcChain?.chain_id });
  const { sendIbcTokens } = useSendIbcTokens();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  function handleSetChain(chain: Chain) {
    if (!isConnected) connect({ chainId: chain.chain_id, walletType: WalletType.KEPLR });
    setSrcChain(chain);
  }

  function handleConnect() {
    if (!isConnected && !srcChain?.chain_id) return alert("Please select a chain");
    return isConnected
      ? disconnect()
      : connect({
          chainId: srcChain?.chain_id as string,
          walletType: WalletType.KEPLR,
        });
  }

  const handleSendOverIBC = async () => {
    const recipientAddress = convertBech32Address(account?.bech32Address as string, destCandidates[0].bech32_prefix);

    let errorMessage = "";
    if (!srcChain) {
      errorMessage += "Please select a source chain. ";
    }
    if (!recipientAddress) {
      errorMessage += "Please connect to the destination chain. ";
    }
    if (!srcChain?.fee_assets) {
      errorMessage += "Please select a source asset. ";
    }
    if (!srcAsset) {
      errorMessage += "Please select a source asset. ";
    }

    if (errorMessage) {
      alert(errorMessage.trim());
      return;
    }

    sendIbcTokens({
      signingClient,
      senderAddress: account?.bech32Address as string,
      recipientAddress: recipientAddress as string,
      transferAmount: { amount: "1".padEnd((srcAsset as Asset).decimals + 1, "0"), denom: srcAsset?.denom as string },
      sourcePort: "transfer",
      sourceChannel: channel as string,
      timeoutTimestamp: Date.now() + 2 * 60 * 1000,
      fee: {
        amount: [
          {
            amount: "10000",
            denom: getFeeAsset(srcChain)?.denom as string,
          },
        ],
        gas: "2000000",
      },
      memo: "inmyappera",
    });
  };

  // fetch all chains
  useMemo(async () => {
    try {
      const response = await axios.get(
        "https://api.skip.money/v1/info/chains?include_evm=false&client_id=route-warmer"
      );
      setChains(response.data.chains);
    } catch (error) {
      console.log(error);
    }
  }, []);

  // Reset states when srcChain changes
  useEffect(() => {
    setSrcAssets([]);
    setSrcAsset(null);
    setDestChains([]);
    setChannel(null);
  }, [srcChain]);

  // Reset states when srcAsset changes
  useEffect(() => {
    setDestChains([]);
    setChannel(null);
  }, [srcAsset]);

  useFetchTokensOnChain(srcChain, setSrcAssets);
  useFetchDestChains(srcChain, chains, setDestCandidates);
  useSrcChannel(srcChain, srcAsset, getFeeAsset(srcChain), destChains[0], setChannel);

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <div className="absolute top-0 right-0 mt-4 mr-4">
            <div className="mb-4">
              {account && (
                <span className="text-green-500 font-semibold">
                  Connected to {`${account.bech32Address.split("1")[0]}...${account.bech32Address.slice(-3)}`}
                </span>
              )}
            </div>
            <button
              onClick={handleConnect}
              className={`block w-full px-4 py-2 text-white font-bold rounded-lg focus:outline-none ${
                isConnected ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isConnected ? "Disconnect" : "Connect"}
            </button>
          </div>
        </div>
        <h1 className="text-3xl font-bold underline text-lime-300">Skip Route Warmer</h1>
        <Dropdown
          items={chains}
          selectedItem={srcChain}
          setSelectedItem={handleSetChain}
          displayProperty="chain_name"
          displayImage={true}
        />
        {!srcAsset?.chain_id && srcChain && (
          <>
            <h2 className="text-xl font-bold underline text-lime-300">Select a Source Asset</h2>
            <AssetGrid assets={srcAssets} selectAsset={setSrcAsset} />
          </>
        )}
        {srcAsset?.chain_id && (
          <>
            <AssetDisplay asset={srcAsset} />
            <h2 className="text-xl font-bold underline text-lime-300">Select Destination Chains</h2>
            <ChainGrid
              chains={destCandidates}
              selectedChains={destChains}
              setSelectedChains={setDestChains}
              srcAsset={srcAsset}
            />
            {channel && (
              <button
                onClick={handleSendOverIBC}
                style={{ visibility: destChains.length ? "visible" : "hidden", border: "3px solid #4B5563" }}
              >
                Send over IBC
              </button>
            )}
          </>
        )}
      </header>
    </div>
  );
}

export default App;
