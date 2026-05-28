import React, { useMemo, useState } from 'react';
import { graphNodeMap, layoutGraph, NODE_TYPES } from '../lib/graph.js';

export function KnowledgeGraph({
  graph,
  activeEvidenceId,
  editable = false,
  onEvidenceHover,
  onNodeLabelChange,
  onNodeDelete,
}) {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [nodePositions, setNodePositions] = useState({});
  const [dragState, setDragState] = useState(null);
  const layout = useMemo(() => layoutGraph(graph), [graph]);
  const positionedNodes = useMemo(
    () => layout.nodes.map((node) => ({ ...node, ...(nodePositions[node.id] ?? {}) })),
    [layout.nodes, nodePositions],
  );
  const nodeMap = useMemo(() => graphNodeMap(positionedNodes), [positionedNodes]);
  const selectedNode = selectedNodeId ? nodeMap[selectedNodeId] : null;

  function startNodeDrag(event, node) {
    const svg = event.currentTarget.ownerSVGElement;
    const point = svgPoint(svg, event);
    event.preventDefault();
    event.stopPropagation();
    svg.setPointerCapture?.(event.pointerId);
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
    setNodePositions((current) => ({
      ...current,
      [dragState.id]: {
        x: clamp(point.x - dragState.offsetX, 84, layout.width - 84),
        y: clamp(point.y - dragState.offsetY, 38, layout.height - 38),
      },
    }));
  }

  function stopNodeDrag(event) {
    if (!dragState) return;
    event.currentTarget.releasePointerCapture?.(dragState.pointerId);
    setDragState(null);
  }

  return (
    <section className="side-panel kg-panel">
      <div className="panel-head">
        <div>
          <span>Knowledge graph</span>
          <h2>Nodes and relations from JSON</h2>
        </div>
        <div className="legend">
          {Object.entries(NODE_TYPES).map(([type, config]) => (
            <span key={type}>
              <i style={{ background: config.color, borderColor: config.stroke }} />
              {config.label}
            </span>
          ))}
        </div>
      </div>

      <div className="graph-canvas">
        <svg
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          role="img"
          aria-label="Knowledge graph"
          onPointerMove={dragNode}
          onPointerUp={stopNodeDrag}
          onPointerCancel={stopNodeDrag}
        >
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L7,3 z" fill="#9c9590" />
            </marker>
          </defs>
          {layout.edges.map((edge) => {
            const from = nodeMap[edge.from];
            const to = nodeMap[edge.to];
            if (!from || !to) return null;
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;
            return (
              <g key={`${edge.from}-${edge.to}-${edge.label}`} className="graph-edge">
                <path d={`M ${from.x + 72} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x - 72} ${to.y}`} />
                <text x={midX} y={midY - 8}>{edge.label}</text>
                {edge.tooltip ? <title>{edge.tooltip}</title> : null}
              </g>
            );
          })}
          {positionedNodes.map((node) => {
            const config = NODE_TYPES[node.type] ?? NODE_TYPES.finding;
            const active = node.id === activeEvidenceId || node.id === selectedNodeId;
            return (
              <g
                key={node.id}
                className={`graph-node ${active ? 'active' : ''} ${dragState?.id === node.id ? 'dragging' : ''}`}
                transform={`translate(${node.x - 72} ${node.y - 31})`}
                onPointerDown={(event) => startNodeDrag(event, node)}
                onClick={() => setSelectedNodeId(node.id)}
                onMouseEnter={() => node.type === 'evidence' && onEvidenceHover(node.id)}
                onMouseLeave={() => node.type === 'evidence' && onEvidenceHover(null)}
              >
                <rect width="144" height="62" rx="8" fill={config.color} stroke={config.stroke} />
                <text x="72" y="24">{config.label}</text>
                <foreignObject x="12" y="29" width="120" height="26">
                  <div className="node-label">{node.label}</div>
                </foreignObject>
                {node.tooltip ? <title>{node.tooltip}</title> : null}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="node-inspector">
        {selectedNode ? (
          <>
            <span>{NODE_TYPES[selectedNode.type]?.label ?? 'Node'}</span>
            <h3>{selectedNode.label}</h3>
            <p>{selectedNode.tooltip ?? 'This node is defined in the question graph JSON.'}</p>
            {editable ? (
              <div className="node-edit-tools">
                <label className="field">
                  <span>Node label</span>
                  <input
                    value={selectedNode.label}
                    onChange={(event) => onNodeLabelChange(selectedNode.id, event.target.value)}
                  />
                </label>
                <button className="danger-action" type="button" onClick={() => {
                  onNodeDelete(selectedNode.id);
                  setSelectedNodeId(null);
                }}>
                  Delete node and linked vignette phrase
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <p>Select a node to inspect the data behind it.</p>
        )}
      </div>
    </section>
  );
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
