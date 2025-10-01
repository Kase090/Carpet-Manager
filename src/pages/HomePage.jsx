import { useCallback, useMemo, useState } from "react";
import { Package, DollarSign, AlertTriangle, Star } from "lucide-react";
import Table from "../components/Table";

// Format large totals for the dashboard cards in a readable currency string.
const formatCurrency = (value) => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  } catch (error) {
    return `$${Number(value ?? 0).toLocaleString()}`;
  }
};

// Normalise arbitrary values so we can safely perform numeric comparisons.
const getNumericValue = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

// Attempt to build a friendly product label even if column names differ.
const getProductLabel = (product) => {
  if (!product || typeof product !== "object") return "Unnamed Product";

  return (
    product.name ||
    product.productName ||
    product.title ||
    product.sku ||
    product.id ||
    product.type ||
    "Unnamed Product"
  );
};

// Inspect common sale-related fields and return the first numeric value found.
const getSaleValue = (product) => {
  if (!product) return null;
  const saleKeys = ["sale", "salePrice", "totalSales", "revenue", "price"];
  for (const key of saleKeys) {
    const numeric = getNumericValue(product[key]);
    if (numeric !== null) {
      return numeric;
    }
  }
  return null;
};

// Look up the current stock level from whichever column the table provides.
const getStockLevel = (product) => {
  if (!product) return null;
  const stockKeys = ["stockLevel", "stock", "quantity", "inventory"];
  for (const key of stockKeys) {
    const numeric = getNumericValue(product[key]);
    if (numeric !== null) {
      return numeric;
    }
  }
  return null;
};

// Read the configured low-stock threshold across multiple possible column names.
const getLowStockThreshold = (product) => {
  if (!product) return null;
  const thresholdKeys = [
    "LowStockthreshold",
    "lowStockThreshold",
    "reorderPoint",
    "minStock",
  ];
  for (const key of thresholdKeys) {
    const numeric = getNumericValue(product[key]);
    if (numeric !== null) {
      return numeric;
    }
  }
  return null;
};

export default function HomePage() {
  const [products, setProducts] = useState([]);

  const handleRowsChange = useCallback((rows) => {
    if (!Array.isArray(rows)) {
      setProducts([]);
      return;
    }

    setProducts(rows);
  }, []);

  const { totalProducts, formattedSales, lowStockItems, bestSeller } =
    useMemo(() => {
      const safeProducts = Array.isArray(products) ? products : [];

      const totalProductsCount = safeProducts.length;

      const totalSalesValue = safeProducts.reduce((sum, product) => {
        const saleValue = getSaleValue(product);
        return saleValue !== null ? sum + saleValue : sum;
      }, 0);

      const bestSellerProduct = safeProducts.reduce((best, product) => {
        const saleValue = getSaleValue(product);
        if (saleValue === null) return best;

        if (!best || saleValue > best.value) {
          return { label: getProductLabel(product), value: saleValue };
        }

        return best;
      }, null);

      const lowStockCandidates = safeProducts
        .map((product) => {
          const stockLevel = getStockLevel(product);
          const threshold = getLowStockThreshold(product);

          if (stockLevel === null || threshold === null) return null;

          return stockLevel <= threshold ? getProductLabel(product) : null;
        })
        .filter(Boolean);

      const uniqueLowStock = Array.from(new Set(lowStockCandidates));

      return {
        totalProducts: totalProductsCount,
        formattedSales: formatCurrency(totalSalesValue),
        lowStockItems: uniqueLowStock,
        bestSeller:
          bestSellerProduct?.label ??
          (safeProducts.length > 0 ? getProductLabel(safeProducts[0]) : "N/A"),
      };
    }, [products]);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">
          Monitor key metrics and manage your carpet inventory.
        </p>
      </header>
      {/* ====== Key Metrics Section ====== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Products */}
        <div className="bg-white shadow-md rounded-xl p-6 flex items-center gap-4">
          {/* Icon Left Center */}
          <Package size={48} className="text-gray-700 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="text-3xl font-bold">{totalProducts}</p>
          </div>
        </div>

        {/* Total Sales */}
        <div className="bg-white shadow-md rounded-xl p-6 flex items-center gap-4">
          <DollarSign size={48} className="text-gray-700 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-500">Total Sales</p>
            <p className="text-3xl font-bold">{formattedSales}</p>
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
              <p className="text-gray-500 text-sm">No low stock items </p>
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
      <Table onRowsChange={handleRowsChange} />
    </div>
  );
}
