import React from "react";
import { Asset } from "./types";

const AssetDisplay = ({ asset }: { asset: Asset }) => {
  const getName = (asset) => {
    let name = asset.name;
    if (!name) {
      const parts = asset.denom.split("/");
      name = parts.length >= 3 ? parts[2] : asset.denom;
    }
    return name && name.length <= 32 ? name : null; // Return null if the name is longer than 32 chars
  };

  const displayName = getName(asset); // Call getName once and store the result

  if (displayName === null) {
    return null; // Don't render anything if displayName is null
  }

  return (
    <div className="flex flex-col items-center p-2 border border-gray-200 rounded">
      {asset.logo_uri && <img src={asset.logo_uri} alt={displayName} className="h-12 w-12" />}
      {displayName && <span className="mt-2 text-sm">{displayName}</span>}
    </div>
  );
};

export default AssetDisplay;
