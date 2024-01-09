import { useEffect } from "react";
import axios from "axios";
import { Chain } from "./types";

const getFeeAsset = (chain: Chain | null) => {
  if (!chain) return null;
  const regex = /^(?!.*(?:ibc|factory)).*$/;
  return chain.fee_assets?.find((asset) => regex.test(asset.denom)) || null;
};

const useFetchDestChains = (srcChain, chains, setDestCandidates) => {
  useEffect(() => {
    const fetchDestChains = async () => {
      if (srcChain && srcChain.fee_assets) {
        const feeAsset = getFeeAsset(srcChain);
        if (!feeAsset) return;
        try {
          const response = await axios.post(
            "https://api.skip.money/v1/fungible/assets_from_source",
            {
              source_asset_denom: feeAsset.denom,
              source_asset_chain_id: srcChain.chain_id,
              allow_multi_tx: false,
              client_id: "route-warmer",
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.data.dest_assets) {
            const destChains = Object.keys(response.data.dest_assets).map((chainId) => {
              const chain = chains.find((chain) => chain.chain_id === chainId);
              if (!chain) return null;
              return {
                ...chain,
                trace: response.data.dest_assets[chainId].assets[0].trace,
              };
            });
            setDestCandidates(destChains);
          }
        } catch (error) {
          console.error("Error fetching assets from source:", error);
        }
      }
    };

    fetchDestChains();
  }, [srcChain, chains, setDestCandidates]);
};

export default useFetchDestChains;
