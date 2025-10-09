import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ThemeToggle } from "../components/ThemeToggle";
import { ScrollArea } from "../components/ui/scroll-area";
import { ArrowLeft, FileText, Search } from "lucide-react";
import { Button } from "../components/ui/button";
import { useMarkdownFiles } from "../hooks/useMarkdownFiles";
import { groupByCategory, filterDocuments } from "../utils/markdownLoader";
import { getCategoryIcon, getCategoryOrder } from "../utils/categoryParser";
import worldsData from "../data/worlds.json";

export function DocumentListPage() {
  const { worldId } = useParams<{ worldId: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("전체");

  const world = worldsData.find((w) => w.id === worldId);
  const { documents, loading } = useMarkdownFiles(worldId || "");

  const filteredDocs = useMemo(() => {
    let filtered = documents;

    if (activeCategory !== "전체") {
      filtered = filtered.filter((doc) => doc.category === activeCategory);
    }

    if (searchQuery) {
      filtered = filterDocuments(filtered, searchQuery);
    }

    return filtered;
  }, [documents, activeCategory, searchQuery]);

  const categorizedDocs = useMemo(() => groupByCategory(documents), [documents]);

  const categories = useMemo(() => {
    const cats = ["전체", ...Object.keys(categorizedDocs)];
    const orderedCategories = getCategoryOrder();
    return cats.sort((a, b) => {
      if (a === "전체") return -1;
      if (b === "전체") return 1;
      const indexA = orderedCategories.indexOf(a);
      const indexB = orderedCategories.indexOf(b);
      return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    });
  }, [categorizedDocs]);

  if (!world) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>세계관을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="mb-4 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              목록으로
            </Button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
              {world.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">{world.description}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {world.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="문서 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Category Tabs */}
        {loading ? (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400">문서를 불러오는 중...</p>
          </div>
        ) : (
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <ScrollArea className="w-full">
              <TabsList className="bg-white dark:bg-gray-800 mb-6 inline-flex">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="dark:text-gray-300 dark:data-[state=active]:bg-gray-700"
                  >
                    {getCategoryIcon(category)} {category}
                    {category !== "전체" && (
                      <Badge variant="secondary" className="ml-2 dark:bg-gray-700">
                        {categorizedDocs[category]?.length || 0}
                      </Badge>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>

            <TabsContent value={activeCategory}>
              {filteredDocs.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-500 dark:text-gray-400">문서가 없습니다</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredDocs.map((doc) => (
                    <Card
                      key={doc.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 dark:border-gray-700"
                      onClick={() => navigate(`/world/${worldId}/${doc.category}/${doc.id}`)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-2xl">{getCategoryIcon(doc.category)}</span>
                          <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                            {doc.category}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg dark:text-white">{doc.title}</CardTitle>
                        {(doc.description || doc.content) && (
                          <CardDescription className="dark:text-gray-400 line-clamp-2">
                            {doc.description || doc.content}
                          </CardDescription>
                        )}
                      </CardHeader>
                      {doc.tags.length > 0 && (
                        <CardContent>
                          <div className="flex flex-wrap gap-1">
                            {doc.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-300">
                                {tag}
                              </Badge>
                            ))}
                            {doc.tags.length > 3 && (
                              <Badge variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-300">
                                +{doc.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
