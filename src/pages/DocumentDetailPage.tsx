import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ThemeToggle } from "../components/ThemeToggle";
import { ScrollArea } from "../components/ui/scroll-area";
import { ArrowLeft, FileText } from "lucide-react";
import { useMarkdownFiles } from "../hooks/useMarkdownFiles";
import { useMarkdownContent } from "../hooks/useMarkdownContent";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

export function DocumentDetailPage() {
  const { worldId, category, docId } = useParams<{
    worldId: string;
    category: string;
    docId: string;
  }>();
  const navigate = useNavigate();
  const { documents, loading } = useMarkdownFiles(worldId || "");

  const document = documents.find((doc) => doc.id === docId);
  const { content, loading: contentLoading } = useMarkdownContent(document?.filename || "");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">문서를 불러오는 중...</p>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">문서를 찾을 수 없습니다.</p>
          <Button onClick={() => navigate(`/world/${worldId}`)}>
            목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div className="flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/world/${worldId}`)}
              className="mb-4 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              목록으로
            </Button>
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-4xl font-bold dark:text-white">{document.title}</h1>
            </div>
            {document.description && (
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                {document.description}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                {document.category}
              </Badge>
              {document.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Markdown Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 dark:border dark:border-gray-700">
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold mt-8 mb-4 dark:text-white">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-bold mt-6 mb-3 dark:text-white">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-bold mt-4 mb-2 dark:text-white">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-4 leading-7 dark:text-gray-300">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-6 mb-4 dark:text-gray-300">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-6 mb-4 dark:text-gray-300">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="mb-1 dark:text-gray-300">{children}</li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-blue-500 dark:border-blue-400 pl-4 italic my-4 dark:text-gray-300">
                      {children}
                    </blockquote>
                  ),
                  code: ({ inline, children }: { inline?: boolean; children?: React.ReactNode }) =>
                    inline ? (
                      <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm dark:text-gray-200">
                        {children}
                      </code>
                    ) : (
                      <code className="block bg-gray-100 dark:bg-gray-700 p-4 rounded my-4 overflow-x-auto dark:text-gray-200">
                        {children}
                      </code>
                    ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-4">
                      <table className="min-w-full border border-gray-300 dark:border-gray-600">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-gray-100 dark:bg-gray-700">{children}</thead>
                  ),
                  th: ({ children }) => (
                    <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left dark:text-white">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 dark:text-gray-300">
                      {children}
                    </td>
                  ),
                  hr: () => <hr className="my-6 border-gray-300 dark:border-gray-600" />,
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {contentLoading ? "마크다운 내용을 로드하는 중..." : content}
              </ReactMarkdown>
            </div>
          </ScrollArea>
        </div>

        {/* Footer Info */}
        {(document.createdAt || document.updatedAt) && (
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {document.createdAt && (
              <span className="mr-4">
                생성일: {new Date(document.createdAt).toLocaleDateString("ko-KR")}
              </span>
            )}
            {document.updatedAt && (
              <span>
                수정일: {new Date(document.updatedAt).toLocaleDateString("ko-KR")}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
