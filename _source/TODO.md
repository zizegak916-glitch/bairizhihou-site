# 任务：白日之后网站大改

## 目标
用_source/目录下的最新章节内容替换网站当前内容，并添加补丁集和大纲面板。

## 当前网站结构
- index.html: 单页应用，7个tab（概览/正文/人物/关系/世界观/大纲/补丁集）
- chapter_01.txt ~ chapter_50.txt: 章节纯文本
- data/chapters.json: 章节数据（title/content/chars_with_punct/chinese_only/punctuation/lines）
- data/content.json: 综合数据（title/subtitle/stats/characters/relationships/chapters/plotPoints/worldSettings）
- data/analysis.json: 角色+世界观数据

## 需要做的事

### 1. 拆分合并章节文件并替换chapter_XX.txt
_source/中的文件格式：
- ch01.txt ~ ch05.txt: 单章，直接替换 chapter_01.txt ~ chapter_05.txt
- ch06-10.txt: 合并文件，包含第6-10章，需要按"第X章"标题拆分成 chapter_06.txt ~ chapter_10.txt
- ch11-15.txt: 合并文件，拆分成 chapter_11.txt ~ chapter_15.txt
- ch16-20.txt: 合并文件，拆分成 chapter_16.txt ~ chapter_20.txt
- ch21-25.txt: 合并文件，拆分成 chapter_21.txt ~ chapter_25.txt
- ch26.txt ~ ch50.txt: 单章，直接替换

拆分方法：用正则 `re.split(r'(第[一二三四五六七八九十百零\d]+章[^\n]*)', content)` 拆分合并文件。

### 2. 重新生成 data/chapters.json
读取所有chapter_XX.txt，生成JSON数组。每个元素：
```json
{
  "title": "章节标题（不含"第X章"前缀）",
  "content": "完整章节文本",
  "chars_with_punct": 总字符数(含标点),
  "chinese_only": 中文字数(不含标点),
  "punctuation": 标点数,
  "lines": 行数
}
```

### 3. 更新 data/content.json
- 更新stats.totalChars和stats.totalChapters
- 更新characters数组（从章节内容提取角色出场信息）
- 更新chapters数组（每章的章节编号列表）
- 更新worldSettings数组
- 保留现有的characters颜色和描述

### 4. 更新 data/analysis.json
- 更新characters数组
- 更新worldSettings数组（从_source/setting_mechanics.md提取）

### 5. 在index.html的"补丁集"tab中添加补丁集内容
读取以下文件的内容，渲染到panel-patches中：
- _source/setting_correction.md（设定修正_账=历史）
- _source/setting_corrections_0619.md（设定修正记录）
- _source/setting_mechanics.md（能力机制铁律）

用好看的排版展示（深色背景、紫色标题、卡片式布局）。

### 6. 在index.html的"大纲"tab中添加v12大纲内容
读取 _source/outline_v12.txt，渲染到panel-outline中。
保留现有的大纲展示格式。

### 7. 确保index.html的JS正确加载新数据
- loadData()函数正确fetch新的chapters.json和content.json
- 章节阅读器正确显示新章节
- 所有tab正常工作

## 技术要求
- 纯HTML/CSS/JS单页应用，不需要构建工具
- 深色主题（背景#0a0a0f，文字#d4d4d4）
- 响应式设计，手机端可用
- 章节正文区域：font-size:18px, line-height:2.0, max-width:700px
- 中文排版：text-indent:2em

## 注意事项
- _source/中的合并文件（ch06-10等）需要先拆分再替换
- 章节标题格式："第X章 标题"，拆分时保留标题行
- chapters.json的title字段不包含"第X章"前缀
- 所有JSON文件用UTF-8编码
