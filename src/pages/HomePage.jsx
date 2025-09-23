import { Package, DollarSign, AlertTriangle, Star } from "lucide-react";
import Table from "../components/Table";
export default function HomePage() {
  // Example data — replace with real inventory data later
  const lowStockItems = ["Carpet 2", "Carpet 3"];
  const bestSeller = "Carpet 1";

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* ====== Key Metrics Section ====== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Products */}
        <div className="bg-white shadow-md rounded-xl p-6 flex items-center gap-4">
          {/* Icon Left Center */}
          <Package size={48} className="text-gray-700 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="text-3xl font-bold">9999</p>
          </div>
        </div>

        {/* Total Sales */}
        <div className="bg-white shadow-md rounded-xl p-6 flex items-center gap-4">
          <DollarSign size={48} className="text-gray-700 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-500">Total Sales</p>
            <p className="text-3xl font-bold">$999999</p>
          </div>
        </div>

        {/* Low Stock Section */}
        <div className="bg-white shadow-md rounded-xl p-6 flex items-center gap-4">
          <AlertTriangle size={48} className=" flex-shrink-0" />
          <div>
            <p className="text-lg font-bold text-gray-800">Low Stock</p>
            {lowStockItems.length > 0 ? (
              <ul className="list-disc list-inside text-gray-700 mt-1 space-y-1 text-sm">
                {lowStockItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No low stock items 🎉</p>
            )}
          </div>
        </div>

        {/* Best Seller */}
        <div className="bg-white shadow-md rounded-xl p-6 flex items-center gap-4">
          <Star size={48} className=" flex-shrink-0" />
          <div>
            <p className="text-lg font-bold text-gray-800">Best Seller</p>
            <p className="text-xl font-semibold text-gray-700">{bestSeller}</p>
          </div>
        </div>
      </div>
      <Table />
    </div>
  );
}
