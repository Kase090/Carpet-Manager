import Table from "../components/Table";

const salesColumns = [
  { key: "saleId", label: "Sale ID" },
  { key: "productId", label: "Product ID" },
  { key: "productName", label: "Product Name" },
  { key: "date", label: "Date" },
  {
    key: "quantitySold",
    label: "Qty Sold /lm",
    isNumeric: true,
    defaultValue: 0,
  },
  {
    key: "priceLm",
    label: "Price /lm",

    isNumeric: true,
    defaultValue: 0,
  },
  {
    key: "totalLm",
    label: "Total $",

    isNumeric: true,
    defaultValue: 0,
  },
  {
    key: "discount",
    label: "Discount",
    defaultValue: "0%",
  },
];

const salesData = [
  {
    saleId: "S-1001",
    productId: "P-211234",
    productName: "Carpet 1",
    date: "2024-07-01",
    quantitySold: 120,
    priceLm: 45.0,
    totalLm: 5400,
    discount: "5%",
  },
  {
    saleId: "S-1002",
    productId: "P-211234",
    productName: "Carpet 2",
    date: "2024-07-03",
    quantitySold: 75,
    priceLm: 32.5,
    totalLm: 2437.5,
    discount: "0%",
  },
  {
    saleId: "S-1003",
    productId: "P-211234",
    productName: "Carpet 3",
    date: "2024-07-05",
    quantitySold: 200,
    priceLm: 18.75,
    totalLm: 3750,
    discount: "10%",
  },
];

export default function SalesPage() {
  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <Table fixedColumns={salesColumns} initialData={salesData} />
    </div>
  );
}
