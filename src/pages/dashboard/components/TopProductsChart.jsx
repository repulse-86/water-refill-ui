import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { Package } from 'lucide-react';

const COLORS = ['#0284c7', '#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd'];

export default function TopProductsChart({ data, currency }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 bg-sky-50 text-sky-600 rounded flex items-center justify-center">
          <Package className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Top Products by Revenue</h2>
          <p className="text-xs text-slate-500">Completed orders</p>
        </div>
      </div>

      {data.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-400">No product sales recorded yet.</p>
      ) : (
        <div className="h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 16, left: 4, bottom: 0 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={104}
                tick={{ fontSize: 12, fill: '#475569' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{
                  borderRadius: 12,
                  borderColor: '#e2e8f0',
                  fontSize: 12,
                  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
                }}
                formatter={(value, name) => {
                  if (name === 'Revenue') return [`${currency} ${Number(value).toFixed(2)}`, name];
                  return [`${value} units`, name];
                }}
              />
              <Bar dataKey="revenue" name="Revenue" radius={[0, 6, 6, 0]} barSize={18}>
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}