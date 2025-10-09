import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { ThemeToggle } from "../components/ThemeToggle";
import { Book, Search, Sparkles } from "lucide-react";
import worldsData from "../data/worlds.json";
import type { World } from "../types";

const worlds = worldsData as World[];

export function WorldListPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredWorlds = worlds.filter(
    (world) =>
      world.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      world.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      world.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "진행중":
        return "bg-green-500 dark:bg-green-600";
      case "기획중":
        return "bg-blue-500 dark:bg-blue-600";
      case "초안":
        return "bg-yellow-500 dark:bg-yellow-600";
      case "완료":
        return "bg-gray-500 dark:bg-gray-600";
      default:
        return "bg-gray-500 dark:bg-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                세계관 라이브러리
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              당신의 상상 속 세계를 탐험하고 관리하세요
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <Input
              placeholder="세계관 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* World Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorlds.map((world) => (
            <Card
              key={world.id}
              className="cursor-pointer hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 dark:border-gray-700"
              onClick={() => navigate(`/world/${world.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Book className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <Badge className={getStatusColor(world.status)}>
                    {world.status}
                  </Badge>
                </div>
                <CardTitle className="dark:text-white">{world.title}</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  {world.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {world.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  생성일: {new Date(world.createdAt).toLocaleDateString("ko-KR")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredWorlds.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400">검색 결과가 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}
