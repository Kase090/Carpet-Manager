import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6 bg-gray-100">
        <HomePage />
        {/* Dashboard + Table content will go here */}
      </main>
    </div>
  );
}
