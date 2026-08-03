function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b px-8 py-4 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-blue-600">
          📊 InsightIQ
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-gray-600">
          Welcome 👋
        </span>

        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;