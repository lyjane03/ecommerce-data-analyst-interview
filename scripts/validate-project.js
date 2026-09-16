#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const failures = [];
function fail(message) { failures.push(message); }
function run(label, command, args) {
  const result = spawnSync(command, args, { cwd: root, encoding: 'utf8' });
  if (result.status !== 0) {
    fail(`${label} failed with exit code ${result.status}`);
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
  } else {
    process.stdout.write(`${label}: PASS\n`);
  }
}
function filesUnder(relative, extension) {
  const dir = path.join(root, relative);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).flatMap((name) => {
    const file = path.join(dir, name);
    const stat = fs.statSync(file);
    if (stat.isDirectory()) return filesUnder(path.join(relative, name), extension);
    return file.endsWith(extension) ? [file] : [];
  });
}

['package.json', 'package-lock.json', '.env.example', 'server/app.js', 'server/config.js', 'server/content-loader.js', 'server/deepseek-client.js', 'server/glm-transcription-client.js', 'server/prompt-builder.js', 'server/scoring-service.js', 'server/result-validator.js', 'js/ai-scoring.js', 'docs/ai-scoring.md'].forEach((file) => {
  if (!fs.existsSync(path.join(root, file))) fail(`missing required file: ${file}`);
});

run('content validation', 'node', ['scripts/validate-content.js', '--all']);
const jsFiles = [...filesUnder('js', '.js'), ...filesUnder('server', '.js'), ...filesUnder('scripts', '.js')];
for (const file of jsFiles) {
  const result = spawnSync(process.execPath, ['--check', file], { cwd: root, encoding: 'utf8' });
  if (result.status !== 0) fail(`syntax error: ${path.relative(root, file)}`);
}
if (!failures.some((item) => item.startsWith('syntax error'))) process.stdout.write(`JavaScript syntax: PASS (${jsFiles.length} files)\n`);

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const refs = [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/g)].map((match) => match[1]);
const missing = refs.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length) fail(`missing local scripts: ${missing.join(', ')}`);
else process.stdout.write(`HTML local script references: PASS (${refs.length})\n`);

const scanFiles = [path.join(root, 'index.html'), path.join(root, 'README.md'), ...filesUnder('js', '.js'), ...filesUnder('docs', '.md')];
const combined = scanFiles.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
if (/sk-[A-Za-z0-9_-]{20,}/.test(combined)) fail('possible API key found in application files');
else process.stdout.write('secret scan: PASS\n');
if (/api\.openai\.com/.test(combined)) fail('frontend/application content contains a direct OpenAI URL');
const absolutePrivacy = /不上传任何服务器|不上传服务器|数据仅存于本机|完全离线|不需要后端/;
if (absolutePrivacy.test(combined)) fail('absolute offline or no-upload wording remains; use conditional privacy wording');
else process.stdout.write('privacy wording scan: PASS\n');

if (failures.length) {
  console.error('PROJECT VALIDATION FAILED');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}
console.log('PROJECT VALIDATION PASS');
