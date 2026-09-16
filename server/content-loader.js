const fs = require('fs');
const path = require('path');
const vm = require('vm');

const DAY_COUNT = 14;
const WRITING_RUBRIC_IDS = ['problem', 'metrics', 'method', 'action', 'english'];

class ContentError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ContentError';
  }
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadContent(rootDir) {
  const context = vm.createContext({
    console: { log() {}, warn() {}, error() {} }
  });
  const files = ['js/data/content.js'];
  for (let day = 1; day <= DAY_COUNT; day += 1) files.push(`js/data/days/day${day}.js`);
  for (const relative of files) {
    const source = fs.readFileSync(path.join(rootDir, relative), 'utf8');
    vm.runInContext(source, context, { filename: relative, timeout: 1000 });
  }
  const content = context.AppContent;
  if (!content || !Array.isArray(content.days) || content.days.length !== DAY_COUNT) {
    throw new ContentError(`课程内容应包含 ${DAY_COUNT} 天`);
  }
  content.days.forEach((day, index) => validateDay(day, index + 1));
  return deepClone(content);
}

function validateDay(day, expectedDay) {
  if (!day || day.day !== expectedDay) throw new ContentError(`Day ${expectedDay} 顺序错误`);
  if (!day.writing || !Array.isArray(day.writing.rubric)) {
    throw new ContentError(`Day ${expectedDay} 缺少案例 rubric`);
  }
  const ids = day.writing.rubric.map((item) => item && item.id);
  if (ids.length !== WRITING_RUBRIC_IDS.length || new Set(ids).size !== ids.length ||
      WRITING_RUBRIC_IDS.some((id) => !ids.includes(id))) {
    throw new ContentError(`Day ${expectedDay} 案例 rubric 必须包含五个唯一维度`);
  }
  if (!day.speaking || !Array.isArray(day.speaking.outline) ||
      !Array.isArray(day.speaking.keySentences) || day.speaking.keySentences.length < 4) {
    throw new ContentError(`Day ${expectedDay} 口语内容不完整`);
  }
}

function assertDay(day) {
  if (!Number.isInteger(day) || day < 1 || day > DAY_COUNT) {
    throw new ContentError('day 必须是 1–14 的整数');
  }
}

function createContentStore(rootDir) {
  const content = loadContent(rootDir);
  return {
    dayCount: DAY_COUNT,
    getDay(day) {
      assertDay(day);
      return deepClone(content.days[day - 1]);
    },
    getWritingContext(day) {
      const item = this.getDay(day);
      return {
        day: item.day,
        theme: item.theme,
        themeZh: item.themeZh,
        writing: item.writing
      };
    },
    getSpeakingContext(day) {
      const item = this.getDay(day);
      return {
        day: item.day,
        theme: item.theme,
        themeZh: item.themeZh,
        speaking: item.speaking
      };
    }
  };
}

module.exports = {
  DAY_COUNT,
  WRITING_RUBRIC_IDS,
  ContentError,
  loadContent,
  createContentStore,
  assertDay
};
