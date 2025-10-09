import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { WorldListPage } from "./pages/WorldListPage";
import { DocumentListPage } from "./pages/DocumentListPage";
import { DocumentDetailPage } from "./pages/DocumentDetailPage";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WorldListPage />} />
          <Route path="/world/:worldId" element={<DocumentListPage />} />
          <Route path="/world/:worldId/:category/:docId" element={<DocumentDetailPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
