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
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
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
  } catch {
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
const discountPerformance = {
  withDiscountRevenue: 186000,
  withoutDiscountRevenue: 172000,
  withDiscountUnits: 4120,
  withoutDiscountUnits: 3520,
  averageDiscountRate: 12,
};

const discountImpactTypes = [
  {
    type: "Spring Sale",
    withDiscount: 42000,
    withoutDiscount: 36000,
  },
  {
    type: "Holiday Sale",
    withDiscount: 38000,
    withoutDiscount: 31000,
  },
  {
    type: "Clearance",
    withDiscount: 32000,
    withoutDiscount: 27000,
  },
  {
    type: "Bulk Discount",
    withDiscount: 34000,
    withoutDiscount: 28000,
  },
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
  const revenueLift =
    discountPerformance.withDiscountRevenue -
    discountPerformance.withoutDiscountRevenue;
  const revenueLiftPercent = discountPerformance.withoutDiscountRevenue
    ? (revenueLift / discountPerformance.withoutDiscountRevenue) * 100
    : 0;

  const unitsLift =
    discountPerformance.withDiscountUnits -
    discountPerformance.withoutDiscountUnits;
  const unitsLiftPercent = discountPerformance.withoutDiscountUnits
    ? (unitsLift / discountPerformance.withoutDiscountUnits) * 100
    : 0;

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
  const DiscountTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) {
      return null;
    }

    const sortedPayload = [...payload].sort(
      (a, b) => (b.value ?? 0) - (a.value ?? 0)
    );

    return (
      <div className="rounded-xl border border-emerald-100 bg-white/95 px-3 py-2 shadow-sm">
        <p className="text-xs font-medium text-emerald-600">{label}</p>
        <ul className="mt-1 space-y-1 text-xs">
          {sortedPayload.map((entry) => (
            <li
              key={entry.name}
              className="flex items-center justify-between gap-6"
            >
              <span className="font-medium text-gray-600">{entry.name}</span>
              <span className="font-semibold text-emerald-900">
                {formatCurrency(entry.value)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col space-y-8 px-4 py-6 sm:px-6 sm:py-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Analytics
        </h1>
        <p className="text-sm text-gray-600 sm:text-base">
          Monitor monthly sales performance and identify the products and
          categories that drive the most revenue.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
        <div className="space-y-3 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
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

        <div className="space-y-3 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
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

        <div className="space-y-3 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
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
        <div className="space-y-6 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-gray-900">
              Sales Performance Over Time
            </h2>
            <p className="text-sm text-gray-500">Track monthly sales results</p>
          </div>

          <div className="space-y-6">
            <div className="h-60 sm:h-72">
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

            <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl bg-emerald-50 p-4">
                <p className="text-xs uppercase tracking-wide text-emerald-600">
                  Average Monthly Sales
                </p>
                <p className="mt-1 text-lg font-semibold text-emerald-900">
                  {formatCurrency(averageMonthlySales)}
                </p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-4">
                <p className="text-xs uppercase tracking-wide text-emerald-600">
                  Peak Season
                </p>
                <p className="mt-1 text-lg font-semibold text-emerald-900">
                  {busiestMonth.month} · {formatCurrency(busiestMonth.sales)}
                </p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-4">
                <p className="text-xs uppercase tracking-wide text-emerald-600">
                  Slow Season
                </p>
                <p className="mt-1 text-lg font-semibold text-emerald-900">
                  {quietestMonth.month} · {formatCurrency(quietestMonth.sales)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 text-sm text-gray-600 sm:grid-cols-2">
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
          <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
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

          <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
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
      <section className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-gray-900">
              Discount Impact
            </h2>
            <p className="text-sm text-gray-500">
              Compare how promotional pricing influences revenue and unit
              volume.
            </p>
          </div>
          <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-xs font-medium text-emerald-700">
            Static insight from recent discount types
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
            <p className="text-xs uppercase tracking-wide text-emerald-600">
              Revenue Increase with discount
            </p>
            <p className="mt-1 text-2xl font-semibold text-emerald-900">
              {formatCurrency(revenueLift)}
            </p>
            <p className="text-xs text-emerald-700">
              {revenueLift >= 0 ? "+" : ""}
              {revenueLiftPercent.toFixed(1)}% vs. no discount
            </p>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-emerald-600">
              Units Increase
            </p>
            <p className="mt-1 text-2xl font-semibold text-emerald-900">
              {formatNumber(unitsLift)}
            </p>
            <p className="text-xs text-emerald-700">
              {unitsLift >= 0 ? "+" : ""}
              {unitsLiftPercent.toFixed(1)}% vs. no discount
            </p>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-emerald-600">
              Avg. Discount Applied
            </p>
            <p className="mt-1 text-2xl font-semibold text-emerald-900">
              {discountPerformance.averageDiscountRate}%
            </p>
            <p className="text-xs text-gray-500">
              {formatNumber(discountPerformance.withDiscountUnits)} units sold
              with discounts
            </p>
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={discountImpactTypes}
              barGap={12}
              margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="type"
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
                content={<DiscountTooltip />}
                cursor={{ fill: "#ECFDF5" }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ fontSize: 12, color: "#4B5563" }}
              />
              <Bar
                dataKey="withoutDiscount"
                name="Without Discount"
                fill="#A7F3D0"
                radius={[6, 6, 0, 0]}
                maxBarSize={36}
              />
              <Bar
                dataKey="withDiscount"
                name="With Discount"
                fill="#10B981"
                radius={[6, 6, 0, 0]}
                maxBarSize={36}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">
            <p className="font-semibold">Key insight</p>
            <p className="mt-2 text-emerald-800">
              Discounts generated{" "}
              {formatCurrency(discountPerformance.withDiscountRevenue)} in
              revenue versus{" "}
              {formatCurrency(discountPerformance.withoutDiscountRevenue)}{" "}
              without promotions, adding {formatCurrency(revenueLift)} in
              incremental sales and {formatNumber(unitsLift)} more units sold.
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 p-4 text-sm text-gray-600">
            <p className="font-semibold text-gray-800">Next steps</p>
            <ul className="mt-2 space-y-2 list-disc pl-4">
              <li>
                Focus future discount types on offers near{" "}
                {discountPerformance.averageDiscountRate}% where revenue lift
                remains positive.
              </li>
              <li>
                Monitor discount discount types with smaller lifts may need
                refreshed messaging or bundling to stay effective.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
