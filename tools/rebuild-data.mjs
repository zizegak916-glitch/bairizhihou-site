import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const source = path.join(root, '_source');

const combinedFiles = [
  ['ch06-10.txt', 6, 10],
  ['ch11-15.txt', 11, 15],
  ['ch16-20.txt', 16, 20],
  ['ch21-25.txt', 21, 25],
];

function writeChapter(number, content) {
  const target = path.join(root, `chapter_${String(number).padStart(2, '0')}.txt`);
  fs.writeFileSync(target, content.trim() + '\n', 'utf8');
}

function copyChapter(number, sourceName) {
  const target = path.join(root, `chapter_${String(number).padStart(2, '0')}.txt`);
  fs.copyFileSync(path.join(source, sourceName), target);
}

for (let number = 1; number <= 5; number += 1) {
  copyChapter(number, `ch${String(number).padStart(2, '0')}.txt`);
}

for (const [filename, first, last] of combinedFiles) {
  const content = fs.readFileSync(path.join(source, filename), 'utf8');
  const pieces = content.split(/^(第[一二三四五六七八九十百零\d]+章[^\n]*)/m);
  const chapters = [];
  for (let index = 1; index < pieces.length; index += 2) {
    chapters.push(`${pieces[index]}${pieces[index + 1] || ''}`.trim());
  }
  if (chapters.length !== last - first + 1) {
    throw new Error(`${filename}: expected ${last - first + 1} chapters, found ${chapters.length}`);
  }
  chapters.forEach((chapter, offset) => writeChapter(first + offset, chapter));
}

for (let number = 26; number <= 50; number += 1) {
  copyChapter(number, `ch${number}.txt`);
}

