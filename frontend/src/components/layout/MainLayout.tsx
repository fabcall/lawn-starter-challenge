import { Outlet } from 'react-router';
import { Header } from './Header';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Header />
      <Outlet />
    </div>
  );
}