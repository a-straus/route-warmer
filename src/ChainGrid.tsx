import React, { useState } from "react";

const ChainGrid = ({ chains, selectedChains, setSelectedChains }) => {
  const toggleChainSelection = (chain) => {
    if (selectedChains.includes(chain)) {
      setSelectedChains(
        selectedChains.filter((c) => c.chain_id !== chain.chain_id)
      );
    } else {
      setSelectedChains([...selectedChains, chain]);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {" "}
      {chains.map((chain) => (
        <div
          key={chain.chain_id}
          className={`p-2 border cursor-pointer ${
            selectedChains.includes(chain) ? "bg-blue-200" : "hover:bg-blue-100"
          }`}
          onClick={() => toggleChainSelection(chain)}
        >
          <div className="flex items-center">
            {chain.logo_uri && (
              <img
                src={chain.logo_uri}
                alt={chain.chain_name}
                className="h-8 w-8 mr-2"
              />
            )}
            <span>{chain.chain_name}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChainGrid;
