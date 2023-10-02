// This component is used to add a product to the marketplace and show the user's cEUR balance

// Importing the dependencies
import { useState, useCallback, useEffect } from "react"
// Import the useContractCall hook to read how many products are in the marketplace via the contract
import { useContractCall } from "@/hooks/contract/useContractRead";
// Import UserAccount hook to get user address
import { useAccount } from "wagmi";
import { TransactionHistory} from "@/helpers";
import TransactionData from "../TransactionData";

// This component is used to user transaction history
const TransactionHistory = () => {
  // The visible state is used to toggle the modal
  const [visible, setVisible] = useState(false);
  const {address} = useAccount()
  // Use the useContractCall hook to get user transaction history in marketplace
  const {data: rawtransactionHistory} = useContractCall("getTransactionHistory", [address], true);

  const [txnHistory, setTxnHistory] = useState<TransactionHistory[] | null>([]);

  // Format the transaction data that we read from the smart contract
  const getFormatTransactions = useCallback(() => {
    // component return null if can not get the product
    if (!rawtransactionHistory) return null;

    let Txn: TransactionHistory[] = [];

    for (let i  in rawtransactionHistory){
      Txn.push((rawtransactionHistory as TransactionHistory[])[Number(i)])
    }

    setTxnHistory(Txn);

  }, [rawtransactionHistory]);

   // Call the getFormatTransactions function when the rawtransactionHistory state changes
   useEffect(() => {
    getFormatTransactions();
  }, [getFormatTransactions]);
  // Define the JSX that will be rendered
  return (
    <div className={"flex flex-row w-full justify-between"}>
      <div>
        {/* Add Product Button that opens the modal */}
        <button
          type="button"
          onClick={() => setVisible(true)}
          className="inline-block px-6 py-2.5 bg-blue-500 text-black font-medium text-md leading-tight hover:bg-white-900 hover:shadow-lg focus:bg-gray-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-800 active:shadow-lg transition duration-150 ease-in-out"
          data-bs-toggle="modal"
          data-bs-target="#exampleModalCenter">
          Show Transaction History
        </button>

        {/* Modal */}
        {visible && (
          <div
            className="fixed z-40 overflow-y-auto top-0 w-full left-0"
            id="modal">
              <div className="flex items-center justify-center min-height-100vh pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity">
                  <div className="absolute inset-0 bg-gray-900 opacity-75" />
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
                  &#8203;
                </span>
                <div
                  className="inline-block align-center bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 w-full max-w-2xl max-h-full"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="modal-headline">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <h3 className="text-xl font-semibold mb-4">
                      Transaction History
                    </h3>
                    <table className="table-fixed w-full">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Txn Type</th>
                          <th scope="col">Product</th>
                          <th scope="col">Seller</th>
                          <th scope="col">Price</th>
                          <th scope="col">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {txnHistory ? (
                          txnHistory.map((txn, index) => (
                            <TransactionData txn={txn} key={index} />
                          ))
                        ) : (
                          <></>
                        )}
                      </tbody>
                   </table>
                  </div>
                  {/* Button to close the modal */}
                  <div className="bg-gray-200 px-4 py-3 text-right">
                    <button
                      type="button"
                      className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-700 mr-2"
                      onClick={() => setVisible(false)}>
                      <i className="fas fa-times"></i> Close
                    </button>
                  </div>
                </div>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;