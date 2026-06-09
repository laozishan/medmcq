import React, { useEffect, useMemo, useState } from 'react';
import { forceCollide, forceLink, forceManyBody, forceSimulation, forceY } from 'd3-force';
import { graphNodeMap, NODE_TYPES } from '../lib/graph.js';

const NODE_WIDTH = 156;
const NODE_HEIGHT = 58;

export function KnowledgeGraph({
  graph,
  activeEvidenceId,
  editable = false,
  onEvidenceHover,
  onNodeLabelChange,
  onNodeDelete,
  onNodeAdd,
  onEdgeLabelChange,
  onGraphReset,
  onLayoutChange,
}) {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedEdgeIndex, setSelectedEdgeIndex] = useState(null);
  const [dragState, setDragState] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [, setDragVersion] = useState(0);
  const layout = useForceLayout(graph);
  const nodeMap = useMemo(() => graphNodeMap(layout.nodes), [layout.nodes]);
  const selectedEdge = selectedEdgeIndex !== null ? layout.edges[selectedEdgeIndex] : null;

  useEffect(() => {
    if (selectedNodeId && !nodeMap[selectedNodeId]) setSelectedNodeId(null);
  }, [nodeMap, selectedNodeId]);

  useEffect(() => {
    if (selectedEdgeIndex !== null && !layout.edges[selectedEdgeIndex]) setSelectedEdgeIndex(null);
  }, [layout.edges, selectedEdgeIndex]);

  function startNodeDrag(event, node) {
    if (event.target.closest?.('.node-inline-input')) return;
    const svg = event.currentTarget.ownerSVGElement;
    const point = svgPoint(svg, event);
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setSelectedEdgeIndex(null);
    setSelectedNodeId(node.id);
    setDragState({
      id: node.id,
      pointerId: event.pointerId,
      offsetX: point.x - node.x,
      offsetY: point.y - node.y,
    });
  }

  function dragNode(event) {
    if (!dragState) return;
    const point = svgPoint(event.currentTarget, event);
    const node = layout.nodes.find((item) => item.id === dragState.id);
    if (!node) return;
    node.x = clamp(point.x - dragState.offsetX, 80, layout.width - 80);
    node.y = clamp(point.y - dragState.offsetY, 40, layout.height - 40);
    setDragVersion((version) => version + 1);
  }

  function stopNodeDrag(event) {
    if (!dragState) return;
    try {
      event.target.releasePointerCapture?.(dragState.pointerId);
    } catch {
      // Some browsers route the pointerup through the parent SVG after capture.
    }
    onLayoutChange?.(exportGraphLayout(layout));
    setDragState(null);
  }

  function deleteNode(event, nodeId) {
    event.preventDefault();
    event.stopPropagation();
    onNodeDelete?.(nodeId);
    setSelectedNodeId(null);
  }

  return (
    <section className="side-panel kg-panel">
      <div className="panel-head compact-head">
        <div>
          <span>Knowledge graph</span>
          <h2>Medical semantic graph</h2>
        </div>
      </div>

      <div className="graph-canvas">
        {editable ? (
          <div className="graph-float-actions" aria-label="Graph edit actions">
            <button
              type="button"
              onClick={() => {
                setDeleteMode(false);
                setAddDialogOpen(true);
              }}
              aria-label="Add graph node"
            >
              Add
            </button>
            <button
              type="button"
              className={deleteMode ? 'active danger' : ''}
              onClick={() => {
                setDeleteMode((current) => !current);
                setAddDialogOpen(false);
              }}
              aria-label="Delete graph node"
            >
              Delete
            </button>
            <button type="button" onClick={onGraphReset} aria-label="Reset graph">
              Reset
            </button>
          </div>
        ) : null}
        <svg
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          role="img"
          aria-label="Knowledge graph"
          onPointerMove={dragNode}
          onPointerUp={stopNodeDrag}
          onPointerCancel={stopNodeDrag}
          onClick={() => {
            setSelectedNodeId(null);
            setSelectedEdgeIndex(null);
          }}
        >
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L7,3 z" fill="#9c9590" />
            </marker>
          </defs>
          {layout.edges.map((edge, index) => {
            const from = nodeMap[edge.from];
            const to = nodeMap[edge.to];
            if (!from || !to) return null;
            const anchors = edgeAnchors(from, to);
            const midX = (anchors.from.x + anchors.to.x) / 2;
            const midY = (anchors.from.y + anchors.to.y) / 2;
            const labelPoint = edgeLabelPoint(anchors.from, anchors.to);
            const active = selectedEdgeIndex === index;
            return (
              <g
                key={`${edge.from}-${edge.to}-${edge.label}-${index}`}
                className={`graph-edge ${active ? 'active' : ''}`}
                onClick={(event) => {
                  event.stopPropagation();
                  if (editable) {
                    setSelectedEdgeIndex(index);
                    setSelectedNodeId(null);
                  }
                }}
              >
                <path d={`M ${anchors.from.x} ${anchors.from.y} C ${midX} ${anchors.from.y}, ${midX} ${anchors.to.y}, ${anchors.to.x} ${anchors.to.y}`} />
                <text x={labelPoint.x} y={labelPoint.y}>{edge.label}</text>
              </g>
            );
          })}
          {layout.nodes.map((node) => {
            const config = NODE_TYPES[node.type] ?? NODE_TYPES.symptom;
            const activeEvidenceIds = Array.isArray(activeEvidenceId)
              ? activeEvidenceId
              : activeEvidenceId
                ? [activeEvidenceId]
                : [];
            const active = activeEvidenceIds.includes(node.id) || node.id === selectedNodeId;
            return (
              <g
                key={node.id}
                className={`graph-node ${active ? 'active' : ''} ${dragState?.id === node.id ? 'dragging' : ''}`}
                transform={`translate(${node.x - NODE_WIDTH / 2} ${node.y - NODE_HEIGHT / 2})`}
                onPointerDown={(event) => startNodeDrag(event, node)}
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedNodeId(node.id);
                  setSelectedEdgeIndex(null);
                }}
                onMouseEnter={(event) => {
                  if (!deleteMode) onEvidenceHover?.(node.id, event);
                }}
                onMouseMove={(event) => {
                  if (!deleteMode) onEvidenceHover?.(node.id, event);
                }}
                onMouseLeave={() => {
                  if (!deleteMode) onEvidenceHover?.(null);
                }}
              >
                <rect width={NODE_WIDTH} height={NODE_HEIGHT} rx="8" fill={config.color} stroke={config.stroke} />
                <foreignObject x="10" y="8" width={NODE_WIDTH - 20} height={NODE_HEIGHT - 16}>
                  {editable && selectedNodeId === node.id && !deleteMode ? (
                    <input
                      className="node-inline-input"
                      value={node.label}
                      onPointerDown={(event) => event.stopPropagation()}
                      onClick={(event) => event.stopPropagation()}
                      onChange={(event) => onNodeLabelChange?.(node.id, event.target.value)}
                      aria-label="Node label"
                    />
                  ) : (
                    <div className="node-label">{node.label}</div>
                  )}
                </foreignObject>
                {deleteMode ? (
                  <g
                    className="graph-node-delete"
                    transform={`translate(${NODE_WIDTH - 14} 10)`}
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => deleteNode(event, node.id)}
                  >
                    <circle r="10" />
                    <text y="4">x</text>
                  </g>
                ) : null}
              </g>
            );
          })}
        </svg>

        {addDialogOpen ? (
          <AddNodeDialog
            nodes={layout.nodes}
            defaultTargetId={selectedNodeId || layout.nodes[0]?.id || ''}
            onClose={() => setAddDialogOpen(false)}
            onAdd={(payload) => {
              onNodeAdd?.(payload);
              setAddDialogOpen(false);
            }}
          />
        ) : null}
      </div>

      <div className="legend graph-legend" aria-label="Node type legend">
        {Object.entries(NODE_TYPES).map(([type, config]) => (
          <span key={type}>
            <i style={{ background: config.color, borderColor: config.stroke }} />
            {config.label}
          </span>
        ))}
      </div>

      {editable && selectedEdge ? (
        <div className="edge-edit-strip">
          <span>Relation</span>
          <input
            value={selectedEdge.label}
            onChange={(event) => onEdgeLabelChange?.(selectedEdgeIndex, event.target.value)}
            aria-label="Selected edge relation"
          />
        </div>
      ) : null}
    </section>
  );
}

