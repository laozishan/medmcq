export const NODE_TYPES = {
  symptom: { label: 'Symptom', color: '#e3f2fd', stroke: '#1976b9', column: 0 },
  sign: { label: 'Sign', color: '#dff6ea', stroke: '#11845b', column: 0 },
  history: { label: 'History/Risk', color: '#fff0cf', stroke: '#c56a00', column: 0 },
  exam: { label: 'Exam', color: '#e7eaff', stroke: '#4f5bd5', column: 0 },
  investigation: { label: 'Investigation', color: '#ffe3f1', stroke: '#b4347b', column: 0 },
  mechanism: { label: 'Mechanism', color: '#efe4ff', stroke: '#7c3fb4', column: 1 },
  anatomy: { label: 'Anatomy/Localization', color: '#edf1f5', stroke: '#60717f', column: 2 },
  diagnosis: { label: 'Diagnosis', color: '#e2f4dc', stroke: '#2e7d32', column: 3 },
};

export function layoutGraph(graph) {
  const nodes = graph.nodes ?? [];
  const columns = [0, 1, 2, 3].map((column) =>
    nodes.filter((node) => (NODE_TYPES[node.type]?.column ?? 0) === column),
  );
  const width = 920;
  const height = Math.max(520, Math.max(...columns.map((column) => column.length), 1) * 86 + 80);
  const columnX = [125, 360, 595, 805];

  const positioned = columns.flatMap((column, columnIndex) => {
    const gap = height / (column.length + 1);
    return column.map((node, nodeIndex) => ({
      ...node,
      x: columnX[columnIndex],
      y: Math.round(gap * (nodeIndex + 1)),
    }));
  });

  return { width, height, nodes: positioned, edges: graph.edges ?? [] };
}

export function graphNodeMap(nodes) {
  return Object.fromEntries(nodes.map((node) => [node.id, node]));
}

export function phrasesFromGraph(graph) {
  return (graph.nodes ?? [])
    .filter((node) => node.phrase)
    .map((node) => ({ id: node.id, phrase: node.phrase, persistent: true }));
}

export function phrasesFromMiniGraphs(miniGraphs = []) {
  return miniGraphs.flatMap((miniGraph) =>
    MINI_ROLE_ORDER.flatMap((role) =>
      (miniGraph[role] ?? [])
        .map((item, index) => ({
          id: miniEvidenceKey(miniGraph.optionId, role, index, item.label),
          phrase: item.phrase ?? item.evidencePhrase,
          persistent: false,
        }))
        .filter((item) => item.phrase),
    ),
  );
}

export function miniEvidenceKey(optionId, role, index, label) {
  return `${optionId}-${role}-${index}-${label}`;
}

const MINI_ROLE_ORDER = ['supports', 'weakens', 'contradicts', 'missing'];
