import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [snippets, setSnippets] = useState([]);
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");

  //  LOAD from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("code_snippets_data");
    if (saved) {
      setSnippets(JSON.parse(saved));
    }
  }, []);



  //  CREATE
  const createSnippet = () => {
    if (!title) return;

    const newSnippet = {
      id: uuidv4(),
      title,
      language,
      tags: tags.split(","),
      content,
    };

    const updated = [...snippets, newSnippet];

    setSnippets(updated);
    localStorage.setItem("code_snippets_data", JSON.stringify(updated));

    setTitle("");
    setLanguage("");
    setTags("");
    setContent("");
  };

  //  DELETE
  const deleteSnippet = (id) => {
    const updated = snippets.filter((s) => s.id !== id);

    setSnippets(updated);
    localStorage.setItem("code_snippets_data", JSON.stringify(updated));
  };

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-1/4 bg-white shadow-md p-5 border-r">
        <h2 className="text-2xl font-semibold text-gray-800">Snippets</h2>

        <div data-testid="snippet-list" className="mt-6 text-gray-600">
          {snippets.length === 0 ? (
            <p>No snippets yet</p>
          ) : (
            snippets.map((snippet) => (
              <div key={snippet.id} className="mb-3 p-2 border rounded">
                <p className="font-medium">{snippet.title}</p>

                <button
                  data-testid="delete-snippet-button"
                  onClick={() => deleteSnippet(snippet.id)}
                  className="text-red-500 text-sm"
                >
                  Delete
                </button>
              </div>
            ))
          )}
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
            className="w-1/2 px-4 py-2 border rounded-lg"
          />

          <button
            data-testid="theme-toggle-button"
            className="bg-blue-500 text-white px-5 py-2 rounded-lg"
          >
            Toggle Theme
          </button>
        </div>

        {/* Form */}
        <div className="p-6 bg-white">
          <input
            data-testid="snippet-title-input"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 mr-2"
          />

          <input
            data-testid="snippet-language-input"
            placeholder="Language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border p-2 mr-2"
          />

          <input
            data-testid="snippet-tags-input"
            placeholder="Tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="border p-2 mr-2"
          />

          <button
            data-testid="save-snippet-button"
            onClick={createSnippet}
            className="bg-green-500 text-white px-4 py-2"
          >
            Save
          </button>
        </div>

        {/* Editor */}
        <div className="flex-1 p-6">
          <div
            data-testid="monaco-editor-container"
            className="bg-white p-4 rounded shadow"
          >
            Editor Area
          </div>
        </div>

      </div>
    </div>
  );
}