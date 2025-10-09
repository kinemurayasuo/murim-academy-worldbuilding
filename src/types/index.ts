// 세계관 타입
export interface World {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  tags: string[];
  createdAt: string;
  status: "진행중" | "기획중" | "초안" | "완료";
}

// 문서 카테고리 타입
export interface DocumentCategory {
  id: string;
  name: string;
  icon?: string;
  count: number;
}

// 문서 타입
export interface Document {
  id: string;
  worldId: string;
  category: string;
  title: string;
  description?: string;
  content: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
  filePath: string;
  filename?: string;
  lastModified?: string;
}

// Frontmatter 타입
export interface DocumentFrontmatter {
  title?: string;
  description?: string;
  tags?: string[];
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}
