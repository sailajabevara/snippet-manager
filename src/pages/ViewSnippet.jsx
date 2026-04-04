
// export default function ViewSnippet() {
//   return <div>View Snippet</div>;
// }


import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";

export default function ViewSnippet() {
  const { id } = useParams();

  const data = JSON.parse(localStorage.getItem("code_snippets_data")) || [];

  const snippet = data.find((s) => s.id === id);

  if (!snippet) {
    return <h2>Snippet Not Found</h2>;
  }

  return (
    <div className="h-screen p-4">
      <h2 className="text-xl mb-2">{snippet.title}</h2>

      <div className="h-[90%] border">
        <Editor
          height="100%"
          language={snippet.language || "javascript"}
          value={snippet.content}
          theme="vs-dark"
          options={{ readOnly: true }}
        />
      </div>
    </div>
  );
}