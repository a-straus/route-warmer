import React from "react";
import {
  useAccount,
  useActiveChains,
  useConnect,
  useDisconnect,
  useSendIbcTokens,
  useStargateSigningClient,
} from "graz";

const GrazTest: React.FC = () => {
  const { data: account, isConnected } = useAccount({
    multiChain: true,
    chainId: "osmosis-1",
  });
  const { connect } = useConnect({
    onSuccess: (account) => {
      console.log({
        description: `Successfully connected to ${account.chains}`,
        duration: 3000,
        isClosable: true,
        status: "success",
      });
    },
  });
  const { disconnect } = useDisconnect({
    onSuccess: () => {
      console.log({
        description: `Successfully disconnected from all chains`,
        duration: 3000,
        isClosable: true,
        status: "success",
      });
    },
  });
  const activeChains = useActiveChains();
  console.log({ activeChains });
  const { data: signingClient } = useStargateSigningClient({
    chainId: "osmosis-1",
  });
  const { sendIbcTokens, error, isSuccess, status } = useSendIbcTokens();
  console.log({ account });
  return (
    <div>
      {isConnected ? (
        <button onClick={() => disconnect()}>Disconnect All</button>
      ) : (
        <button onClick={() => connect({ chainId: "osmosis-1" })}>connect</button>
      )}
      <div>{account?.bech32Address?.address}</div>
      <button
        onClick={() =>
          sendIbcTokens({
            signingClient,
            senderAddress: account?.["osmosis-1"]?.bech32Address,
            recipientAddress: "cosmos1gwqlqyt33gyt9a2kzs2e934w2wu4l659le4sl7",
            transferAmount: { amount: "1", denom: "uosmo" },
            sourcePort: "transfer",
            sourceChannel: "channel-0", //141 for atom to osmo
            timeoutTimestamp: Date.now() + 2 * 60 * 1000,
            fee: {
              amount: [
                {
                  amount: "10000",
                  denom: "uosmo",
                },
              ],
              gas: "2000000",
            },
            memo: "inmyappera",
          })
        }
      >
        send
      </button>
      <p>{status}</p>
    </div>
  );
};

export default GrazTest;
