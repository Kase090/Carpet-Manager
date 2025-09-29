import { useState } from "react";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar setPage={setPage} />

      <main className="flex-1 p-6 bg-gray-100">
        {page === "home" && <HomePage />}
        {page === "products" && <ProductsPage />}

        {/* Dashboard + Table content will go here */}
      </main>
    </div>
  );
}
