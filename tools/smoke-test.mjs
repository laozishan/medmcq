import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { JSDOM, VirtualConsole } from 'jsdom';
import { prototypeHtml } from '../src/prototypeMarkup.js';

const runtimePath = path.resolve(import.meta.dirname, '..', 'public', 'prototype-runtime.js');
const runtime = await readFile(runtimePath, 'utf8');
const virtualConsole = new VirtualConsole();
const errors = [];

virtualConsole.on('error', (message) => errors.push(String(message)));
virtualConsole.on('jsdomError', (error) => errors.push(error.message));

const dom = new JSDOM(`<!doctype html><html><body>${prototypeHtml}</body></html>`, {
  pretendToBeVisual: true,
  runScripts: 'outside-only',
  url: 'http://127.0.0.1:4173/',
  virtualConsole,
});

dom.window.alert = (message) => errors.push(`alert: ${message}`);
dom.window.eval(runtime);

const mustHaveGlobals = ['startStudy', 'loadTask', 'acceptQuestion', 'openBank', 'openRegenerate'];
for (const name of mustHaveGlobals) {
  if (typeof dom.window[name] !== 'function') {
    throw new Error(`Missing runtime global: ${name}`);
  }
}

dom.window.startStudy();
if (dom.window.document.getElementById('appPage').style.display !== 'block') {
  throw new Error('App page did not open after startStudy().');
}

for (const taskId of [1, 2, 3]) {
  dom.window.loadTask(taskId);
  const stem = dom.window.document.getElementById('stem').textContent.trim();
  const options = dom.window.document.querySelectorAll('#options .option');
  if (!stem || options.length !== 5) {
    throw new Error(`Task ${taskId} did not render a stem with five options.`);
  }
}

dom.window.acceptQuestion();
const bank = JSON.parse(dom.window.localStorage.getItem('resp_mcq_bank') ?? '[]');
if (bank.length !== 1) {
  throw new Error('acceptQuestion() did not persist a question to localStorage.');
}

dom.window.openBank();
if (!dom.window.document.getElementById('bankModal').classList.contains('open')) {
  throw new Error('Question bank modal did not open.');
}

if (errors.length) {
  throw new Error(`Runtime emitted errors:\n${errors.join('\n')}`);
}

console.log('Smoke test passed: setup, task rendering, accept flow, and bank modal work.');
