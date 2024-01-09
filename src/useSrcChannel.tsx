import { useEffect } from "react";
import { Asset, Chain, FeeAsset, RouteResponse } from "./types";
import axios from "axios";

const useSrcChannel = (
  srcChain: Chain | null,
  srcAsset: Asset | null,
  srcFeeAsset: FeeAsset | null,
  destChain: Chain | null,
  setChannel: any
) => {
  useEffect(() => {
    const getChannel = async () => {
      if (srcChain && srcAsset && srcFeeAsset && destChain) {
        const body = {
          amount_in: "1".padEnd(srcAsset.decimals + 1, "0"),
          source_asset_denom: srcFeeAsset.denom,
          source_asset_chain_id: srcChain.chain_id,
          dest_asset_denom: destChain.src_denom,
          dest_asset_chain_id: destChain.chain_id,
          cumulative_affiliate_fee_bps: "0",
          client_id: "route-warmer",
        };
        try {
          const response = await axios.post("https://api.skip.money/v2/fungible/route", body, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          const { data }: { data: RouteResponse } = response;
          setChannel(data.operations[0].transfer.channel);
        } catch (error) {
          console.error("Error fetching route:", error);
        }
      }
    };
    getChannel();
  }, [srcChain, srcAsset, destChain, setChannel]);
};

export default useSrcChannel;
