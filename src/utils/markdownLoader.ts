import matter from "gray-matter";
import type { Document, DocumentFrontmatter } from "../types";
import { parseCategoryFromFilename } from "./categoryParser";

// MD 파일을 Document 객체로 변환
export function parseMarkdownFile(
  content: string,
  filePath: string,
  worldId: string
): Document {
  const { data, content: markdownContent } = matter(content);
  const frontmatter = data as DocumentFrontmatter;

  const filename = filePath.split(/[/\\]/).pop() || "";
  const id = filename.replace(/\.md$/, "");

  const category =
    frontmatter.category || parseCategoryFromFilename(filename);
  const title = frontmatter.title || extractTitleFromContent(markdownContent) || id;

  return {
    id,
    worldId,
    category,
    title,
    description: frontmatter.description,
    content: markdownContent,
    tags: frontmatter.tags || [],
    createdAt: frontmatter.createdAt,
    updatedAt: frontmatter.updatedAt,
    filePath,
  };
}

// Markdown 컨텐츠에서 첫 번째 H1 제목 추출
function extractTitleFromContent(content: string): string | null {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

// Document 배열을 카테고리별로 그룹화
export function groupByCategory(
  documents: Document[]
): Record<string, Document[]> {
  return documents.reduce(
    (acc, doc) => {
      if (!acc[doc.category]) {
        acc[doc.category] = [];
      }
      acc[doc.category].push(doc);
      return acc;
    },
    {} as Record<string, Document[]>
  );
}

// 검색 필터링
export function filterDocuments(
  documents: Document[],
  query: string
): Document[] {
  if (!query) return documents;

  const lowerQuery = query.toLowerCase();
  return documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(lowerQuery) ||
      doc.description?.toLowerCase().includes(lowerQuery) ||
      doc.content.toLowerCase().includes(lowerQuery) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}
