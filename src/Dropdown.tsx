import { useState } from "react";

const Dropdown = ({ items, selectedItem, setSelectedItem, displayProperty, displayImage }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [imageError, setImageError] = useState({});

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setShowDropdown(false);
  };

  const handleImageError = (item) => {
    setImageError((prevError) => ({
      ...prevError,
      [item.chain_id || item.id]: true,
    }));
  };

  // Sort and filter items
  const sortedFilteredItems = items
    .filter((item) => item[displayProperty].toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const chainIdA = a.chain_name || a.id;
      const chainIdB = b.chain_name || b.id;
      return chainIdA.localeCompare(chainIdB);
    });

  return (
    <div className="relative">
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded flex items-center justify-between hover:border hover:border-gray-300"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {displayImage && selectedItem?.logo_uri && !imageError[selectedItem.chain_id || selectedItem.id] ? (
          <img
            src={selectedItem.logo_uri}
            alt={selectedItem[displayProperty]}
            className="h-6 w-6 mr-2"
            onError={() => handleImageError(selectedItem)}
          />
        ) : null}
        <span>{selectedItem ? selectedItem[displayProperty] : "Select a Chain"}</span>
        <span className="ml-2">▼</span>
      </button>
      {showDropdown && (
        <div className="absolute left-0 mt-1 py-2 w-56 bg-white rounded shadow-xl overflow-auto max-h-60">
          <input
            type="text"
            placeholder="Search..."
            className="mb-2 p-1 w-full border border-gray-300 rounded text-gray-800 pl-3"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {sortedFilteredItems.map((item) => (
            <a
              key={item.chain_id || item.id}
              className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
              onClick={(e) => {
                e.preventDefault();
                handleSelectItem(item);
              }}
            >
              {displayImage && item.logo_uri && !imageError[item.chain_id || item.id] ? (
                <img
                  src={item.logo_uri}
                  alt={item[displayProperty]}
                  className="inline-block h-6 w-6 mr-2"
                  onError={() => handleImageError(item)}
                />
              ) : null}
              {item[displayProperty]}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
