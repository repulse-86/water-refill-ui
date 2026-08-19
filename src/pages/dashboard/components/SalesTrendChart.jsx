import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import dayjs from '../../../utils/date';

function formatAxisTick(value) {
  return dayjs(value).format('M/D');
}

export default function SalesTrendChart({ data, currency }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 bg-sky-50 text-sky-600 rounded flex items-center justify-center">
          <TrendingUp className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Sales & Throughput Trend</h2>
          <p className="text-xs text-slate-500">Last 7 days</p>
        </div>
      </div>

      {data.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-400">No sales data in the last 7 days.</p>
      ) : (
        <div className="h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={formatAxisTick}
                tick={{ fontSize: 12, fill: '#64748b' }}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#64748b' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  borderColor: '#e2e8f0',
                  fontSize: 12,
                  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
                }}
                labelFormatter={(value) => dayjs(value).format('ddd, MMM D')}
                formatter={(value, name) => {
                  if (name === 'Revenue') return [`${currency} ${Number(value).toFixed(2)}`, name];
                  return [`${Number(value).toFixed(1)} gal`, name];
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#0284c7"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
              <Area
                type="monotone"
                dataKey="gallons"
                name="Gallons"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5 4"
                fill="transparent"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}