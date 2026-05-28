import React, { useEffect, useMemo, useState } from 'react';

export function DistractorMiniGraphs({ question, onEvidenceHover }) {
  const evidenceNodes = (question.graph.nodes ?? []).filter((node) => node.type === 'evidence');
  const distractors = question.options.filter((option) => option.id !== question.correctOptionId);

  return (
    <section className="side-panel mini-graphs-panel">
      <div className="panel-head">
        <div>
          <span>Distractor mini graphs</span>
          <h2>Why alternatives are excluded</h2>
        </div>
      </div>
      <div className="mini-graph-grid">
        {distractors.map((option, index) => (
          <DraggableMiniGraph
            key={option.id}
            option={option}
            index={index}
            question={question}
            evidenceNodes={evidenceNodes}
            onEvidenceHover={onEvidenceHover}
          />
        ))}
      </div>
    </section>
  );
}

function DraggableMiniGraph({ option, index, question, evidenceNodes, onEvidenceHover }) {
  const usableEvidence = evidenceNodes.length
    ? evidenceNodes
    : [{ id: `fallback-${option.id}`, label: 'Case clue' }];
  const firstEvidence = usableEvidence[index % usableEvidence.length];
  const secondEvidence = usableEvidence[(index + 1) % usableEvidence.length];
  const initialNodes = useMemo(
    () => ({
      first: { x: 36, y: 26, width: 118, label: firstEvidence.label, type: 'evidence', evidenceId: firstEvidence.id },
      second: { x: 36, y: 112, width: 118, label: secondEvidence.label, type: 'evidence', evidenceId: secondEvidence.id },
      distractor: { x: 190, y: 69, width: 104, label: option.text, type: 'distractor' },
    }),
    [firstEvidence.id, firstEvidence.label, option.text, secondEvidence.id, secondEvidence.label],
  );
  const [nodes, setNodes] = useState(initialNodes);
  const [dragState, setDragState] = useState(null);

  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes]);

  function startDrag(event, nodeKey) {
    const svg = event.currentTarget.ownerSVGElement;
    const point = svgPoint(svg, event);
    event.preventDefault();
    event.stopPropagation();
    svg.setPointerCapture?.(event.pointerId);
    setDragState({
      nodeKey,
      pointerId: event.pointerId,
      offsetX: point.x - nodes[nodeKey].x,
      offsetY: point.y - nodes[nodeKey].y,
    });
  }

  function dragNode(event) {
    if (!dragState) return;
    const point = svgPoint(event.currentTarget, event);
    setNodes((current) => ({
      ...current,
      [dragState.nodeKey]: {
        ...current[dragState.nodeKey],
        x: clamp(point.x - dragState.offsetX, 8, 300 - current[dragState.nodeKey].width),
        y: clamp(point.y - dragState.offsetY, 8, 134),
      },
    }));
  }

  function stopDrag(event) {
    if (!dragState) return;
    event.currentTarget.releasePointerCapture?.(dragState.pointerId);
    setDragState(null);
  }

  const firstAnchor = rightAnchor(nodes.first);
  const secondAnchor = rightAnchor(nodes.second);
  const distractorAnchor = leftAnchor(nodes.distractor);
  const firstMid = midPoint(firstAnchor, distractorAnchor);
  const secondMid = midPoint(secondAnchor, distractorAnchor);

  return (
    <article className="mini-graph-card">
      <div className="mini-graph-head">
        <strong>{option.id}. {option.text}</strong>
        <span>Excluded</span>
      </div>
      <svg
        viewBox="0 0 320 190"
        aria-label={`Mini graph for option ${option.id}`}
        onPointerMove={dragNode}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
      >
        <MiniNode
          nodeKey="first"
          dragging={dragState?.nodeKey === 'first'}
          node={nodes.first}
          onPointerDown={startDrag}
          onEvidenceHover={onEvidenceHover}
        />
        <MiniNode
          nodeKey="second"
          dragging={dragState?.nodeKey === 'second'}
          node={nodes.second}
          onPointerDown={startDrag}
          onEvidenceHover={onEvidenceHover}
        />
        <MiniNode
          nodeKey="distractor"
          dragging={dragState?.nodeKey === 'distractor'}
          node={nodes.distractor}
          onPointerDown={startDrag}
          onEvidenceHover={onEvidenceHover}
        />
        <path d={`M ${firstAnchor.x} ${firstAnchor.y} C ${firstMid.x} ${firstAnchor.y}, ${firstMid.x} ${distractorAnchor.y}, ${distractorAnchor.x} ${distractorAnchor.y}`} />
        <path d={`M ${secondAnchor.x} ${secondAnchor.y} C ${secondMid.x} ${secondAnchor.y}, ${secondMid.x} ${distractorAnchor.y}, ${distractorAnchor.x} ${distractorAnchor.y}`} />
        <text x={firstMid.x} y={firstMid.y - 8}>against</text>
        <text x={secondMid.x} y={secondMid.y + 16}>against</text>
      </svg>
      <p>{question.explanation.distractors[option.id]}</p>
      <div className="mini-evidence-row">
        {evidenceNodes.slice(0, 3).map((node) => (
          <button
            key={node.id}
            type="button"
            onMouseEnter={() => onEvidenceHover(node.id)}
            onMouseLeave={() => onEvidenceHover(null)}
          >
            {node.label}
          </button>
        ))}
      </div>
    </article>
  );
}

function MiniNode({ nodeKey, node, dragging, onPointerDown, onEvidenceHover }) {
  const { x, y, width, label, type, evidenceId } = node;
  const fill = type === 'distractor' ? '#f8eaea' : '#fff7d8';
  const stroke = type === 'distractor' ? '#8a2d2d' : '#c48a1d';

  return (
    <g
      className={`mini-draggable-node ${dragging ? 'dragging' : ''}`}
      transform={`translate(${x} ${y})`}
      onPointerDown={(event) => onPointerDown(event, nodeKey)}
      onMouseEnter={() => evidenceId && onEvidenceHover(evidenceId)}
      onMouseLeave={() => evidenceId && onEvidenceHover(null)}
    >
      <rect width={width} height="48" rx="8" fill={fill} stroke={stroke} />
      <foreignObject x="8" y="8" width={width - 16} height="32">
        <div className="mini-node-label">{label}</div>
      </foreignObject>
    </g>
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

function rightAnchor(node) {
  return { x: node.x + node.width, y: node.y + 24 };
}

function leftAnchor(node) {
  return { x: node.x, y: node.y + 24 };
}

function midPoint(a, b) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}
