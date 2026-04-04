
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
  const [gistUrl, setGistUrl] = useState("");

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
  const filteredSnippets = snippets.filter((s) => {
  const term = searchTerm.toLowerCase();

  return (
    s.title.toLowerCase().includes(term) ||
    s.tags.some((tag) => tag.toLowerCase().includes(term))
  );
});
  // COPY
  const handleCopy = async () => {
    if (!selectedSnippet) {
      alert("Select snippet first");
      return;
    }

    await navigator.clipboard.writeText(selectedSnippet.content || "");
    alert("Copied!");
  };

   const exportToGist = async () => {
  if (!selectedSnippet) {
    alert("Select snippet first");
    return;
  }

  try {
    const token = import.meta.env.VITE_GITHUB_TOKEN;

    if (!token) {
      alert("Token missing (.env check)");
      return;
    }

    const response = await fetch("https://api.github.com/gists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, //  FINAL FIX
      },
      body: JSON.stringify({
        description: selectedSnippet.title || "Snippet",
        public: true,
        files: {
          [`${selectedSnippet.title || "snippet"}.js`]: {
            content: selectedSnippet.content || "",
          },
        },
      }),
    });

    const data = await response.json();

    console.log("GIST RESPONSE:", data);

    if (data.html_url) {
      alert("Gist created: " + data.html_url);
    } else {
      alert("Error creating gist");
    }
  } catch (error) {
    console.error(error);
    alert("Error creating gist");
  }
};
const importGist = async () => {
  try {
    if (!gistUrl) {
      alert("Paste Gist URL");
      return;
    }

    //  extract gist id (strong fix)
    const parts = gistUrl.split("/");
    const gistId = parts[parts.length - 1];

    if (!gistId) {
      alert("Invalid Gist URL");
      return;
    }

    const res = await fetch(`https://api.github.com/gists/${gistId}`);
    const data = await res.json();

    console.log("IMPORT RESPONSE:", data); // debug

    if (!data.files) {
      alert("Invalid Gist Data");
      return;
    }

    const file = Object.values(data.files)[0];

    const newSnippet = {
      id: uuidv4(),
      title: file.filename || "Imported Snippet",
      language: "javascript",
      tags: [],
      content: file.content || "",
    };

    const updated = [...snippets, newSnippet];
    setSnippets(updated);
    localStorage.setItem("code_snippets_data", JSON.stringify(updated));

    alert("Imported successfully!");
  } catch (err) {
    console.error(err);
    alert("Error importing gist");
  }
};

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-1/4 bg-white p-5 border-r">
        <h2 className="text-xl font-semibold mb-4">Snippets</h2>

        {filteredSnippets.map((s) => (
          <div
            key={s.id}
            className="p-2 border mb-2 cursor-pointer"
            onClick={() => setSelectedSnippet(s)}
          >
            {s.title}
            <br />
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteSnippet(s.id);
              }}
              className="text-red-500 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <div className="p-4 bg-white flex gap-3">
          <input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 w-full"
          />

          <button
            onClick={() =>
              setTheme(theme === "light" ? "dark" : "light")
            }
            className="bg-blue-500 text-white px-3"
          >
            Toggle Theme
          </button>
        </div>

        {/* Form */}
        <div className="p-4 bg-white flex gap-2">
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2"
          />
          <input
            placeholder="Language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border p-2"
          />
          <input
            placeholder="Tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="border p-2"
          />

          <button
            onClick={createSnippet}
            className="bg-green-500 text-white px-3"
          >
            Save
          </button>

          <input
            placeholder="Paste Gist URL"
            value={gistUrl}
            onChange={(e) => setGistUrl(e.target.value)}
            className="border p-2"
          />

          <button
            onClick={importGist}
            className="bg-purple-500 text-white px-3"
          >
            Import Gist
          </button>
        </div>

        {/* Editor */}
        <div className="flex-1 p-4 bg-white flex flex-col">

          <div className="flex gap-2 mb-2">
            <button
              onClick={handleCopy}
              className="bg-green-500 text-white px-3"
            >
              Copy Code
            </button>

            <button
              onClick={exportToGist}
              className="bg-purple-500 text-white px-3"
            >
              Export Gist
            </button>
          </div>

          <div className="flex-1 border">
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