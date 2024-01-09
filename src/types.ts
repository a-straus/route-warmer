export interface AssetsFromSourceResponse {
  dest_assets: {
    [key: string]: {
      assets: Asset[];
    };
  };
}

export interface RouteResponse {
  source_asset_denom: string;
  source_asset_chain_id: string;
  dest_asset_denom: string;
  dest_asset_chain_id: string;
  amount_in: string;
  amount_out: string;
  operations: Operation[];
  chain_ids: string[];
  does_swap: boolean;
  estimated_amount_out: string;
  txs_required: number;
  usd_amount_in: string;
  usd_amount_out: string;
}

export interface Operation {
  transfer: Transfer;
}

export interface Transfer {
  port: string;
  channel: string;
  chain_id: string;
  pfm_enabled: boolean;
  dest_denom: string;
  supports_memo: boolean;
}

export interface Asset {
  chain_id: string;
  coingecko_id: string;
  decimals: number;
  denom: string;
  description: string;
  is_cw20: boolean;
  is_evm: boolean;
  logo_uri: string;
  name: string;
  origin_chain_id: string;
  origin_denom: string;
  recommended_symbol: string;
  symbol: string;
  token_contract: string;
  trace: string;
}

interface GasPriceInfo {
  average: string;
  high: string;
  low: string;
}

export interface FeeAsset {
  description: string;
  denom: string;
  gas_price_info: GasPriceInfo;
}

export interface Chain {
  bech32_prefix: string;
  chain_id: string;
  chain_name: string;
  fee_assets: FeeAsset[];
  logo_uri: string;
  pfm_enabled: boolean;
  chain_type: string;
  trace: string;
  src_denom?: string;
}
