import { PropsWithChildren } from "react";
import { Link, Outlet } from "react-router-dom";
import { HomeIcon } from "@heroicons/react/24/outline";
import ThemeToggle from "./ThemeToggle";

type NavLinkProps = PropsWithChildren<{
  to: string;
}>;

const NavLink = ({ to, children }: NavLinkProps) => (
  <Link
    to={to}
    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
  >
    {children}
  </Link>
);

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <nav className="bg-gray-100 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <NavLink to="/">
              <HomeIcon className="h-5 w-5" />
              <span>Home</span>
            </NavLink>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="bg-gray-100 border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="container mx-auto px-4 py-1 text-center text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Monitor
        </div>
      </footer>
    </div>
  );
};

export default Layout;
