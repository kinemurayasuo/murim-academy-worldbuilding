import { useEffect, useState } from "react";
import type { Document } from "../types";

export function useMarkdownFiles(worldId: string) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadDocuments() {
      try {
        setLoading(true);
        console.log("🔍 Loading documents for worldId:", worldId);

        // JSON 파일에서 문서 목록 로드
        // NOTE: GitHub Pages에서는 베이스 경로가 존재하므로 BASE_URL을 반드시 사용
        const base = import.meta.env.BASE_URL || '/';
        const response = await fetch(`${base}data/${worldId}/documents.json`);
        if (!response.ok) {
          throw new Error(`Failed to load documents for ${worldId}`);
        }
        
        const documentsData = await response.json();
        console.log("📁 Found document categories:", Object.keys(documentsData));

        const docs: Document[] = [];

        // 각 카테고리의 문서들을 Document 타입으로 변환
        for (const [category, categoryDocs] of Object.entries(documentsData)) {
          const typedDocs = categoryDocs as Array<{
            id: string;
            title: string;
            filename: string;
            description?: string;
            excerpt?: string;
            tags?: string[];
          }>;

          for (const docInfo of typedDocs) {
            docs.push({
              id: docInfo.id,
              title: docInfo.title,
              category: category,
              content: docInfo.excerpt || "", // 목록/검색용 간단 본문
              filename: docInfo.filename,
              description: docInfo.description || docInfo.excerpt,
              worldId: worldId,
              lastModified: new Date().toISOString(),
              tags: docInfo.tags || [],
              filePath: `/설정/${docInfo.filename}`
            });
          }
        }

        console.log("📊 Total loaded documents:", docs.length);
        console.log("📋 Document categories:", [...new Set(docs.map(d => d.category))]);

        setDocuments(docs);
        setError(null);
      } catch (err) {
        setError(err as Error);
        console.error("Failed to load documents:", err);
      } finally {
        setLoading(false);
      }
    }

    if (worldId) {
      loadDocuments();
    }
  }, [worldId]);

  return { documents, loading, error };
}