import React from "react";
import { Asset } from "./types";
import AssetDisplay from "./AssetDisplay";

const AssetGrid = ({ assets, selectAsset }) => {
  return (
    <div className="flex flex-wrap gap-4 p-4">
      {assets.map((asset, i) => (
        // Use a dedicated clickable area for each asset.
        <div
          key={i}
          className="flex-grow p-2"
          style={{ flexBasis: "auto", flexGrow: 1 }}
        >
          {/* This inner div is now the only clickable area, reducing excess space */}
          <div className="cursor-pointer" onClick={() => selectAsset(asset)}>
            <AssetDisplay asset={asset} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AssetGrid;
