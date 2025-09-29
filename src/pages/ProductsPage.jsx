import Table from "../components/Table";

const productColumns = [
  { key: "productName", label: "Product Name", defaultValue: "New Product" },
  { key: "supplier", label: "Supplier" },
  { key: "id", label: "ID" },
  { key: "type", label: "Type" },
  { key: "colour", label: "Colour" },
  { key: "stockLevel", label: "Stock Level", isNumeric: true },
];

const sampleProducts = [
  {
    productName: "Aurora Twist",
    supplier: "FloorCo",
    id: "AUR-001",
    type: "Twist",
    colour: "Ocean Blue",
    stockLevel: 24,
  },
  {
    productName: "Heritage Loop",
    supplier: "Textile Hub",
    id: "HER-214",
    type: "Loop",
    colour: "Stone Grey",
    stockLevel: 12,
  },
  {
    productName: "Velvet Touch",
    supplier: "CarpetWorks",
    id: "VEL-532",
    type: "Plush",
    colour: "Autumn Red",
    stockLevel: 8,
  },
];

export default function ProductsPage() {
  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <p className="text-gray-600 mt-1">
          Track supplier information, stock levels, and product attributes in
          one place.
        </p>
      </div>

      <Table fixedColumns={productColumns} initialData={sampleProducts} />
    </div>
  );
}
