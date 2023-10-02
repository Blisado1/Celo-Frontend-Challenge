// This component is used to display transaction data
// import ethers to convert the product price to wei
import { BigNumber, ethers } from "ethers";
// Import the useContractCall hook to read how many products are in the marketplace via the contract
import { useContractCall } from "@/hooks/contract/useContractRead";
import { TransactionHistory, convertTime, getTxnType, truncateAddress } from "@/helpers";

// Define prop type for the modal
interface TransactionDataProps  {
    txn: TransactionHistory
}

// This component is used to user transaction history
const TransactionData: React.FC<TransactionDataProps> = ({txn}) => {
  // Use the useContractCall hook to read the data of the product with the id passed in, from the marketplace contract
  const { data: rawProduct }: any = useContractCall("readProduct", [Number(txn.productId.toString())], true);

  const getProductName = () => {
    // check if item has not been deleted
    if (rawProduct[0] != "0x0000000000000000000000000000000000000000") {
      return (rawProduct[1]);
    }else{
      return "Item no longer in Marketplace"
    }
  }

  const productPriceFromWei = (price: BigNumber) => ethers.utils.formatEther(
      price.toString()
    );

  // Define the JSX that will be rendered
  return (
    <tr className="align-middle">
        <td id="id">{txn.txID.toString()}</td>
        <td id="type">{getTxnType(txn.tranType)}</td>
        <td id="product">{getProductName()}</td>
        <td id="seller"> 
        <a
        href={`https://explorer.celo.org/alfajores/address/${txn.seller}`}
        target="_blank"
        rel="noreferrer"
        style={{ color: "#00B74A" }}
        >
            {truncateAddress(txn.seller)}
        </a>
        </td>
        <td id="price">{productPriceFromWei(txn.price)} cREAL</td>
        <td id="time">{convertTime(Number(txn.createdAt.toString()))}</td>
    </tr>
  );
};

export default TransactionData;