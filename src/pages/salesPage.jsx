import Table from "../components/Table";
import { salesColumns, salesData } from "../data/sales";

export default function SalesPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Sales Records
        </h1>
        <p className="text-sm text-gray-600 sm:text-base">
          Track recent transactions and analyse revenue performance.
        </p>
      </header>
      <Table fixedColumns={salesColumns} initialData={salesData} />
    </div>
  );
}