function chapterTitle(content) {
  const firstLine = content.split('\n').find(line => line.trim())?.trim().replace(/^#+\s*/, '') || '';
  return firstLine
    .replace(/^第[一二三四五六七八九十百零\d]+章\s*[·：:、.-]?\s*/, '')
    .trim();
}

const chapters = [];
for (let number = 1; number <= 50; number += 1) {
  const content = fs.readFileSync(path.join(root, `chapter_${String(number).padStart(2, '0')}.txt`), 'utf8').trimEnd();
  const chineseOnly = (content.match(/[\u3400-\u4dbf\u4e00-\u9fff]/g) || []).length;
  const punctuation = (content.match(/\p{P}/gu) || []).length;
  chapters.push({
    title: chapterTitle(content),
    content,
    chars_with_punct: [...content].length,
    chinese_only: chineseOnly,
    punctuation,
    lines: content.split('\n').length,
  });
}

const characterDefinitions = [
  ['陈亦', '穿越者', '从现代穿越到沈怀身体，拥有"墨未干"和"补痕"能力。怕死、嘴毒、怕麻烦，但聪明。', '#e74c3c', '别停。'],
  ['陆执灯', '关键人物', '唯一知道陈亦不是沈怀的人。沈怀知识的唯一通道。亦敌亦友，"先当刀"。', '#3498db', '这城里没有人是一伙的。'],
  ['杜衡', '高层', '水衡司主簿。"有些纸，不入册，未必就不存在。"', '#c0392b', '有些纸，不入册，未必就不存在。'],
  ['沈怀', '前身', '水衡司录房小吏，查下湾三十七项被杀。"若我明日不醒，来的人不是我。"', '#9b59b6', '若我明日不醒，来的人不是我。'],
  ['六指', '废纸库杂役', '录房最底层的旁观者，知道沈怀已死，也看出陈亦不同，却始终谨慎沉默。', '#64748b', '你比沈录事年轻。'],
  ['谢观成', '中间人', '前中枢经历，曾为银号做事，现在站下湾。经手前牍。', '#f39c12', '有些账，不是你不想认就不存在的。'],
  ['罗小满', '导淮少年', '导淮传信人，腿快嘴快。"你可以怀疑我嘴快，不能怀疑我腿快。"', '#1abc9c', '你可以怀疑我嘴快，不能怀疑我腿快。', ['罗小满','小满']],
  ['老孟', '导淮老人', '下湾老人，三十七项幸存者。"别先查死人。"', '#e67e22', '别先查死人。'],
  ['裴玄纪', '承功派右都水使', '以名分和格式维系统治，不以真相为首要目标，是水衡司权力博弈的核心人物。', '#ef4444', '真相救不了水，名分可以。'],
  ['韩照渠', '分功派左都水使', '老治水官，防止承功派独吞成果，也警惕汞变解和水系格式失控。', '#f97316', '你的名分能堵住水吗？'],
  ['顾廷璋', '奉玺派尚宝司卿', '掌旧印副库，追查旧朝格式与御前未批的历史痕迹。', '#a78bfa', '旧印库不对外开放。'],
  ['姚观澜', '通政司右通政', '以信息截流为武器的中立派，决定材料先到谁手中。', '#94a3b8', '看哪套说法活到最后。'],
  ['白砚奴', '背债银号账使', '围绕沈怀的命债与灾债接触陈亦，态度客气，却始终按债务价值衡量人。', '#f59e0b', '沈录事，你还活着，这笔债就不好看了。'],
  ['闻余白', '骨鸣知行会骨师', '通过骨响读取死者未闭合的账，以死者侧证据对抗账面死销。', '#8b5cf6', '这根骨头不认这笔死销。'],
  ['翁葵', '录房旧人', '与旧档、名册和沈怀留下的查账线索密切相关。', '#22c55e', '有些纸，不该只剩一份。'],
  ['曹留', '上司', '录房主事，冷面热心。能截声。保护陈亦但不说明。', '#2ecc71', '先把手头的事做完。'],
];

const characters = characterDefinitions.map(([name, role, desc, color, quote, aliases = [name]]) => ({
  name,
  color,
  role,
  desc,
  quote,
  chapters: chapters.flatMap((chapter, index) => aliases.some(alias => chapter.content.includes(alias)) ? [index] : []),
}));

const mechanics = fs.readFileSync(path.join(source, 'setting_mechanics.md'), 'utf8');
const worldSettings = [];
for (const section of mechanics.split(/^## /m).slice(1)) {
  const [heading, ...bodyLines] = section.trim().split('\n');
  const name = heading.replace(/^[一二三四五六七八九十]+、/, '').replace(/（绝对规则）/g, '').trim();
  const desc = bodyLines
    .filter(line => line.trim() && !line.startsWith('###'))
    .map(line => line.replace(/^[-*]\s*/, '').replace(/^\*\*([^*]+)：?\*\*\s*/, '$1：').replace(/\*\*/g, ''))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
  worldSettings.push({ name, type: heading.includes('能力') ? '能力机制' : heading.includes('代价') ? '排异机制' : heading.includes('禁止') ? '写作铁律' : '核心机制', desc });
}

const existingContent = JSON.parse(fs.readFileSync(path.join(root, 'data/content.json'), 'utf8'));
const contentData = {
  ...existingContent,
  stats: {
    ...existingContent.stats,
    totalChars: chapters.reduce((sum, chapter) => sum + chapter.chars_with_punct, 0),
    totalChapters: chapters.length,
    totalCharacters: characters.length,
    totalWorldSettings: worldSettings.length,
  },
  characters: characters.map(({ quote, ...character }) => character),
  chapters: chapters.map((chapter, index) => ({ number: index + 1, name: chapter.title, chars: chapter.chars_with_punct })),
  worldSettings,
};

const existingAnalysis = JSON.parse(fs.readFileSync(path.join(root, 'data/analysis.json'), 'utf8'));
const analysisData = {
  ...existingAnalysis,
  characters,
  worldSettings,
};

fs.writeFileSync(path.join(root, 'data/chapters.json'), `${JSON.stringify(chapters, null, 2)}\n`, 'utf8');
fs.writeFileSync(path.join(root, 'data/content.json'), `${JSON.stringify(contentData, null, 2)}\n`, 'utf8');
fs.writeFileSync(path.join(root, 'data/analysis.json'), `${JSON.stringify(analysisData, null, 2)}\n`, 'utf8');

console.log(`Rebuilt ${chapters.length} chapters (${contentData.stats.totalChars} characters), ${characters.length} characters, and ${worldSettings.length} world settings.`);
