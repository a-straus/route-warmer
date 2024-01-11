import { useState } from "react";
import AssetDisplay from "./AssetDisplay";

const AssetGrid = ({ assets, selectAsset }) => {
  const [filter, setFilter] = useState("");

  const isValidAsset = (asset) => {
    let name = asset.name;
    if (!name) {
      const parts = asset.denom.split("/");
      name = parts.length >= 3 ? parts[2] : asset.denom;
    }
    return name && name.length <= 32;
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Filter assets..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4 p-2 border border-gray-200 rounded text-gray-800 pl-"
      />

      <div className="flex flex-wrap gap-4 p-4">
        {assets
          .filter(
            (a) =>
              (isValidAsset(a) && a.name?.toLowerCase().includes(filter.toLowerCase())) ||
              a.denom.toLowerCase().includes(filter.toLowerCase())
          )
          .map((asset, i) => (
            <div key={i} className="flex-grow p-2" style={{ flexBasis: "auto", flexGrow: 1 }}>
              <div className="cursor-pointer" onClick={() => selectAsset(asset)}>
                <AssetDisplay asset={asset} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AssetGrid;
