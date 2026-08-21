export default function SegmentedControl({ options, value, onChange, className = '' }) {
  return (
    <div
      className={`grid gap-2 ${className}`}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((option) => {
        const Icon = option.icon;
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={[
              'flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition',
              active ? option.activeClass : option.idleClass,
            ].join(' ')}
          >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}