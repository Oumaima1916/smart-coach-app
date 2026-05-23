import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

// wraps every authenticated or public page with the shared chrome
export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
