import SidebarContent from './SidebarContent';

export default function DesktopSidebar() {
  return (
    <aside className="hidden md:flex w-60 shrink-0 bg-sky-900 text-white flex-col">
      <SidebarContent />
    </aside>
  );
}
