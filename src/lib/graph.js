export const NODE_TYPES = {
  evidence: { label: 'Evidence', color: '#fff7d8', stroke: '#c48a1d' },
  finding: { label: 'Finding', color: '#eaf1f8', stroke: '#2d5f8a' },
  mechanism: { label: 'Mechanism', color: '#f3edff', stroke: '#7b4da0' },
  diagnosis: { label: 'Diagnosis', color: '#edf7f2', stroke: '#1a6b3c' },
};

export function layoutGraph(graph) {
  const nodes = graph.nodes ?? [];
  const byType = ['evidence', 'finding', 'mechanism', 'diagnosis'];
  const columns = byType.map((type) => nodes.filter((node) => node.type === type));
  const width = 920;
  const height = 520;
  const columnX = [120, 365, 600, 800];

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
    .map((node) => ({ id: node.id, phrase: node.phrase }));
}
