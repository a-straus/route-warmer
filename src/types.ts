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
}
