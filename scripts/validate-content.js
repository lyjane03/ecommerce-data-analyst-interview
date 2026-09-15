#!/usr/bin/env node

/* Machine-judgable content contract for the standalone application. */
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var root = path.resolve(__dirname, '..');
var mode = process.argv[2] || '--all';
var failures = [];
function fail(message) { failures.push(message); }
function assert(condition, message) { if (!condition) fail(message); }
function read(relative) { return fs.readFileSync(path.join(root, relative), 'utf8'); }
function load(relative, context) { vm.runInContext(read(relative), context, { filename: relative }); }
function sourceIdsOf(item) { return item && Array.isArray(item.sourceIds) ? item.sourceIds : []; }
function checkSources(items, sourceMap, label) {
  assert(Array.isArray(items) && items.length > 0, label + ' 缺少 sourceIds');
  items.forEach(function (id) {
    assert(sourceMap[id], label + ' 引用了不存在的 sourceId: ' + id);
  });
}
function normal(text) { return String(text || '').toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, ''); }

var context = vm.createContext({ console: console });
load('js/data/sources.js', context);
load('js/data/content.js', context);
load('js/data/vocabulary.js', context);
for (var d = 1; d <= 14; d++) load('js/data/days/day' + d + '.js', context);

var sources = context.AppSources && context.AppSources.items || [];
var sourceMap = {};
sources.forEach(function (s) {
  assert(s && s.id && !sourceMap[s.id], '来源 ID 重复或为空');
  sourceMap[s.id] = s;
  assert(/^https:\/\//.test(s.url || ''), '来源 URL 不是 HTTPS: ' + (s.id || '?'));
  assert(['A', 'B', 'C'].indexOf(s.authorityTier) >= 0, '来源层级无效: ' + (s.id || '?'));
  assert(s.publisher && s.title && s.retrievedAt && Array.isArray(s.topics) && s.topics.length > 0, '来源字段不完整: ' + (s.id || '?'));
  if (s.authorityTier === 'C') assert(s.audienceEvidence, 'Tier C 缺少受众量证据: ' + s.id);
});

function validateSources() {
  assert(sources.length >= 10, '来源少于 10 条');
  var tierC = sources.filter(function (s) { return s.authorityTier === 'C'; });
  assert(tierC.length === 0, '本版本不应依赖 Tier C 来源');
  console.log('sources: PASS (' + sources.length + ' sources; ' + (sources.length - tierC.length) + ' Tier A/B)');
}

function validateVocabulary() {
  var vocab = context.AppVocabulary;
  assert(vocab && Array.isArray(vocab.categories), '词汇数据未加载');
  assert(vocab.categories.length === 10, '词汇分类应为 10 类，实际 ' + vocab.categories.length);
  var words = vocab.getAllWords();
  assert(words.length === 100, '词汇应为 100 项，实际 ' + words.length);
  var seen = {};
  vocab.categories.forEach(function (category) {
    assert(category.words.length === 10, category.id + ' 应有 10 项词汇，实际 ' + category.words.length);
    category.words.forEach(function (word) {
      var key = normal(word.word);
      assert(!seen[key], '词汇重复: ' + word.word);
      seen[key] = true;
      assert(word.word && word.def && word.example, '词汇字段不完整: ' + word.word);
      checkSources(word.sourceIds, sourceMap, '词汇 ' + word.word);
    });
  });
  console.log('vocabulary: PASS (10 categories × 10 = 100)');
}

var expectedThemes = [
  '岗位叙事与电商 KPI 树', '订单/商品/客户数据粒度', 'GMV/NMV/Revenue/AOV/UPT', '行为事件与转化漏斗',
  '获客/归因/CAC/ROAS/ACOS', 'cohort/留存/复购/LTV', 'A/B 测试/样本量/随机化/guardrail/SRM',
  '商品、搜索、品类、价格与促销', '库存、缺货、履约、取消与退货', '高级 SQL（窗口、滚动、Top-N、去重）',
  '看板、业务叙事与跨部门沟通', '埋点、口径、时区、币种和数据质量', '收入下滑与大促异常诊断', '完整模拟面试'
];

function validateQuestion(q, label, questionSeen) {
  assert(q && ['mcq', 'fillblank', 'correction'].indexOf(q.type) >= 0, label + ' 题型无效');
  assert(q.question && q.explanation && q.explanationZh, label + ' 缺少题干或双语解释');
  checkSources(q.sourceIds, sourceMap, label);
  var qkey = normal(q.question);
  assert(!questionSeen[qkey], '重复题干: ' + q.question);
  questionSeen[qkey] = true;
  if (q.type === 'mcq') {
    assert(Array.isArray(q.options) && q.options.length === 4, label + ' 选择题应有 4 个选项');
    assert(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length, label + ' answer 索引无效');
  } else if (q.type === 'fillblank') {
    assert(typeof q.answer === 'string' && q.answer.length > 0, label + ' 填空答案为空');
    assert(Array.isArray(q.acceptedAnswers) || q.answer.length > 0, label + ' 缺少填空答案');
  } else {
    assert(typeof q.corrected === 'string' && q.corrected.length > 0, label + ' corrected 为空');
    assert(q.answer === q.corrected, label + ' correction answer 与 corrected 不一致');
  }
  assert(['metrics', 'sql', 'funnel', 'experiment', 'communication'].indexOf(q.domain) >= 0, label + ' domain 无效');
}

function validateDays() {
  var days = context.AppContent.days;
  assert(Array.isArray(days) && days.length === 14, '课程天数应为 14，实际 ' + ((days && days.length) || 0));
  var questionSeen = {};
  var quizCount = 0, listeningCount = 0, speakingCount = 0, writingCount = 0;
  var domainCounts = { metrics: 0, sql: 0, funnel: 0, experiment: 0, communication: 0 };
  days.forEach(function (day, i) {
    var label = 'Day ' + (i + 1);
    assert(day.day === i + 1, label + ' day 顺序错误');
    assert(day.themeZh === expectedThemes[i], label + ' 主题不符合蓝图');
    assert(day.theme && day.minutes === 240 && Array.isArray(day.sourceIds), label + ' 基础字段不完整');
    checkSources(day.sourceIds, sourceMap, label);
    var listening = day.listening;
    assert(listening && Array.isArray(listening.text) && listening.text.length >= 5, label + ' 听力正文不足');
    assert(Array.isArray(listening.textZh) && listening.textZh.length === listening.text.length, label + ' 听力中英句数不一致');
    assert(Array.isArray(listening.keywords) && listening.keywords.length >= 5, label + ' 听力关键词不足');
    assert(Array.isArray(listening.comprehension) && listening.comprehension.length === 3, label + ' 听力理解应为 3 题');
    listening.comprehension.forEach(function (q, qi) {
      assert(Array.isArray(q.options) && Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length, label + ' 听力题答案无效 Q' + (qi + 1));
      assert(q.question && q.explanationZh, label + ' 听力题字段不完整 Q' + (qi + 1));
      checkSources(q.sourceIds, sourceMap, label + ' 听力题 Q' + (qi + 1));
    });
    listeningCount += listening.comprehension.length;

    var writing = day.writing;
    assert(writing && writing.title && writing.prompt && writing.dataContext && writing.deliverable && writing.referenceAnswer, label + ' 案例分析字段不完整');
    assert(Array.isArray(writing.rubric) && writing.rubric.length === 5, label + ' 案例 rubric 应为 5 维');
    checkSources(writing.sourceIds, sourceMap, label + ' 案例分析');
    writingCount++;

    var speaking = day.speaking;
    assert(speaking && Array.isArray(speaking.outline) && speaking.outline.length === 4, label + ' 口语提示应为 4 项');
    assert(Array.isArray(speaking.keySentences) && speaking.keySentences.length >= 4, label + ' 口语关键句不足');
    assert(Array.isArray(speaking.selfEvalCriteria) && speaking.selfEvalCriteria.length === 5, label + ' 口语自评应为 5 维');
    checkSources(speaking.sourceIds, sourceMap, label + ' 口语');
    speakingCount += speaking.outline.length;

    assert(day.quiz && Array.isArray(day.quiz.questions) && day.quiz.questions.length === 8, label + ' 测验应为 8 题');
    day.quiz.questions.forEach(function (q, qi) {
      validateQuestion(q, label + ' 测验 Q' + (qi + 1), questionSeen);
      domainCounts[q.domain]++;
      quizCount++;
    });
  });
  var expectedDomains = { metrics: 32, sql: 28, funnel: 20, experiment: 16, communication: 16 };
  Object.keys(expectedDomains).forEach(function (domain) { assert(domainCounts[domain] === expectedDomains[domain], domain + ' 题目应为 ' + expectedDomains[domain] + '，实际 ' + domainCounts[domain]); });
  assert(quizCount === 112 && listeningCount === 42 && speakingCount === 56 && writingCount === 14, '题库总量不符合契约');
  console.log('days: PASS (14 days; ' + quizCount + ' quiz; ' + listeningCount + ' listening; ' + speakingCount + ' speaking; ' + writingCount + ' written cases)');
  console.log('quiz domains: ' + JSON.stringify(domainCounts));
}

function validateBlueprint() {
  var blueprint = read('docs/content-blueprint.md');
  expectedThemes.forEach(function (theme) { assert(blueprint.indexOf(theme) >= 0, '蓝图缺少主题: ' + theme); });
  assert(blueprint.indexOf('D14') >= 0 && blueprint.indexOf('SQL') >= 0, '蓝图缺少 D14 综合面试要求');
  console.log('blueprint: PASS (14 mapped themes)');
}

function validateResiduals() {
  var targets = ['index.html', 'js', 'docs', 'README.md'];
  var residual = [];
  var pattern = /danone|mizone|brand manager|fmcg|beverage|brand equity|脉动|达能|品牌经理/ig;
  function scan(relative) {
    var absolute = path.join(root, relative);
    if (!fs.existsSync(absolute)) return;
    var stat = fs.statSync(absolute);
    if (stat.isDirectory()) fs.readdirSync(absolute).forEach(function (name) { scan(path.join(relative, name)); });
    else if (/\.(html|js|md)$/.test(relative)) {
      var lines = read(relative).split('\n');
      lines.forEach(function (line, i) { if (pattern.test(line)) residual.push(relative + ':' + (i + 1)); pattern.lastIndex = 0; });
    }
  }
  targets.forEach(scan);
  assert(residual.length === 0, '发现旧岗位残留: ' + residual.slice(0, 10).join(', '));
  console.log('residual scan: PASS (0 legacy role matches)');
}

function validateAll() {
  validateSources();
  validateVocabulary();
  validateBlueprint();
  validateDays();
  validateResiduals();
}

if (mode === '--sources-only') validateSources();
else if (mode === '--vocabulary') validateVocabulary();
else if (mode === '--blueprint') validateBlueprint();
else if (mode === '--days') validateDays();
else if (mode === '--all') validateAll();
else fail('未知参数: ' + mode);

if (failures.length) {
  console.error('VALIDATION FAILED');
  failures.forEach(function (message) { console.error('- ' + message); });
  process.exit(1);
}
