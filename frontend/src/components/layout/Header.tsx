
import { Link } from 'react-router';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <Link to="/">
          <h1 className="text-3xl font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
            SWStarter
          </h1>
        </Link>
      </div>
    </header>
  );
}