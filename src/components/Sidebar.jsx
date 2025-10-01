// Import Icons
import { Home, Table, BarChart2, DollarSign, LogOut, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", value: "home", Icon: Home },
  { label: "Products", value: "products", Icon: Table },
  { label: "Analytics", value: "analytics", Icon: BarChart2 },
  { label: "Sales", value: "sales", Icon: DollarSign },
];
// Accepts an optional `username` prop (defaults to "User")
export default function Sidebar({
  activePage = "home",
  handleLogout,
  isOpen = false,
  onClose,
  setPage = () => {},
}) {
  const containerClasses =
    "fixed bottom-0 left-0 top-0 z-50 flex w-72 flex-col justify-between bg-gray-900 text-white shadow-xl transition-transform duration-300 md:sticky md:top-0 md:bottom-auto md:h-screen md:w-64 md:translate-x-0 md:self-start md:shadow-none";

  const handleNavigation = (page) => {
    setPage(page);
    if (typeof onClose === "function") {
      onClose();
    }
  };
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 md:hidden ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Main sidebar container */}
      <aside
        className={`${containerClasses} ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex-1 overflow-y-auto px-6 pt-12 pb-8">
          <div className="flex items-center justify-between md:hidden">
            <span className="text-lg font-semibold">Navigation</span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1 text-gray-300 transition hover:text-white"
              aria-label="Close navigation menu"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="mt-6">
            <ul className="space-y-4 text-lg">
              {NAV_ITEMS.map((item) => {
                const { label, value } = item;
                const IconComponent = item.Icon;
                const isActive = value === activePage;
                const itemClasses =
                  "flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition focus:outline-none  ";

                return (
                  <li key={value}>
                    <button
                      type="button"
                      onClick={() => handleNavigation(value)}
                      className={`${itemClasses} ${
                        isActive
                          ? "bg-white/10 font-semibold"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <IconComponent size={22} /> {label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
        {/* Logout button */}
        {/* Account info + logout section */}
        <div className="border-t border-white/10 px-6 py-6">
          {/* "Logged in as" text */}
          <div className="mb-6 flex flex-col text-sm text-gray-300">
            <span className="font-semibold text-white">Logged in</span>
          </div>
          {/* Logout button */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl border border-white/10 px-4 py-3 text-left text-sm font-medium text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
