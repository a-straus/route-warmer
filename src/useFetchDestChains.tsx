import { useEffect } from "react";
import axios from "axios";

const useFetchDestChains = (srcChain, setDestCandidates) => {
  useEffect(() => {
    const fetchAssetsFromSource = async () => {
      console.log("CALLED");
      if (srcChain && srcChain.fee_assets) {
        try {
          // Filter out fee assets containing 'denom' in their denom
          const validAssets = srcChain.fee_assets.filter(
            (asset) => !asset.denom.includes("denom")
          );

          console.log({ validAssets });

          // Create requests for each valid asset
          const requests = validAssets.map((asset) =>
            axios.post(
              "https://api.skip.money/v1/fungible/assets_from_source",
              {
                source_asset_denom: asset.denom,
                source_asset_chain_id: srcChain.chain_id,
                allow_multi_tx: false,
                client_id: "skip-api-docs",
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            )
          );

          const responses = await Promise.all(requests);

          const chainsFromResponse = responses.flatMap((response) => {
            return Object.keys(response.data.dest_assets).map((chainId) => ({
              chain_id: chainId,
            }));
          });

          const uniqueChains = Array.from(
            new Set(chainsFromResponse.map((chain) => chain.chain_id))
          ).map((chain_id) => {
            return {
              chain_id,
            };
          });

          setDestCandidates(uniqueChains);
        } catch (error) {
          console.error("Error fetching assets from source:", error);
        }
      }
    };

    fetchAssetsFromSource();
  }, [srcChain, setDestCandidates]);
};

export default useFetchDestChains;
