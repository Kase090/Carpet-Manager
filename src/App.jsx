import ProductsPage from "./pages/ProductsPage";
import Sidebar from "./components/Sidebar";

export default function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex-1 p-6 bg-gray-100">
        <ProductsPage />
        {/* Dashboard + Table content will go here */}
      </main>
    </div>
  );
}
