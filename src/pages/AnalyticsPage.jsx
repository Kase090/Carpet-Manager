import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CalendarRange,
  Package,
  Trophy,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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

const formatNumber = (value) => {
  if (!Number.isFinite(value)) return "0";
  return value.toLocaleString();
};

const monthlySales = [
  { month: "Jan", sales: 32000 },
  { month: "Feb", sales: 36000 },
  { month: "Mar", sales: 45500 },
  { month: "Apr", sales: 51000 },
  { month: "May", sales: 47000 },
  { month: "Jun", sales: 43000 },
  { month: "Jul", sales: 39000 },
  { month: "Aug", sales: 42000 },
  { month: "Sep", sales: 46000 },
  { month: "Oct", sales: 54000 },
  { month: "Nov", sales: 58000 },
  { month: "Dec", sales: 61000 },
];

const topProducts = [
  {
    name: "Carpet X",
    category: "Category X",
    unitsSold: 9999,
    totalSales: 999999,
  },
  {
    name: "Carpet X",
    category: "Category X",
    unitsSold: 9999,
    totalSales: 9999,
  },
  {
    name: "Carpet X",
    category: "Category X",
    unitsSold: 9999,
    totalSales: 99999,
  },
  {
    name: "Carpet X",
    category: "Category X",
    unitsSold: 9999,
    totalSales: 99999,
  },
  {
    name: "Carpet X",
    category: "Category X",
    unitsSold: 9999,
    totalSales: 99999,
  },
];

const topCategories = [
  { name: "Carpet X", share: 99, totalSales: 284000 },
  { name: "Carpet X", share: 99, totalSales: 231000 },
  { name: "Carpet X", share: 99, totalSales: 189000 },
  { name: "Carpet Xl", share: 99, totalSales: 176500 },
  { name: "Carpet X", share: 99, totalSales: 168000 },
];

export default function AnalyticsPage() {
  const totalSalesYtd = monthlySales.reduce(
    (sum, entry) => sum + entry.sales,
    0
  );
  const averageMonthlySales = Math.round(totalSalesYtd / monthlySales.length);

  const busiestMonth = monthlySales.reduce((best, entry) =>
    entry.sales > best.sales ? entry : best
  );

  const quietestMonth = monthlySales.reduce((worst, entry) =>
    entry.sales < worst.sales ? entry : worst
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) {
      return null;
    }

    return (
      <div className="rounded-xl border border-emerald-100 bg-white/95 px-3 py-2 shadow-sm">
        <p className="text-xs font-medium text-emerald-600">{label}</p>
        <p className="text-sm font-semibold text-emerald-900">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">
          Monitor monthly sales performance and identify the products and
          categories that drive the most revenue.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <BarChart3 size={18} /> Year-to-Date Sales
            </span>
            <ArrowUpRight className="text-emerald-500" size={18} />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency(totalSalesYtd)}
          </p>
          <p className="text-sm text-gray-500">Across the past 12 months</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <CalendarRange size={18} /> Busiest Month
            </span>
            <Trophy className="text-amber-500" size={18} />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {busiestMonth.month}
          </p>
          <p className="text-sm text-gray-500">
            {formatCurrency(busiestMonth.sales)} in sales
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Package size={18} /> Quietest Month
            </span>
            <ArrowDownRight className="text-rose-500" size={18} />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {quietestMonth.month}
          </p>
          <p className="text-sm text-gray-500">
            {formatCurrency(quietestMonth.sales)} in sales
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-gray-900">
              Sales Performance Over Time
            </h2>
            <p className="text-sm text-gray-500">Track monthly sales results</p>
          </div>

          <div className="space-y-6">
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlySales}>
                  <defs>
                    <linearGradient
                      id="salesGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#10B981"
                        stopOpacity={0.35}
                      />
                      <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={{ stroke: "#E5E7EB" }}
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                  />
                  <YAxis
                    tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
                    tickLine={false}
                    axisLine={{ stroke: "#E5E7EB" }}
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ stroke: "#10B981", strokeDasharray: "4 4" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#059669"
                    strokeWidth={2.5}
                    fill="url(#salesGradient)"
                    activeDot={{ r: 5, fill: "#047857" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="bg-emerald-50 rounded-xl p-4">
                <p className="text-xs uppercase tracking-wide text-emerald-600">
                  Average Monthly Sales
                </p>
                <p className="mt-1 text-lg font-semibold text-emerald-900">
                  {formatCurrency(averageMonthlySales)}
                </p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4">
                <p className="text-xs uppercase tracking-wide text-emerald-600">
                  Peak Season
                </p>
                <p className="mt-1 text-lg font-semibold text-emerald-900">
                  {busiestMonth.month} · {formatCurrency(busiestMonth.sales)}
                </p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4">
                <p className="text-xs uppercase tracking-wide text-emerald-600">
                  Slow Season
                </p>
                <p className="mt-1 text-lg font-semibold text-emerald-900">
                  {quietestMonth.month} · {formatCurrency(quietestMonth.sales)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
              {monthlySales.map((entry) => (
                <div
                  key={entry.month}
                  className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-2"
                >
                  <span className="font-medium text-gray-700">
                    {entry.month}
                  </span>
                  <span>{formatCurrency(entry.sales)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Top Products
              </h2>
              <span className="text-sm text-gray-500">
                Ranked by total sales revenue
              </span>
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-100">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Rank
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Category
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Units Sold
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Total Sales
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {topProducts.map((product, index) => (
                    <tr key={product.name} className="hover:bg-emerald-50/40">
                      <td className="px-4 py-3 text-sm font-semibold text-gray-700">
                        #{index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {product.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {product.category}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-600">
                        {formatNumber(product.unitsSold)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900 font-medium">
                        {formatCurrency(product.totalSales)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Top Categories
              </h2>
              <span className="text-sm text-gray-500">
                Share of total revenue
              </span>
            </div>
            <ul className="space-y-3">
              {topCategories.map((category) => (
                <li
                  key={category.name}
                  className="flex items-center justify-between gap-4 border border-gray-100 rounded-xl px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {category.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(category.totalSales)} total sales
                    </p>
                  </div>
                  <span className="text-sm font-medium text-emerald-600">
                    {(category.share * 100).toFixed(0)}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
