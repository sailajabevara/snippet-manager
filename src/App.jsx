import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ViewSnippet from "./pages/ViewSnippet";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/snippets/view/:id" element={<ViewSnippet />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;