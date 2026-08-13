export default function ReportsTabs({ tabs, activeTab, onChange }) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2 rounded text-sm font-semibold border transition ${
            activeTab === tab.id
              ? 'bg-sky-600 border-sky-600 text-white'
              : 'border-slate-300 text-slate-600 hover:bg-slate-50'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
