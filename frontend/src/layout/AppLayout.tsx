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
      <aside className="w-56 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-lg font-bold text-blue-600">Receptar</h1>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded text-sm ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'}`
              }>
              <i className={item.icon}></i>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t">
          <p className="text-xs text-gray-500 truncate mb-2">{user?.email}</p>
          <Button label="Logout" icon="pi pi-sign-out" severity="danger" text size="small" onClick={logout} />
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
