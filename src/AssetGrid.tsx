import AssetDisplay from "./AssetDisplay";

const AssetGrid = ({ assets, selectAsset }) => {
  return (
    <div className="flex flex-wrap gap-4 p-4">
      {assets.map((asset, i) => (
        <div key={i} className="flex-grow p-2" style={{ flexBasis: "auto", flexGrow: 1 }}>
          <div className="cursor-pointer" onClick={() => selectAsset(asset)}>
            <AssetDisplay asset={asset} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AssetGrid;
