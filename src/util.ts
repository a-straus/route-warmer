import bech32 from "bech32";
import { Chain } from "./types";
export function convertBech32Address(inputAddress, newPrefix) {
  if (!inputAddress) alert("Please enter an address to convert");
  try {
    // Decode the original Bech32 address
    const decoded = bech32.decode(inputAddress);

    // Re-encode with the new prefix
    const newAddress = bech32.encode(newPrefix, decoded.words);
    return newAddress;
  } catch (error) {
    console.error("Error in conversion:", error);
    return null;
  }
}

export const getFeeAsset = (chain: Chain | null) => {
  if (!chain) return null;
  const regex = /^(?!.*(?:ibc|factory)).*$/;
  return chain.fee_assets?.find((asset) => regex.test(asset.denom)) || null;
};
