import { useEffect } from "react";
import axios from "axios";

export const useFetchTokensOnChain = (srcChain, setTokens) => {
  useEffect(() => {
    const fetchTokens = async () => {
      if (srcChain) {
        try {
          const response = await axios.get(
            `https://api.skip.money/v1/fungible/assets?chain_id=${srcChain.chain_id}&native_only=true&include_no_metadata_assets=true&include_cw20_assets=false&include_evm_assets=false&client_id=route-warmer`
          );
          const assets = response?.data.chain_to_assets_map[srcChain.chain_id]?.assets;
          if (assets) {
            setTokens(assets);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchTokens();
  }, [srcChain]);
};
