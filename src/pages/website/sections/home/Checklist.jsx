import { CheckCircle } from 'lucide-react';

const items = [
  'Verify UV Sterilizer Lamp Operation',
  'Record Opening Product Water TDS',
  'Inspect Washing & Sanitizing Station',
  'Check Empty Container Physical Inventory',
];

export default function Checklist() {
  return (
    <section className="pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-blue-950 text-white rounded p-6 sm:p-8">
        <div className="max-w-3xl">
          <h3 className="text-xl font-bold text-white mb-3">Daily Station Checklist</h3>
          <p className="text-sm text-blue-200 mb-6">
            All assigned store personnel must complete mandatory safety and system verifications before starting refilling lines.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-blue-100">
            {items.map((item) => (
              <div
                key={item}
                className="flex items-center space-x-2 bg-blue-900/50 p-3 rounded border border-blue-800"
              >
                <CheckCircle className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
