import { useState, useMemo } from "react";
import { WorldCard } from "./components/WorldCard";
import { WorldDetailDialog } from "./components/WorldDetailDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Input } from "./components/ui/input";
import { Search, Sparkles } from "lucide-react";

interface WorldItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  detailedDescription: string;
  specifications?: { label: string; value: string }[];
}

const mockData: WorldItem[] = [
  {
    id: "1",
    title: "엘리아 왕국",
    category: "장소",
    description: "고대 마법으로 보호받는 신비로운 왕국. 거대한 성벽과 화려한 궁전이 특징입니다.",
    image: "https://images.unsplash.com/photo-1594845222889-c20e5b48fb53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwY2FzdGxlJTIwbGFuZHNjYXBlfGVufDF8fHx8MTc1OTk3MjQwMXww&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["왕국", "마법", "중세"],
    detailedDescription: "엘리아 왕국은 대륙의 중심부에 위치한 강력한 마법 왕국입니다. 수백 년 전 대마법사 엘리온에 의해 세워졌으며, 그의 마법이 아직도 왕국 전체를 보호하고 있습니다.\n\n왕국의 중심에는 천공의 탑이라 불리는 거대한 마법탑이 있으며, 이곳에서 왕국의 마법사들이 수련하고 연구합니다.",
    specifications: [
      { label: "건국 연도", value: "마법력 285년" },
      { label: "인구", value: "약 50만 명" },
      { label: "주요 산업", value: "마법 연구, 무역" },
      { label: "기후", value: "온화한 사계절" },
    ],
  },
  {
    id: "2",
    title: "드래곤 라이더 아리엘",
    category: "캐릭터",
    description: "전설의 드래곤과 계약을 맺은 젊은 기사. 하늘을 가르는 검은 용을 타고 다닙니다.",
    image: "https://images.unsplash.com/photo-1758850253805-8572b62e376d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwY2hhcmFjdGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU5OTA2MDczfDA&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["전사", "드래곤", "주인공"],
    detailedDescription: "아리엘은 북부 산악 지대의 작은 마을에서 태어났습니다. 어린 시절 우연히 드래곤의 알을 발견하고, 그 드래곤 '섀도우'와 평생의 동반자가 되었습니다.\n\n뛰어난 검술과 드래곤과의 완벽한 호흡으로 왕국 최고의 드래곤 라이더로 성장했습니다.",
    specifications: [
      { label: "나이", value: "24세" },
      { label: "출신", value: "북부 산악 지대" },
      { label: "특기", value: "검술, 비행술" },
      { label: "드래곤", value: "섀도우 (흑룡)" },
    ],
  },
  {
    id: "3",
    title: "신성한 검 '아스트라'",
    category: "아이템",
    description: "신들의 축복을 받은 전설의 검. 어둠의 마법을 정화하는 힘을 지니고 있습니다.",
    image: "https://images.unsplash.com/photo-1757083840090-17a7bfca08c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpZXZhbCUyMHN3b3JkJTIwd2VhcG9ufGVufDF8fHx8MTc1OTk2NDcwNXww&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["무기", "전설", "신성"],
    detailedDescription: "아스트라는 천 년 전 신들의 전쟁 당시 빛의 여신 루미나가 직접 만든 성검입니다. 순수한 마음을 가진 자만이 휘두를 수 있으며, 검에 담긴 신성한 힘은 어둠의 마법을 정화합니다.\n\n현재는 엘리아 왕국의 보물고에 봉인되어 있으며, 진정한 영웅이 나타날 때만 그 봉인이 풀린다고 전해집니다.",
    specifications: [
      { label: "무게", value: "1.2kg" },
      { label: "길이", value: "110cm" },
      { label: "재질", value: "신성한 미스릴" },
      { label: "특수 능력", value: "정화, 빛의 방출" },
    ],
  },
  {
    id: "4",
    title: "신비의 숲",
    category: "장소",
    description: "요정들이 사는 마법의 숲. 일반인은 절대 찾을 수 없는 숨겨진 세계입니다.",
    image: "https://images.unsplash.com/photo-1635931576332-a6ed8bb05324?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWdpY2FsJTIwZm9yZXN0JTIwbmF0dXJlfGVufDF8fHx8MTc1OTk3MjQwMnww&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["숲", "요정", "마법"],
    detailedDescription: "신비의 숲은 차원의 경계에 위치한 특별한 공간입니다. 요정 여왕의 마법으로 보호받고 있으며, 순수한 마음을 가진 자만이 입장할 수 있습니다.\n\n숲 속에는 치유의 샘, 지혜의 나무 등 다양한 마법적 장소들이 있으며, 시간의 흐름도 외부 세계와 다르게 작동합니다.",
    specifications: [
      { label: "위치", value: "차원의 경계" },
      { label: "수호자", value: "요정 여왕 티타니아" },
      { label: "특성", value: "시간 왜곡, 치유 능력" },
      { label: "주민", value: "요정족" },
    ],
  },
  {
    id: "5",
    title: "지혜의 대도서관",
    category: "장소",
    description: "세상의 모든 지식이 담긴 거대한 도서관. 고대 문명의 비밀이 숨겨져 있습니다.",
    image: "https://images.unsplash.com/photo-1722605165802-ce803e7af8f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwbGlicmFyeSUyMGJvb2tzfGVufDF8fHx8MTc1OTk3MjQwMnww&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["도서관", "지식", "고대"],
    detailedDescription: "지혜의 대도서관은 고대 문명 시대부터 존재해온 신성한 장소입니다. 100개의 층으로 이루어져 있으며, 각 층마다 다른 주제의 지식이 보관되어 있습니다.\n\n도서관은 스스로 의식을 가진 것처럼 행동하며, 방문자가 찾는 정보를 자동으로 제공합니다.",
    specifications: [
      { label: "층수", value: "100층" },
      { label: "소장 도서", value: "약 1000만 권" },
      { label: "관리자", value: "대현자 아카샤" },
      { label: "특별 구역", value: "금서의 방" },
    ],
  },
  {
    id: "6",
    title: "거인의 산맥",
    category: "장소",
    description: "하늘을 찌르는 거대한 산맥. 고대 거인들이 만든 유적이 곳곳에 남아있습니다.",
    image: "https://images.unsplash.com/photo-1553623717-752f8e160f81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZSUyMGVwaWN8ZW58MXx8fHwxNzU5OTcyNDAzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["산", "거인", "유적"],
    detailedDescription: "거인의 산맥은 대륙의 북쪽 끝에 위치한 험준한 산맥입니다. 고대 시대에 거인족이 살았던 곳으로, 그들이 남긴 거대한 석조 건축물과 조각상들이 지금도 남아있습니다.\n\n산맥 정상에는 '세계의 지붕'이라 불리는 성스러운 봉우리가 있으며, 전설에 따르면 이곳에서 신들과 소통할 수 있다고 합니다.",
    specifications: [
      { label: "최고봉", value: "8,547m" },
      { label: "총 길이", value: "약 2,000km" },
      { label: "주요 유적", value: "거인의 신전, 하늘의 계단" },
      { label: "위험도", value: "매우 높음" },
    ],
  },
  {
    id: "7",
    title: "폭풍의 드래곤",
    category: "캐릭터",
    description: "천 년을 살아온 고대 드래곤. 날개짓 한 번으로 폭풍을 일으킵니다.",
    image: "https://images.unsplash.com/photo-1610926597998-fc7f2c1b89b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmFnb24lMjBmYW50YXN5JTIwYXJ0fGVufDF8fHx8MTc1OTg2Mzg5OXww&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["드래곤", "고대", "전설"],
    detailedDescription: "폭풍의 드래곤 '템페스트'는 드래곤들 중에서도 가장 강력한 존재 중 하나입니다. 천 년이 넘는 세월 동안 살아오며 막대한 지혜와 힘을 축적했습니다.\n\n거인의 산맥 깊숙한 곳에 둥지를 틀고 있으며, 평소에는 잠들어 있지만 세계에 큰 위기가 닥치면 깨어난다고 전해집니다.",
    specifications: [
      { label: "나이", value: "1,247세" },
      { label: "날개 길이", value: "약 50m" },
      { label: "주 속성", value: "바람, 번개" },
      { label: "성격", value: "고고함, 지혜로움" },
    ],
  },
  {
    id: "8",
    title: "생명의 크리스탈",
    category: "아이템",
    description: "순수한 마나가 결정화된 보석. 무한에 가까운 마법 에너지를 담고 있습니다.",
    image: "https://images.unsplash.com/photo-1594997825043-49fe2d09d2a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcnlzdGFsJTIwZ2VtJTIwbWFnaWN8ZW58MXx8fHwxNzU5OTcyNDAzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["크리스탈", "마나", "희귀"],
    detailedDescription: "생명의 크리스탈은 세계 창조 시 남은 순수 마나가 수천 년에 걸쳐 결정화된 것입니다. 무지갯빛으로 빛나며, 그 안에는 거의 무한에 가까운 마법 에너지가 담겨 있습니다.\n\n현재까지 발견된 것은 단 3개뿐이며, 각각 엘리아 왕국, 마법 평의회, 그리고 어둠의 제국이 보유하고 있습니다.",
    specifications: [
      { label: "크기", value: "주먹 크기" },
      { label: "마나량", value: "추정 불가" },
      { label: "희귀도", value: "전설급" },
      { label: "특수 능력", value: "마나 증폭, 치유" },
    ],
  },
];

export default function App() {
  const [selectedItem, setSelectedItem] = useState<WorldItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("전체");

  const categories = ["전체", "캐릭터", "장소", "아이템"];

  const filteredData = useMemo(() => {
    let filtered = mockData;

    if (activeCategory !== "전체") {
      filtered = filtered.filter((item) => item.category === activeCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
            <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              세계관 라이브러리
            </h1>
          </div>
          <p className="text-gray-600">
            당신의 상상 속 세계를 탐험하고 관리하세요
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="제목, 설명, 태그로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
          <TabsList className="bg-white">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-6">
              {filteredData.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-500">검색 결과가 없습니다</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredData.map((item) => (
                    <WorldCard
                      key={item.id}
                      {...item}
                      onClick={() => setSelectedItem(item)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Detail Dialog */}
        <WorldDetailDialog
          item={selectedItem}
          open={!!selectedItem}
          onOpenChange={(open) => !open && setSelectedItem(null)}
        />
      </div>
    </div>
  );
}
