import React, { useEffect, useMemo, useState } from "react";
import logo from "./logo.svg";
import { Asset, Chain } from "./types";
import axios from "axios";
import "./App.css";
import Dropdown from "./Dropdown";

/**
 *
 * Users first pick their chain
 * Then they'll pick their token on that chain
 *
 * Use recommended asset endpoint to get the list of chains that you can go to
 * Once they choose which chain to go to you can query v2/transfer to get the channel
 *
 * Then we'll use the Keplr wallet SDK hopefully to do that
 *
 * You can create the packets to IBC send those specific tokens.
 * Would be great to batch the transactions together and only ask the keplr wallet to sign one of them
 */

function App() {
  const [chains, setChains] = useState([]);
  const [srcChain, setSrcChain] = useState<Chain | null>({} as Chain);
  const [srcAsset, setSrcAsset] = useState<Asset | null>({} as Asset);
  const [destCandidates, setDestCandidates] = useState<Chain[]>([]);
  const [destChain, setDestChain] = useState<Chain | null>({} as Chain);

  useMemo(async () => {
    try {
      const response = await axios.get(
        "https://api.skip.money/v1/info/chains?include_evm=false&client_id=route-warmer"
      );
      setChains(response.data.chains);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useMemo(() => {
    const fetchTokens = async () => {
      if (srcChain) {
        try {
          const response = await axios.get(
            `https://api.example.com/tokens?chain=${srcChain.chain_id}`
          );
          setDestCandidates(response.data.chains);
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchTokens();
  }, [srcChain]);

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-3xl font-bold underline text-lime-300">
          Skip Route Warmer
          <p />
        </h1>
        <Dropdown
          chains={chains}
          srcChain={srcChain}
          setSrcChain={setSrcChain}
        />
      </header>
    </div>
  );
}

export default App;
