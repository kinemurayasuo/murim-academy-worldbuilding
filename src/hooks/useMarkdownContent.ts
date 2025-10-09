import { useEffect, useState } from "react";

export function useMarkdownContent(filename: string) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadMarkdownContent() {
      try {
        setLoading(true);
        console.log("🔍 Loading markdown file:", filename);

        const response = await fetch(`/markdown/${filename}`);
        if (!response.ok) {
          throw new Error(`Failed to load markdown file: ${filename}`);
        }
        
        const markdownContent = await response.text();
        console.log("📄 Loaded content length:", markdownContent.length);

        setContent(markdownContent);
        setError(null);
      } catch (err) {
        setError(err as Error);
        console.error("Failed to load markdown content:", err);
        setContent("# 오류\n\n마크다운 파일을 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    }

    if (filename) {
      loadMarkdownContent();
    }
  }, [filename]);

  return { content, loading, error };
}