import React, { PropsWithChildren } from "react";
import { Link, Outlet } from "react-router-dom";

const NavLink: React.FC<PropsWithChildren<{ to: string }>> = ({
  to,
  children,
}) => (
  <Link to={to} className="text-gray-300 hover:text-white transition-colors">
    {children}
  </Link>
);

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-8">
            <NavLink to="/">Home</NavLink>
          </div>
        </div>
      </nav>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="bg-gray-800 border-t border-gray-700">
        <div className="container mx-auto px-4 py-1 text-center text-gray-400">
          © {new Date().getFullYear()} Tu Aplicación
        </div>
      </footer>
    </div>
  );
};

export default Layout;
