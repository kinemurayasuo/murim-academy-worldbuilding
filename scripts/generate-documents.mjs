import { readdir, stat, readFile, mkdir, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

const ROOT = process.cwd();
const SOURCE_DIRS = [
  path.join(ROOT, 'src', '설정'), // 우선순위 1: src/설정
  path.join(ROOT, '설정'),        // 우선순위 2: 루트/설정
];
const DEST_DIR = path.join(ROOT, 'public', 'markdown');
const DATA_DIR = path.join(ROOT, 'public', 'data', 'murim-academy');
const OUTPUT_JSON = path.join(DATA_DIR, 'documents.json');

function sanitizeId(name) {
  return name.replace(/\.md$/i, '').replace(/\s+/g, '-').replace(/[^\w\-가-힣]/g, '').toLowerCase();
}

function parseCategoryFromFilename(filename) {
  const name = filename.replace(/\.md$/i, '');
  const patterns = {
    '세계관': [/^세계관/, /^시대/, /^배경/],
    '캐릭터': [/^캐릭터/, /^인물/, /^주인공/, /^NPC/],
    '시스템': [/^시스템/, /^전투력/, /^레벨/, /^스탯/, /^호감도/, /^게임/],
    '세력': [/^세력/, /^문파/, /^조직/, /^길드/],
    '스킬': [/^스킬/, /^무공/, /^기술/, /^능력/],
    '직업': [/^직업/, /^클래스/, /^직종/],
    '아이템': [/^아이템/, /^장비/, /^도감/, /^무기/],
    '장소': [/^장소/, /^지역/, /^맵/, /^위치/],
    '시나리오': [/^시나리오/, /^스토리/, /^이벤트/, /^퀘스트/],
    '타임라인': [/^타임라인/, /^연표/, /^달력/, /^시간/],
    '학년별': [/^학년별/, /^\d학년/, /^교직원/],
    '설정': [/^설정/, /^FAQ/],
    '공략': [/^공략/],
  };
  for (const [cat, regs] of Object.entries(patterns)) {
    if (regs.some(r => r.test(name))) return cat;
  }
  return '기타';
}

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return fullPath;
  }));
  return files.flat();
}

async function main() {
  await ensureDir(DEST_DIR);
  await ensureDir(DATA_DIR);

  // 여러 소스 디렉토리에서 md 수집 (존재하는 디렉토리만)
  const collected = [];
  for (const dir of SOURCE_DIRS) {
    try {
      const st = await stat(dir);
      if (st.isDirectory()) {
        const paths = (await walk(dir)).filter(p => p.toLowerCase().endsWith('.md'));
        collected.push(...paths);
      }
    } catch (e) {
      // 디렉토리가 없으면 스킵
    }
  }

  // 같은 파일명 충돌 시, 앞선 디렉토리(src/설정)의 파일이 우선
  const seen = new Set();
  const allPaths = [];
  for (const p of collected) {
    const name = path.basename(p).toLowerCase();
    if (seen.has(name)) continue;
    seen.add(name);
    allPaths.push(p);
  }
  const byCategory = {};

  for (const srcPath of allPaths) {
    const filename = path.basename(srcPath);
    const destPath = path.join(DEST_DIR, filename);

    // copy markdown to public
    await copyFile(srcPath, destPath).catch(async (e) => {
      // if same file, still overwrite
      await writeFile(destPath, await readFile(srcPath));
    });

    const raw = await readFile(srcPath, 'utf8');
  const { data, content } = matter(raw);

    const titleFromH1 = (() => {
      const m = content.match(/^#\s+(.+)$/m);
      return m ? m[1].trim() : null;
    })();

    const category = data?.category || parseCategoryFromFilename(filename);
    const title = data?.title || titleFromH1 || filename.replace(/\.md$/i, '');
    const description = data?.description || '';
    const excerpt = (() => {
      // 첫 빈줄 전까지를 요약으로 사용, 마크다운 기호는 간단히 제거
      const firstPara = content.split(/\n\s*\n/)[0] || '';
      const stripped = firstPara
        .replace(/^#\s+.*$/gm, '') // headings 제거
        .replace(/`{1,3}[^`]*`{1,3}/g, '') // inline code 제거
        .replace(/\*\*|__/g, '') // bold markers 제거
        .replace(/\*|_/g, '') // emphasis markers 제거
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // 링크 텍스트만 유지
        .replace(/<[^>]+>/g, '') // html 태그 제거
        .trim();
      const shortened = stripped.slice(0, 180);
      return shortened.length < stripped.length ? `${shortened}…` : shortened;
    })();
    const id = sanitizeId(filename);

    const doc = {
      id,
      title,
      filename,
      description,
      excerpt,
      tags: Array.isArray(data?.tags) ? data.tags : [],
    };

    if (!byCategory[category]) byCategory[category] = [];
    byCategory[category].push(doc);
  }

  // stable sort categories alphabetically for consistency
  const sorted = Object.fromEntries(
    Object.entries(byCategory)
      .sort((a, b) => a[0].localeCompare(b[0], 'ko'))
      .map(([cat, arr]) => [cat, arr.sort((x, y) => x.title.localeCompare(y.title, 'ko'))])
  );

  await writeFile(OUTPUT_JSON, JSON.stringify(sorted, null, 2), 'utf8');
  console.log(`✅ Generated ${OUTPUT_JSON} with ${allPaths.length} markdown files.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
