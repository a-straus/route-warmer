import { useEffect, useMemo, useState } from "react";
import { Asset, Chain, FeeAsset } from "./types";
import axios from "axios";
import "./App.css";
import Dropdown from "./Dropdown";
import AssetGrid from "./AssetGrid";
import AssetDisplay from "./AssetDisplay";
import ChainGrid from "./ChainGrid";
import { useSendIbcTokens, useStargateSigningClient, useAccount, useConnect, useDisconnect, WalletType } from "graz";
import { useFetchTokensOnChain } from "./useFetchTokensOnChain";
import useFetchDestChains from "./useFetchDestChains";

function App() {
  const { data: signingClient } = useStargateSigningClient();
  const { sendIbcTokens } = useSendIbcTokens();
  console.log({ sendIbcTokens });

  const [chains, setChains] = useState<Chain[]>([]);
  const [srcChain, setSrcChain] = useState<Chain | null>(null);
  const [srcAssets, setSrcAssets] = useState<Asset[]>([]);
  const [srcAsset, setSrcAsset] = useState<Asset | null>(null);
  const [destCandidates, setDestCandidates] = useState<Chain[]>([]);
  const [destChains, setDestChains] = useState<Chain[]>([]);
  const [traces, setTraces] = useState<{ chain_id: string; trace: string }[]>([]);

  const { data: account, isConnected } = useAccount({ chainId: srcChain?.chain_id });

  const { connect, status } = useConnect();
  const { disconnect } = useDisconnect();

  function handleConnect() {
    return isConnected
      ? disconnect()
      : connect({
          chainId: "cosmoshub-4",
          walletType: WalletType.KEPLR,
        });
  }

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
  }, [srcChain]);

  // Reset states when srcAsset changes
  useEffect(() => {
    setDestChains([]);
  }, [srcAsset]);

  useFetchTokensOnChain(srcChain, setSrcAssets);
  useFetchDestChains(srcChain, chains, setDestCandidates);

  const handleSendOverIBC = async () => {
    console.log({ signingClient, srcAsset, destChains });
    if (!signingClient || !srcAsset || !destChains.length) return;
    if (account) {
      await sendIbcTokens({
        signingClient,
        senderAddress: account.bech32Address,
        recipientAddress: account.bech32Address,
        transferAmount: {
          denom: srcAsset.symbol,
          amount: "100000000",
        },
        sourcePort: "transfer",
        sourceChannel: "channel-0",
        timeoutTimestamp: Number.parseInt(new Date(Date.now() + 5 * 60 * 1000).toISOString()),
        fee: "auto",
        memo: "test",
      });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          {account ? `Connected to ${account.bech32Address}` : status}
          <button onClick={handleConnect}>{isConnected ? "Disconnect" : "Connect"}</button>
        </div>
        <h1 className="text-3xl font-bold underline text-lime-300">Skip Route Warmer</h1>
        <Dropdown
          items={chains}
          selectedItem={srcChain}
          setSelectedItem={setSrcChain}
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
            <ChainGrid chains={destCandidates} selectedChains={destChains} setSelectedChains={setDestChains} />
            <button onClick={handleSendOverIBC}>Send over IBC</button>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
