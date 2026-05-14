

import { useRouter } from 'next/navigation';

const Header = ({ userName }: { userName?: string }) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token'); // টোকেন রিমুভ করা
    router.push('/login');
  };

  return (
    <header className="bg-gray-900 text-white p-4 shadow-lg border-b border-gray-800 flex justify-between items-center">
      {/* Left Side: User Icon and Name */}
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold">
          {userName ? userName[0].toUpperCase() : 'U'}
        </div>
        <span className="text-lg font-medium">{userName || "Guest"}</span>
      </div>

      {/* Middle: Brand Name */}
      <div className="text-xl font-bold tracking-widest text-indigo-400">
        HOTEL ROYAL
      </div>

      {/* Right Side: Logout Button */}
      <button 
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-md transition duration-300 font-semibold"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;