// Import Icons
import { Home, Table, BarChart2, DollarSign, LogOut } from "lucide-react";

// Accepts an optional `username` prop (defaults to "User")
export default function Sidebar({ username = "User" }) {
  return (
    // Main sidebar container
    // h-screen: full height | w-64: fixed width | bg-gray-900: dark background
    <div className="sticky top-0 h-screen w-64 bg-gray-900 text-white flex flex-col justify-between shadow-xl">
      {/* Navigation section */}
      <nav className="px-6 pt-14 flex-1">
        <ul className="space-y-14 text-xl">
          {/* Navigation Links */}
          <li className="flex items-center gap-4 cursor-pointer">
            <Home size={24} /> Home
          </li>
          <li className="flex items-center gap-4 cursor-pointer">
            <Table size={24} /> Products
          </li>
          <li className="flex items-center gap-4 cursor-pointer">
            <BarChart2 size={24} /> Analytics
          </li>
          <li className="flex items-center gap-4 cursor-pointer">
            <DollarSign size={24} /> Sales
          </li>
        </ul>
      </nav>
      {/* Account info + logout section */}
      <div className="p-6">
        {/* "Logged in as" text */}
        <div className="flex flex-row space-x-1 text-md mb-6">
          <span className="font-semibold">Logged in as</span>
          <span className="font-bold">{username}</span>
        </div>
        {/* Logout button */}
        <div className="border-t border-gray-700 pt-4 flex items-center gap-2 cursor-pointer">
          <LogOut size={24} /> Logout
        </div>
      </div>
    </div>
  );
}
