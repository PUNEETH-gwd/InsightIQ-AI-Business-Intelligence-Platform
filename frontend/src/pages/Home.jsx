import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-6">
        <h1 className="text-3xl font-bold">📊 InsightIQ</h1>

        <div className="space-x-4">
          <Link
            to="/login"
            className="px-5 py-2 rounded-lg bg-white text-blue-700 font-semibold hover:bg-gray-200 transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-5 py-2 rounded-lg border border-white hover:bg-white hover:text-blue-700 transition"
          >
            Register
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-6 mt-20">
        <h2 className="text-6xl font-extrabold mb-6">
          AI-Powered Business Intelligence
        </h2>

        <p className="text-xl max-w-3xl text-gray-100">
          Upload datasets, clean data, visualize insights, build Machine
          Learning models, and interact with AI — all from one powerful
          platform.
        </p>

        <div className="mt-10 flex gap-5">
          <Link
            to="/register"
            className="bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="border-2 border-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-700 transition"
          >
            Login
          </Link>
        </div>
      </div>

      {/* Features */}
      <section className="mt-28 px-10 pb-20">
        <h3 className="text-4xl font-bold text-center mb-12">
          Why InsightIQ?
        </h3>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-lg">
            <h4 className="text-2xl font-bold mb-4">📁 Smart Dataset Management</h4>
            <p>
              Upload CSV, Excel, and JSON datasets securely with preview,
              download, and management features.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-lg">
            <h4 className="text-2xl font-bold mb-4">🧹 Data Cleaning</h4>
            <p>
              Detect missing values, duplicates, outliers, and clean datasets
              with a single click.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-lg">
            <h4 className="text-2xl font-bold mb-4">🤖 AI & Machine Learning</h4>
            <p>
              Generate insights, build ML models, visualize data, and interact
              with AI using natural language.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 border-t border-white/20">
        <p>
          © 2026 InsightIQ • Built with React, FastAPI, PostgreSQL & Tailwind CSS
        </p>
      </footer>
    </div>
  );
}

export default Home;