
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Editor from "@monaco-editor/react";

export default function Home() {
  const [snippets, setSnippets] = useState([]);
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [tags, setTags] = useState("");
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("editor_theme") || "light";
  });

  // LOAD
  useEffect(() => {
    const saved = localStorage.getItem("code_snippets_data");
    if (saved) {
      setSnippets(JSON.parse(saved));
    }
  }, []);

  // SAVE THEME
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
      content: "",
    };

    const updated = [...snippets, newSnippet];
    setSnippets(updated);
    localStorage.setItem("code_snippets_data", JSON.stringify(updated));

    setTitle("");
    setLanguage("");
    setTags("");
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

  // UPDATE EDITOR
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

  // SEARCH
  const filteredSnippets = snippets.filter((s) =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // COPY
  const handleCopy = () => {
    if (!selectedSnippet) {
      alert("Select snippet first");
      return;
    }

    navigator.clipboard.writeText(selectedSnippet.content || "");
    alert("Copied!");
  };

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-1/4 bg-white p-5 border-r shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Snippets</h2>

        <div className="space-y-2">
          {filteredSnippets.length === 0 ? (
            <p className="text-gray-500">No snippets</p>
          ) : (
            filteredSnippets.map((s) => (
              <div
                key={s.id}
                className="p-3 border rounded cursor-pointer hover:bg-gray-100 transition"
                onClick={() => setSelectedSnippet(s)}
              >
                <p className="font-medium">{s.title}</p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSnippet(s.id);
                  }}
                  className="text-red-500 text-sm mt-1"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <div className="flex items-center gap-4 p-4 bg-white shadow-sm">
          <input
            placeholder="Search snippets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 w-full max-w-xl rounded-lg"
          />

          <button
            onClick={() =>
              setTheme(theme === "light" ? "dark" : "light")
            }
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Toggle Theme
          </button>
        </div>

        {/* Form */}
        <div className="p-4 bg-white shadow-sm flex gap-3 flex-wrap">
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded w-full max-w-xs"
          />

          <input
            placeholder="Language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border p-2 rounded w-full max-w-xs"
          />

          <input
            placeholder="Tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="border p-2 rounded w-full max-w-xs"
          />

          <button
            onClick={createSnippet}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>

        {/* Editor */}
        <div className="flex-1 p-4 bg-white flex flex-col">

          <button
            onClick={handleCopy}
            className="bg-green-500 text-white px-4 py-2 mb-2 w-fit rounded"
          >
            Copy Code
          </button>

          <div className="flex-1 border rounded overflow-hidden">
            <Editor
              height="100%"
              language={selectedSnippet?.language || "javascript"}
              value={selectedSnippet?.content || ""}
              theme={theme === "light" ? "vs-light" : "vs-dark"}
              onChange={handleEditorChange}
            />
          </div>

        </div>

      </div>
    </div>
  );
}