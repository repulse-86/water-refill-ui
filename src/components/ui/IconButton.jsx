export default function IconButton({ icon: Icon, onClick, title, variant = 'default', className = '' }) {
  const variants = {
    default: 'text-slate-500 hover:bg-slate-50',
    edit: 'text-slate-500 hover:text-sky-600 hover:bg-sky-50',
    danger: 'text-slate-500 hover:text-red-600 hover:bg-red-50',
  };

  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded transition-colors ${variants[variant]} ${className}`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}