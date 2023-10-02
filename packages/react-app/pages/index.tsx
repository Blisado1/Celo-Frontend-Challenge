// This is the main page of the app
import ProductList from "@/components/ProductList";
import AddProductModal from "@/components/modal/AddProductModal";

// Export the Home component
export default function Home() {
  return (
    <div className="w-full">
      <AddProductModal />
      <ProductList />
    </div>
  );
}
