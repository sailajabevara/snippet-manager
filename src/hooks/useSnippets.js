import { useState, useEffect } from "react";

export default function useSnippets() {
  const [snippets, setSnippets] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("code_snippets_data");
    if (saved) {
      setSnippets(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("code_snippets_data", JSON.stringify(snippets));
  }, [snippets]);

  const addSnippet = (snippet) => {
    setSnippets((prev) => [...prev, snippet]);
  };

  const deleteSnippet = (id) => {
    setSnippets((prev) => prev.filter((s) => s.id !== id));
  };

  return { snippets, addSnippet, deleteSnippet };
}