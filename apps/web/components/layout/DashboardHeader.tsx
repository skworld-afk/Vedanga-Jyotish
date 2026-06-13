export default function DashboardHeader() {
  return (
    <header className="bg-white border-b h-16 flex items-center justify-between px-6 shadow-sm">
      <div className="font-medium text-gray-700">
        {/* Later, we'll fetch the person's name and details to show here */}
        Profile: <span className="font-bold text-gray-900">John Doe</span>
      </div>
      <div>
        <button className="text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md transition">
          Settings
        </button>
      </div>
    </header>
  );
}
