import { useState } from "react";

const Dropdown = ({ chains, srcChain, setSrcChain }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSelectChain = (chain) => {
    setSrcChain(chain);
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded flex items-center justify-between hover:border hover:border-gray-300"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {srcChain?.chain_name && srcChain?.logo_uri ? (
          <img
            src={srcChain?.logo_uri}
            alt={srcChain?.chain_name}
            className="h-6 w-6 mr-2" // Adjust height and width as needed
          />
        ) : null}
        <span>
          {srcChain?.chain_name ? srcChain?.chain_name : "Choose a Chain"}
        </span>
        <span className="ml-2">▼</span>
      </button>
      {showDropdown && (
        <div className="absolute left-0 mt-1 py-2 w-56 bg-white rounded shadow-xl overflow-auto max-h-60">
          {chains.map((chain) => (
            <a
              key={chain.chain_id}
              href="#"
              className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
              onClick={() => handleSelectChain(chain)}
            >
              <img
                src={chain.logo_uri}
                alt={chain.chain_name}
                className="inline-block h-6 w-6 mr-2"
              />
              {chain.chain_name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
