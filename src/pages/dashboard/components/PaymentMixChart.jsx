import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Wallet } from 'lucide-react';

const COLORS = ['#10b981', '#0284c7', '#f59e0b'];

export default function PaymentMixChart({ data, currency }) {
  const total = (data || []).reduce((sum, row) => sum + Number(row.value ?? 0), 0);
  const percentage = (value) =>
    total > 0 ? `${Math.round((Number(value) / total) * 100)}%` : '0%';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 bg-sky-50 text-sky-600 rounded flex items-center justify-center">
          <Wallet className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Payment Mix</h2>
          <p className="text-xs text-slate-500">Last 7 days</p>
        </div>
      </div>

      {total === 0 ? (
        <p className="py-12 text-center text-sm text-slate-400">No payments recorded yet.</p>
      ) : (
        <div className="flex flex-col items-center">
          <div className="h-44 w-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={56}
                  outerRadius={82}
                  paddingAngle={3}
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    borderColor: '#e2e8f0',
                    fontSize: 12,
                    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
                  }}
                  formatter={(value, name) => [
                    `${currency} ${Number(value).toFixed(2)} · ${percentage(value)}`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <ul className="mt-4 w-full space-y-2">
            {data.map((row, index) => (
              <li key={row.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-600">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  {row.name}
                </span>
                <span className="font-semibold text-slate-900">
                  {currency} {Number(row.value).toFixed(2)}
                  <span className="ml-2 text-xs font-medium text-slate-400">
                    {percentage(row.value)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}