import Table from "../components/Table"; // import table

// define columns
const productColumns = [
  { key: "productName", label: "Product Name", defaultValue: "New Product" },
  { key: "supplier", label: "Supplier" },
  { key: "id", label: "ID" },
  { key: "type", label: "Type" },
  { key: "colour", label: "Colour" },
  { key: "stockLevel", label: "Stock Level /lm", isNumeric: true },
  {
    key: "LowStockthreshold",
    label: "Low Stock Threshold /lm",
    isNumeric: true,
  },
];
/// temp data
const sampleProducts = [
  {
    productName: "Carpet 1",
    supplier: "Supplier 1",
    id: "012301",
    type: "Type 1",
    colour: "Blue",
    stockLevel: 99,
    LowStockthreshold: 10,
  },
  {
    productName: "Carpet 2",
    supplier: "Supplier 2",
    id: "211234",
    type: "Type 2",
    colour: "Grey",
    stockLevel: 99,
    LowStockthreshold: 10,
  },
  {
    productName: "Carpet 3",
    supplier: "Supplier 3",
    id: "565332",
    type: "Type 3",
    colour: "Red",
    stockLevel: 99,
    LowStockthreshold: 10,
  },
];

export default function ProductsPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Product Catalogue
        </h1>
        <p className="text-sm text-gray-600 sm:text-base">
          Review product details, suppliers, and inventory thresholds.
        </p>
      </header>
      <Table fixedColumns={productColumns} initialData={sampleProducts} />
    </div>
  );
}
