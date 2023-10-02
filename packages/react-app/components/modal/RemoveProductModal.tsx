// Importing the dependencies
// Import the toast library to display notifications
import { toast } from "react-toastify";
// Import our custom useContractSend hook to write a product to the marketplace contract
import { useContractSend } from "@/hooks/contract/useContractWrite";
// Import Close Icon
import { AiOutlineClose } from "react-icons/ai";

// Define prop type for the modal
interface RemoveProductModalProps {
  id: number;
  setLoading: (message: string) => void;
  onClose: () => void;
}

// define the modal component
const RemoveProductModal: React.FC<RemoveProductModalProps> = ({
  id,
  onClose,
  setLoading,
}) => {
  // Use the useContractSend hook to delete the product with the id passed in, via the marketplace contract
  const { writeAsync: remove } = useContractSend("removeProduct", [
    Number(id),
  ]);

  // Define function that handles the delete action of a product through the marketplace contract
  const handleRemove = async () => {
    if (!remove) {
      throw "Failed to create product";
    }
    setLoading("removing product...");
    onClose();
    // Create the product by calling the writeProduct function on the marketplace contract
    const deleteTx = await remove();
    setLoading("Waiting for confirmation...");
    // Wait for the transaction to be mined
    await deleteTx.wait();
  };

  // Define the deleteProduct function that is called when the user clicks the delete button
  const removeProduct = async () => {
    try {
      // Display a notification while the product is being added to the marketplace
      await toast.promise(handleRemove(), {
        pending: "Removing product...",
        success: "Product removed successfully",
        error: "Something went wrong. Try again.",
      });
      // Display an error message if something goes wrong
    } catch (e: any) {
      console.log({ e });
      toast.error(e?.message || "Something went wrong. Try again.");
      // Clear the loading state after the product is added to the marketplace
    } finally {
      setLoading("");
      location.reload();
    }
  };

  // Return the Update & Delete modal JSX component
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg w-96">
        {/* Title and close button */}
        <div className="flex">
          <h1 className="text-xl font-semibold mb-4 flex-1">
            REMOVE PRODUCT
          </h1>
          {/* Close Button */}
          <button
            className="border-gray-300 border px-2 rounded-xl"
            onClick={onClose}
            >
            <AiOutlineClose size={24} />
          </button>
        </div>

        <div className="mb-4">
          <label className="block my-4 font-semibold">
            Are you sure you want to remove this product?
          </label>
        </div>
        {/* Button to delete */}
        <div className="flex justify-between">
          <button
            onClick={removeProduct}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Remove Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveProductModal;
