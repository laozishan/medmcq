import { readFile } from 'node:fs/promises';
import path from 'node:path';

const questionsPath = path.resolve(import.meta.dirname, '..', 'src', 'data', 'questions.json');
const questions = JSON.parse(await readFile(questionsPath, 'utf8'));

if (!Array.isArray(questions) || questions.length === 0) {
  throw new Error('questions.json must contain at least one question.');
}

const ids = new Set();

for (const question of questions) {
  const context = question.id ?? '(missing id)';
  if (!question.id || ids.has(question.id)) throw new Error(`Invalid or duplicate question id: ${context}`);
  ids.add(question.id);

  for (const key of ['title', 'domain', 'topic', 'difficulty', 'vignette', 'stem', 'correctOptionId']) {
    if (!question[key]) throw new Error(`${context} is missing ${key}.`);
  }

  if (!Array.isArray(question.options) || question.options.length !== 5) {
    throw new Error(`${context} must define exactly five options.`);
  }
  if (!question.options.some((option) => option.id === question.correctOptionId)) {
    throw new Error(`${context} correctOptionId does not match any option.`);
  }

  if (!question.explanation?.whyCorrect || !Array.isArray(question.explanation?.evidence)) {
    throw new Error(`${context} explanation is incomplete.`);
  }

  const graph = question.graph;
  if (!Array.isArray(graph?.nodes) || !Array.isArray(graph?.edges)) {
    throw new Error(`${context} graph must define nodes and edges.`);
  }

  const nodeIds = new Set(graph.nodes.map((node) => node.id));
  for (const node of graph.nodes) {
    if (!node.id || !node.type || !node.label) {
      throw new Error(`${context} has an incomplete graph node.`);
    }
  }
  for (const edge of graph.edges) {
    if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) {
      throw new Error(`${context} graph edge references a missing node: ${edge.from} -> ${edge.to}`);
    }
  }
}

console.log(`Smoke test passed: ${questions.length} JSON-driven questions and graphs are valid.`);
