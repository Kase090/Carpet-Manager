import { useState } from "react";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SalesPage from "./pages/salesPage";
import LogIn from "./pages/LogIn";
export default function App() {
  const handleLogin = (event) => {
    event.preventDefault();

    if (!codeInput.trim() || codeInput !== "123") {
      return;
    }
    setIsAuthenticated(true);
    setCodeInput("");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [page, setPage] = useState("home");

  return (
    <div>
      {!isAuthenticated ? (
        <LogIn
          setCodeInput={setCodeInput}
          handleLogin={handleLogin}
          codeInput={codeInput}
        />
      ) : (
        <div className="flex min-h-screen bg-gray-100">
          <Sidebar handleLogout={handleLogout} setPage={setPage} />

          <main className="flex-1 p-6 bg-gray-100">
            {page === "home" && <HomePage />}
            {page === "products" && <ProductsPage />}
            {page === "analytics" && <AnalyticsPage />}

            {page === "sales" && <SalesPage />}
          </main>
        </div>
      )}
    </div>
  );
}