function AddNodeDialog({ nodes, defaultTargetId, onClose, onAdd }) {
  const [label, setLabel] = useState('');
  const [type, setType] = useState('symptom');
  const [targetId, setTargetId] = useState(defaultTargetId);
  const [relation, setRelation] = useState('associated_with');
  const [direction, setDirection] = useState('existing-to-new');

  useEffect(() => {
    setTargetId(defaultTargetId);
  }, [defaultTargetId]);

  function submit(event) {
    event.preventDefault();
    onAdd({
      label: label.trim() || 'New node',
      type,
      connectNodeId: targetId,
      relation: targetId ? relation.trim() || 'associated_with' : '',
      direction,
    });
  }

  return (
    <div className="graph-popover-backdrop" onClick={onClose}>
      <form className="graph-node-dialog" onSubmit={submit} onClick={(event) => event.stopPropagation()}>
        <div className="modal-head">
          <h2>Add node</h2>
          <button type="button" onClick={onClose}>Close</button>
        </div>

        <label className="field">
          <span>Node label</span>
          <input value={label} onChange={(event) => setLabel(event.target.value)} autoFocus />
        </label>

        <label className="field">
          <span>Node type</span>
          <select value={type} onChange={(event) => setType(event.target.value)}>
            {Object.entries(NODE_TYPES).map(([nodeType, config]) => (
              <option key={nodeType} value={nodeType}>{config.label}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Connect to</span>
          <select value={targetId} onChange={(event) => setTargetId(event.target.value)}>
            <option value="">No connection yet</option>
            {nodes.map((node) => (
              <option key={node.id} value={node.id}>{node.label}</option>
            ))}
          </select>
        </label>

        <div className="graph-dialog-row">
          <label className="field">
            <span>Direction</span>
            <select value={direction} onChange={(event) => setDirection(event.target.value)} disabled={!targetId}>
              <option value="existing-to-new">existing to new</option>
              <option value="new-to-existing">new to existing</option>
            </select>
          </label>
          <label className="field">
            <span>Relation</span>
            <input
              value={relation}
              onChange={(event) => setRelation(event.target.value)}
              disabled={!targetId}
            />
          </label>
        </div>

        <button className="primary-action compact-action" type="submit">Add to graph</button>
      </form>
    </div>
  );
}

function useForceLayout(graph) {
  return useMemo(() => {
    const nodes = (graph.nodes ?? []).map((node) => ({ ...node }));
    const edges = graph.edges ?? [];

    if (!nodes.length) {
      return { width: 860, height: 460, nodes, edges };
    }

    const width = 900;
    const maxLayerCount = 4;
    const rowGap = 28;
    const rowStep = NODE_HEIGHT + rowGap;
    const nodeById = Object.fromEntries(nodes.map((node) => [node.id, node]));
    const layerMap = {
      symptom: 0,
      sign: 0,
      history: 0,
      exam: 0,
      investigation: 0,
      mechanism: 1,
      anatomy: 2,
      diagnosis: 3,
    };

    for (const node of nodes) {
      node.layer = layerMap[node.type] ?? 0;
    }

    // Keep arrows reading left-to-right. If a higher-layer node points to a
    // lower-layer node, place it in the target layer instead of drawing a
    // visually backwards edge.
    for (const edge of edges) {
      const from = nodeById[edge.from];
      const to = nodeById[edge.to];
      if (from && to && from.layer > to.layer) from.layer = to.layer;
    }

    const usedLayers = [...new Set(nodes.map((node) => node.layer))]
      .filter((layer) => layer >= 0 && layer < maxLayerCount)
      .sort((a, b) => a - b);
    const layerRemap = Object.fromEntries(usedLayers.map((layer, index) => [layer, index]));
    for (const node of nodes) {
      node.layer = layerRemap[node.layer] ?? 0;
    }

    const layerCount = Math.max(1, usedLayers.length);
    const columnPadding = 96;
    const columnSpacing = layerCount > 1 ? (width - columnPadding * 2) / (layerCount - 1) : 0;
    const columnX = Array.from({ length: layerCount }, (_, index) => columnPadding + index * columnSpacing);
    const layerNodes = makeLayerNodes(nodes, layerCount);
    const maxLayerSize = Math.max(1, ...layerNodes.map((items) => items.length));
    const height = clamp(maxLayerSize * rowStep + 140, 460, 700);

    placeLayers(layerNodes, columnX, height, rowStep, rowGap);

    for (let pass = 0; pass < 6; pass += 1) {
      for (let layer = 1; layer < layerCount; layer += 1) {
        barycentricSortLayer(layerNodes, layer, edges, nodeById, height, rowStep, rowGap);
      }
      for (let layer = layerCount - 2; layer >= 0; layer -= 1) {
        barycentricSortLayer(layerNodes, layer, edges, nodeById, height, rowStep, rowGap);
      }
    }

    for (const node of nodes) {
      node.fx = columnX[node.layer];
      node.targetY = node.y;
    }

    const links = edges.map((edge) => ({ ...edge, source: edge.from, target: edge.to }));

    const simulation = forceSimulation(nodes)
      .force('link', forceLink(links).id((node) => node.id).distance(rowStep * 1.45).strength(0.08))
      .force('charge', forceManyBody().strength(-520))
      .force('collide', forceCollide(48).strength(1))
      .force('y', forceY((node) => node.targetY).strength(0.22))
      .stop();

    for (let i = 0; i < 300; i += 1) simulation.tick();

    applyStoredNodeLayout(nodes, graph.layout);

    for (const node of nodes) {
      node.x = columnX[node.layer];
      node.y = clamp(node.y, 50, height - 50);
      delete node.fx;
    }

    resolveLayerCollisions(layerNodes, height, rowStep);
    applyStoredNodeLayout(nodes, graph.layout);

    return { width, height, nodes, edges };
  }, [graph]);
}

function exportGraphLayout(layout) {
  return {
    width: layout.width,
    height: layout.height,
    nodes: Object.fromEntries(
      layout.nodes.map((node) => [
        node.id,
        { x: Math.round(node.x), y: Math.round(node.y) },
      ]),
    ),
  };
}

function applyStoredNodeLayout(nodes, storedLayout) {
  const storedNodes = storedLayout?.nodes;
  if (!storedNodes) return;

  for (const node of nodes) {
    const position = storedNodes[node.id];
    if (typeof position?.x === 'number' && typeof position?.y === 'number') {
      node.x = position.x;
      node.y = position.y;
      node.targetY = position.y;
    }
  }
}

function makeLayerNodes(nodes, layerCount) {
  return Array.from({ length: layerCount }, (_, layer) =>
    nodes.filter((node) => node.layer === layer),
  );
}

function placeLayers(layerNodes, columnX, height, rowStep, rowGap) {
  for (const [layer, items] of layerNodes.entries()) {
    const totalHeight = Math.max(0, items.length * rowStep - rowGap);
    const startY = (height - totalHeight) / 2 + NODE_HEIGHT / 2;
    items.forEach((node, index) => {
      node.x = columnX[layer];
      node.y = startY + index * rowStep;
    });
  }
}

function barycentricSortLayer(layerNodes, layer, edges, nodeById, height, rowStep, rowGap) {
  const items = layerNodes[layer];
  if (items.length <= 1) return;

  for (const node of items) {
    const neighbors = edges
      .filter((edge) => edge.from === node.id || edge.to === node.id)
      .map((edge) => nodeById[edge.from === node.id ? edge.to : edge.from])
      .filter((neighbor) => neighbor && neighbor.layer !== node.layer);
    node.barycenter = neighbors.length
      ? neighbors.reduce((sum, neighbor) => sum + neighbor.y, 0) / neighbors.length
      : node.y;
  }

  items.sort((a, b) => a.barycenter - b.barycenter);
  const totalHeight = Math.max(0, items.length * rowStep - rowGap);
  const startY = (height - totalHeight) / 2 + NODE_HEIGHT / 2;
  items.forEach((node, index) => {
    node.y = startY + index * rowStep;
    node.targetY = node.y;
  });
}

function resolveLayerCollisions(layerNodes, height, rowStep) {
  for (const items of layerNodes) {
    const ordered = [...items].sort((a, b) => a.y - b.y);
    for (let index = 1; index < ordered.length; index += 1) {
      const previous = ordered[index - 1];
      const current = ordered[index];
      if (current.y - previous.y < rowStep) current.y = previous.y + rowStep;
    }

    const overflow = (ordered.at(-1)?.y ?? 0) - (height - 50);
    if (overflow > 0) {
      for (const node of ordered) node.y -= overflow;
    }

    for (const node of ordered) {
      node.y = clamp(node.y, 50, height - 50);
    }
  }
}

function edgeLabelPoint(from, to) {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy) || 1;
  const normalX = -dy / length;
  const normalY = dx / length;
  return {
    x: midX + normalX * 16,
    y: midY + normalY * 16,
  };
}

function edgeAnchors(from, to) {
  if (Math.abs(from.x - to.x) < 4) {
    const topToBottom = from.y <= to.y;
    return {
      from: {
        x: from.x,
        y: from.y + (topToBottom ? NODE_HEIGHT / 2 : -NODE_HEIGHT / 2),
      },
      to: {
        x: to.x,
        y: to.y + (topToBottom ? -NODE_HEIGHT / 2 : NODE_HEIGHT / 2),
      },
    };
  }

  const leftToRight = from.x <= to.x;
  return {
    from: {
      x: from.x + (leftToRight ? NODE_WIDTH / 2 : -NODE_WIDTH / 2),
      y: from.y,
    },
    to: {
      x: to.x + (leftToRight ? -NODE_WIDTH / 2 : NODE_WIDTH / 2),
      y: to.y,
    },
  };
}

function svgPoint(svg, event) {
  const point = svg.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;
  return point.matrixTransform(svg.getScreenCTM().inverse());
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
