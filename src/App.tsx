import { useEffect, useMemo, useState } from "react";
import { Asset, Chain } from "./types";
import axios from "axios";
import "./App.css";
import Dropdown from "./Dropdown";
import AssetGrid from "./AssetGrid";
import AssetDisplay from "./AssetDisplay";
import useFetchDestChains from "./useFetchDestChains";
import ChainGrid from "./ChainGrid";
import { useSendIbcTokens, useStargateSigningClient } from "graz";

function App() {
  const [chains, setChains] = useState([]);
  const [srcChain, setSrcChain] = useState<Chain | null>(null);
  const [srcAssets, setSrcAssets] = useState<Asset[]>([]);
  const [srcAsset, setSrcAsset] = useState<Asset | null>(null);
  const [destCandidates, setDestCandidates] = useState<Chain[]>([]);
  const [destChains, setDestChains] = useState<Chain[]>([]);

  const { data: signingClient } = useStargateSigningClient();
  const { sendIbcTokens } = useSendIbcTokens();

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
    setDestCandidates([]);
    setDestChains([]);
  }, [srcChain]);

  // fetch assets for selected chain
  useEffect(() => {
    const fetchTokens = async () => {
      if (srcChain) {
        try {
          const response = await axios.get(
            `https://api.skip.money/v1/fungible/assets?chain_id=${srcChain.chain_id}&native_only=true&include_no_metadata_assets=true&include_cw20_assets=false&include_evm_assets=false&client_id=route-warmer`
          );
          console.log(response);
          const assets = response?.data.chain_to_assets_map[srcChain.chain_id]?.assets;
          if (assets) {
            setSrcAssets(assets);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchTokens();
  }, [srcChain]);

  // Reset states when srcAsset changes
  useEffect(() => {
    setDestCandidates([]);
    setDestChains([]);
  }, [srcAsset]);

  // fetch candidate chains for destination
  useEffect(() => {
    const fetchDestChains = async () => {
      if (srcAsset?.chain_id) {
        try {
          const response = await axios.get(
            `https://api.skip.money/v1/info/chains?include_evm=false&client_id=route-warmer&exclude_chain_ids=${srcAsset.chain_id}`
          );
          setDestCandidates(response.data.chains);
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchDestChains();
  }, [srcAsset]);

  useFetchDestChains(srcChain, setDestChains);

  return (
    <div className="App">
      <header className="App-header">
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
          </>
        )}
      </header>
    </div>
  );
}

export default App;
