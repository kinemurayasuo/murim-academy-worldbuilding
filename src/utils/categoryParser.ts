// 파일명으로 카테고리 자동 분류
export function parseCategoryFromFilename(filename: string): string {
  const name = filename.replace(/\.md$/, "");

  // 카테고리 패턴 매칭
  const categoryPatterns: Record<string, RegExp[]> = {
    세계관: [/^세계관/, /^시대/, /^배경/],
    캐릭터: [/^캐릭터/, /^인물/, /^주인공/, /^NPC/],
    시스템: [/^시스템/, /^전투력/, /^레벨/, /^스탯/, /^호감도/, /^게임/],
    세력: [/^세력/, /^문파/, /^조직/, /^길드/],
    스킬: [/^스킬/, /^무공/, /^기술/, /^능력/],
    직업: [/^직업/, /^클래스/, /^직종/],
    아이템: [/^아이템/, /^장비/, /^도감/, /^무기/],
    장소: [/^장소/, /^지역/, /^맵/, /^위치/],
    시나리오: [/^시나리오/, /^스토리/, /^이벤트/, /^퀘스트/],
    타임라인: [/^타임라인/, /^연표/, /^달력/, /^시간/],
    학년별: [/^학년별/, /^\d학년/, /^교직원/],
    설정: [/^설정/, /^FAQ/],
    공략: [/^공략/],
  };

  for (const [category, patterns] of Object.entries(categoryPatterns)) {
    if (patterns.some((pattern) => pattern.test(name))) {
      return category;
    }
  }

  return "기타";
}

// 카테고리별 아이콘 매핑
export function getCategoryIcon(category: string): string {
  const iconMap: Record<string, string> = {
    세계관: "🌍",
    캐릭터: "👤",
    시스템: "⚙️",
    세력: "🏰",
    스킬: "⚔️",
    직업: "💼",
    아이템: "💎",
    장소: "🗺️",
    시나리오: "📖",
    타임라인: "📅",
    학년별: "🎓",
    설정: "📋",
    공략: "🎯",
    기타: "📄",
  };

  return iconMap[category] || "📄";
}

// 카테고리 정렬 순서
export function getCategoryOrder(): string[] {
  return [
    "세계관",
    "캐릭터",
    "시스템",
    "세력",
    "스킬",
    "직업",
    "아이템",
    "장소",
    "시나리오",
    "타임라인",
    "학년별",
    "설정",
    "공략",
    "기타",
  ];
}
