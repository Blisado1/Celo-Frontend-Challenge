// This hook is used to make write calls to a smart contract (send transactions)

// Import the wagmi hooks to prepare and write to a smart contract
import { useContractWrite, usePrepareContractWrite } from "wagmi";
// Import the Marketplace ABI(Interface)
import MarketplaceInstance from "../../abi/Marketplace.json";
// Import BigNumber from ethers to handle big numbers used in Celo
import { BigNumber } from "ethers";

// Define a constant for the gas limit
const GAS_LIMIT = BigNumber.from(1000000);

// Write to a smart contract
export const useContractSend = (
  functionName: string,
  args: Array<any>
) => {
  // Prepare the write to the smart contract
  const { config } = usePrepareContractWrite({
    // The address of the smart contract
    address: `0x${MarketplaceInstance.address}`,
    // The ABI of the smart contract
    abi: MarketplaceInstance.abi,
    // The smart contract function name to call
    functionName,
    // The arguments to pass to the smart contract function
    args,
    // The gas limit to use when sending a transaction
    overrides: {
      gasLimit: GAS_LIMIT,
    },
    onError: (err) => {
      console.error("Error: ", err);
    },
  });

  // Write to the smart contract using the prepared config
  const { data, isSuccess, write, writeAsync, error, isLoading, isError } = useContractWrite(config);
  return { data, isSuccess, write, writeAsync, isLoading, error, isError };
};
