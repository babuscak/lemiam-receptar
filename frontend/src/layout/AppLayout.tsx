import { useRef } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

const navItems = [
  { to: '/', label: 'Dashboard', icon: 'pi pi-home' },
  { to: '/items', label: 'Items', icon: 'pi pi-box' },
  { to: '/recipes', label: 'Recipes', icon: 'pi pi-book' },
  { to: '/qualifications', label: 'Qualifications', icon: 'pi pi-users' },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const toast = useRef<Toast>(null);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Toast ref={toast} />
      <aside className="w-52 bg-white border-r flex flex-col">
        <div className="px-4 py-3 border-b">
          <h1 className="text-base font-semibold text-gray-800">Receptar</h1>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded text-sm ${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`
              }>
              <i className={`${item.icon} text-sm`}></i>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-3 border-t">
          <p className="text-xs text-gray-400 truncate mb-2">{user?.email}</p>
          <Button label="Logout" icon="pi pi-sign-out" severity="secondary" text size="small" onClick={logout} />
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <Outlet context={{ toast }} />
        </div>
      </main>
    </div>
  );
}
