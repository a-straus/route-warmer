import { useEffect } from "react";
import axios from "axios";
import { AssetsFromSourceResponse, Chain } from "./types";
import { getFeeAsset } from "./util";

const useFetchDestChains = (srcChain: Chain | null, chains: Chain[], setDestCandidates) => {
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
            const { dest_assets } = response.data as AssetsFromSourceResponse;
            const destChains = Object.keys(dest_assets).map((chainId) => {
              const chain = chains.find((chain) => chain.chain_id === chainId);
              if (!chain) return null;
              return {
                ...chain,
                src_denom: dest_assets[chainId].assets[0].denom,
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
