

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Editor from "@monaco-editor/react";

export default function Home() {
  const [snippets, setSnippets] = useState([]);
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [selectedSnippet, setSelectedSnippet] = useState(null);

  
 const [theme, setTheme] = useState(() => {
  return localStorage.getItem("editor_theme") || "light";
});

  // LOAD snippets
useEffect(() => {
  const saved = localStorage.getItem("code_snippets_data");
  if (saved) {
    setSnippets(JSON.parse(saved));
  }
}, []);

//  ADD THIS (theme save)
useEffect(() => {
  localStorage.setItem("editor_theme", theme);
}, [theme]);

  // CREATE
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

  // DELETE
  const deleteSnippet = (id) => {
    const updated = snippets.filter((s) => s.id !== id);

    setSnippets(updated);
    localStorage.setItem("code_snippets_data", JSON.stringify(updated));

    if (selectedSnippet?.id === id) {
      setSelectedSnippet(null);
    }
  };

  // UPDATE CONTENT (EDITOR CHANGE)
  const handleEditorChange = (value) => {
    if (!selectedSnippet) return;

    const updated = snippets.map((s) =>
      s.id === selectedSnippet.id ? { ...s, content: value } : s
    );

    setSnippets(updated);
    localStorage.setItem("code_snippets_data", JSON.stringify(updated));

    setSelectedSnippet({
      ...selectedSnippet,
      content: value,
    });
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
              <div
                key={snippet.id}
                className="mb-3 p-2 border rounded cursor-pointer hover:bg-gray-100"
                onClick={() => setSelectedSnippet(snippet)}
              >
                <p className="font-medium">{snippet.title}</p>

                <p className="text-xs text-gray-500">
                  {snippet.content?.slice(0, 30)}
                </p>

                <button
                  data-testid="delete-snippet-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSnippet(snippet.id);
                  }}
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

          {/* FIXED: Theme toggle */}
          <button
            data-testid="theme-toggle-button"
            onClick={() =>
              setTheme(theme === "light" ? "dark" : "light")
            }
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

        {/* Monaco Editor */}
        <div className="flex-1 p-6">
          <div
            data-testid="monaco-editor-container"
            className="h-full bg-white rounded shadow"
          >
            <Editor
              height="100%"
              language={selectedSnippet?.language || "javascript"}
              value={selectedSnippet?.content || ""}
              theme={theme === "light" ? "vs-light" : "vs-dark"} // ✅ THEME FIX
              onChange={handleEditorChange}
            />
          </div>
        </div>

      </div>
    </div>
  );
}