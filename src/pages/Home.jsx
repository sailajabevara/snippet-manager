export default function Home() {
  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-1/4 bg-white shadow-md p-5 border-r">
        <h2 className="text-2xl font-semibold text-gray-800">Snippets</h2>

        <div data-testid="snippet-list" className="mt-6 text-gray-600">
          No snippets yet
        </div>
      </div>

      {/* Main Section */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
          <input
            type="text"
            placeholder="Search snippets..."
            data-testid="search-input"
            className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            data-testid="theme-toggle-button"
            className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Toggle Theme
          </button>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-6">
          <div
            data-testid="monaco-editor-container"
            className="h-full bg-white rounded-xl shadow-md p-4"
          >
            <p className="text-gray-500">Editor Area</p>
          </div>
        </div>

      </div>

    </div>
  );
}