import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SalesPage from "./pages/salesPage";
import LogIn from "./pages/LogIn";
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [page, setPage] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    setIsSidebarOpen(false);
  };

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    setIsSidebarOpen(false);
  };

  return (
    <div>
      {!isAuthenticated ? (
        <LogIn
          setCodeInput={setCodeInput}
          handleLogin={handleLogin}
          codeInput={codeInput}
        />
      ) : (
        <div className="min-h-screen bg-gray-100 md:flex">
          <Sidebar
            activePage={page}
            handleLogout={handleLogout}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            setPage={handlePageChange}
          />

          <div className="flex flex-1 flex-col">
            <header className="flex items-center justify-between bg-white px-4 py-3 shadow md:hidden">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="rounded-lg border border-gray-200 p-2 text-gray-700 transition hover:bg-gray-100"
                aria-label="Open navigation menu"
              >
                <Menu size={20} />
              </button>
              <span className="text-lg font-semibold text-gray-900">
                Carpet Manager
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
              >
                Log out
              </button>
            </header>

            <main className="flex-1 overflow-y-auto bg-gray-100 p-4 sm:p-6 md:p-8">
              {page === "home" && <HomePage />}
              {page === "products" && <ProductsPage />}
              {page === "analytics" && <AnalyticsPage />}

              {page === "sales" && <SalesPage />}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
