import { useCallback, useMemo, useState } from "react";
import { Package, DollarSign, AlertTriangle, Star } from "lucide-react";
import Table from "../components/Table";
import { productColumns, sampleProducts } from "../data/product";

// Format large totals for the dashboard cards in a readable currency string.
const formatCurrency = (value) => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `$${Number(value ?? 0).toLocaleString()}`;
  }
};

// Normalise arbitrary values so we can safely perform numeric comparisons.
const getNumericValue = (value) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const cleaned = value.replace(/[^0-9+\-.,]+/g, "");
    const normalised = cleaned.replace(/,/g, "");
    if (!normalised) return null;

    const parsed = Number(normalised);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const normaliseKey = (key) =>
  typeof key === "string" ? key.toLowerCase().replace(/[^a-z0-9]/g, "") : "";

const getFirstNumericByKeys = (product, candidateKeys) => {
  if (!product || typeof product !== "object") return null;

  for (const key of candidateKeys) {
    if (key in product) {
      const numeric = getNumericValue(product[key]);
      if (numeric !== null) return numeric;
    }
  }

  const normalisedCandidates = candidateKeys.map(normaliseKey);

  for (const [actualKey, rawValue] of Object.entries(product)) {
    if (normalisedCandidates.includes(normaliseKey(actualKey))) {
      const numeric = getNumericValue(rawValue);
      if (numeric !== null) return numeric;
    }
  }

  return null;
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
  const saleKeys = [
    "sale",
    "salePrice",
    "totalSales",
    "revenue",
    "price",
    "totalLm",
    "total",
  ];
  return getFirstNumericByKeys(product, saleKeys);
};

// Look up the current stock level from whichever column the table provides.
const getStockLevel = (product) => {
  const stockKeys = ["stockLevel", "stock", "quantity", "inventory"];
  return getFirstNumericByKeys(product, stockKeys);
};

// Read the configured low-stock threshold across multiple possible column names.
const getLowStockThreshold = (product) => {
  const thresholdKeys = [
    "LowStockthreshold",
    "lowStockThreshold",
    "lowStock",
    "reorderPoint",
    "minStock",
    "threshold",
  ];
  return getFirstNumericByKeys(product, thresholdKeys);
};

export default function HomePage() {
  const [productRecords, setProductRecords] = useState(
    sampleProducts.map((item) => ({ ...item }))
  );
  const handleRowsChange = useCallback((rows) => {
    if (!Array.isArray(rows)) {
      setProductRecords([]);
      return;
    }

    setProductRecords(rows.map((row) => ({ ...row })));
  }, []);

  const { totalProducts, formattedSales, lowStockItems, bestSeller } =
    useMemo(() => {
      const safeRecords = Array.isArray(productRecords) ? productRecords : [];

      const totalProductCount = safeRecords.length;

      const totalSalesValue = safeRecords.reduce((sum, record) => {
        const saleValue = getSaleValue(record);
        return saleValue !== null ? sum + saleValue : sum;
      }, 0);

      const bestSellerRecord = safeRecords.reduce((best, record) => {
        const saleValue = getSaleValue(record);
        if (saleValue === null) return best;

        if (!best || saleValue > best.value) {
          return { label: getProductLabel(record), value: saleValue };
        }

        return best;
      }, null);

      const lowStockCandidates = safeRecords
        .map((record) => {
          const stockLevel = getStockLevel(record);
          const threshold = getLowStockThreshold(record);

          if (stockLevel === null || threshold === null) return null;

          return stockLevel < threshold ? getProductLabel(record) : null;
        })
        .filter(Boolean);

      const uniqueLowStock = Array.from(new Set(lowStockCandidates));

      return {
        totalProducts: totalProductCount,
        formattedSales: formatCurrency(totalSalesValue),
        lowStockItems: uniqueLowStock,
        bestSeller:
          bestSellerRecord?.label ??
          (safeRecords.length > 0 ? getProductLabel(safeRecords[0]) : "N/A"),
      };
    }, [productRecords]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col space-y-8 px-4 py-6 sm:px-6 sm:py-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Dashboard Overview
        </h1>
        <p className="text-sm text-gray-600 sm:text-base">
          Monitor key metrics and manage your carpet inventory.
        </p>
      </header>
      {/* ====== Key Metrics Section ====== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Products */}
        <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-md sm:p-6">
          {/* Icon Left Center */}
          <Package className="flex-shrink-0 text-gray-700" size={40} />
          <div>
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="text-3xl font-bold">{totalProducts}</p>
          </div>
        </div>

        {/* Total Sales */}
        <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-md sm:p-6">
          <DollarSign className="flex-shrink-0 text-gray-700" size={40} />
          <div>
            <p className="text-sm text-gray-500">Total Sales</p>
            <p className="text-3xl font-bold">{formattedSales}</p>
          </div>
        </div>

        {/* Low Stock Section */}
        <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-md sm:p-6">
          <AlertTriangle className="flex-shrink-0" size={40} />
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
        <div className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-md sm:p-6">
          <Star className="flex-shrink-0" size={40} />
          <div>
            <p className="text-lg font-bold text-gray-800">Best Seller</p>
            <p className="text-xl font-semibold text-gray-700">{bestSeller}</p>
          </div>
        </div>
      </div>
      <Table
        fixedColumns={productColumns}
        onRowsChange={handleRowsChange}
        initialData={sampleProducts}
      />
    </div>
  );
}
