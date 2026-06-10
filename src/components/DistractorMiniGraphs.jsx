import React, { useEffect, useMemo, useState } from 'react';
import { miniEvidenceKey } from '../lib/graph.js';

const MINI_NODE_WIDTH = 150;
const MINI_NODE_HEIGHT = 62;
const OPTION_WIDTH = 150;
const OPTION_HEIGHT = 70;

const ROLE_CONFIG = {
  supports: { label: 'supports', fill: '#e7f6ef', stroke: '#1f7a55', text: '#145b3e' },
  weakens: { label: 'weakens', fill: '#fff0df', stroke: '#c46a1e', text: '#8a4612' },
  contradicts: { label: 'rules out', fill: '#f8e6e6', stroke: '#a23a3a', text: '#842929' },
  missing: { label: 'missing', fill: '#f7f7f7', stroke: '#777777', text: '#555555', dash: '5 4' },
};

const ROLE_ORDER = ['supports', 'weakens', 'contradicts', 'missing'];

export function DistractorMiniGraphs({
  question,
  editable = false,
  onEvidenceHover,
  onMiniGraphChange,
  onMiniGraphReset,
}) {
  const miniGraphs = question.miniGraphs ?? buildFallbackMiniGraphs(question);

  return (
    <section className="side-panel mini-graphs-panel">
      <div className="panel-head compact-head">
        <div>
          <span>Distractor mini graphs</span>
        </div>
      </div>
      <div className="mini-graph-grid">
        {miniGraphs.map((miniGraph) => (
          <MiniGraphCard
            key={miniGraph.optionId}
            miniGraph={miniGraph}
            editable={editable}
            onEvidenceHover={onEvidenceHover}
            onMiniGraphChange={onMiniGraphChange}
            onMiniGraphReset={onMiniGraphReset}
          />
        ))}
      </div>
    </section>
  );
}

function MiniGraphCard({
  miniGraph,
  editable,
  onEvidenceHover,
  onMiniGraphChange,
  onMiniGraphReset,
}) {
  const layout = useMiniLayerLayout(miniGraph);
  const [editMode, setEditMode] = useState(false);
  const [dialogState, setDialogState] = useState(null);

  useEffect(() => {
    setEditMode(false);
    setDialogState(null);
  }, [miniGraph.optionId]);

  const changeMiniGraph = (nextMiniGraph) => {
    onMiniGraphChange?.(miniGraph.optionId, nextMiniGraph);
  };

  const addMiniItem = (payload) => {
    const next = {
      ...miniGraph,
      [payload.role]: [
        ...(miniGraph[payload.role] ?? []),
        {
          label: payload.label,
          tooltip: payload.tooltip,
          ...(payload.phrase ? { phrase: payload.phrase } : {}),
        },
      ],
    };
    changeMiniGraph(next);
  };

  const updateMiniItem = (item, payload) => {
    const next = { ...miniGraph };
    const sourceRole = item.role;
    const sourceItems = [...(miniGraph[sourceRole] ?? [])];
    const original = sourceItems[item.sourceIndex] ?? {};
    sourceItems.splice(item.sourceIndex, 1);
    next[sourceRole] = sourceItems;
    if (!next[sourceRole].length) delete next[sourceRole];

    const targetItems = payload.role === sourceRole ? sourceItems : [...(miniGraph[payload.role] ?? [])];
    const targetItem = {
      ...original,
      label: payload.label,
      tooltip: payload.tooltip,
    };
    if (Object.prototype.hasOwnProperty.call(payload, 'phrase')) {
      if (payload.phrase) targetItem.phrase = payload.phrase;
      else {
        delete targetItem.phrase;
        delete targetItem.evidencePhrase;
      }
    }
    if (payload.role === sourceRole) {
      targetItems.splice(item.sourceIndex, 0, targetItem);
    } else {
      targetItems.push(targetItem);
    }
    next[payload.role] = targetItems;
    changeMiniGraph(next);
  };

  const deleteMiniItem = (item) => {
    const nextItems = [...(miniGraph[item.role] ?? [])];
    nextItems.splice(item.sourceIndex, 1);
    const next = { ...miniGraph, [item.role]: nextItems };
    if (!nextItems.length) delete next[item.role];
    changeMiniGraph(next);
  };

  return (
    <article className="mini-graph-card">
      <div className="mini-graph-head">
        <strong>{miniGraph.optionId}. {miniGraph.optionText}</strong>
      </div>

      {editable ? (
        <div className="mini-graph-tools" aria-label="Mini graph edit actions">
          <button
            type="button"
            className={editMode ? 'active' : ''}
            onClick={() => {
              setEditMode((current) => !current);
              setDialogState(null);
            }}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => {
              setEditMode(false);
              setDialogState(null);
              onMiniGraphReset?.(miniGraph.optionId);
            }}
          >
            Reset
          </button>
        </div>
      ) : null}

      <svg
        className="mini-graph-svg"
        style={{ height: layout.height }}
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        aria-label={`Mini graph for ${miniGraph.optionText}`}
        onDoubleClick={(event) => {
          if (!editable || !editMode) return;
          if (event.target !== event.currentTarget) return;
          event.preventDefault();
          setDialogState({ mode: 'add' });
        }}
      >
        <MiniOptionNode option={layout.option} />
        {layout.nodes.map((item) => (
          <MiniEvidenceEdge
            key={`edge-${item.key}`}
            item={item}
            option={layout.option}
            editable={editable}
            editMode={editMode}
            onEdit={() => setDialogState({ mode: 'edit', item })}
          />
        ))}
        {layout.nodes.map((item) => (
          <MiniEvidenceNode
            key={item.key}
            item={item}
            miniGraph={miniGraph}
            editable={editable}
            editMode={editMode}
            onEdit={() => setDialogState({ mode: 'edit', item })}
            onDelete={() => deleteMiniItem(item)}
            onEvidenceHover={onEvidenceHover}
          />
        ))}
      </svg>

      <div className="mini-legend-row">
        {ROLE_ORDER.map((role) => {
          const config = ROLE_CONFIG[role];
          const count = miniGraph[role]?.length ?? 0;
          if (!count) return null;
          return (
            <span key={role} style={{ color: config.text }}>
              <i style={{ background: config.fill, borderColor: config.stroke }} />
              {config.label}
            </span>
          );
        })}
      </div>
      {miniGraph.summary ? <p>{miniGraph.summary}</p> : null}
      {dialogState ? (
        <MiniNodeDialog
          mode={dialogState.mode}
          item={dialogState.item}
          onClose={() => setDialogState(null)}
          onSubmit={(payload) => {
            if (dialogState.mode === 'edit') updateMiniItem(dialogState.item, payload);
            else addMiniItem(payload);
            setDialogState(null);
          }}
        />
      ) : null}
    </article>
  );
}

function MiniOptionNode({ option }) {
  return (
    <g
      className="mini-option-node"
      transform={`translate(${option.x} ${option.y})`}
    >
      <rect width={OPTION_WIDTH} height={OPTION_HEIGHT} rx="10" fill="#f7f3ef" stroke="#8c8178" />
      <foreignObject x="9" y="9" width={OPTION_WIDTH - 18} height={OPTION_HEIGHT - 18}>
        <div className="mini-node-label">{option.label}</div>
      </foreignObject>
    </g>
  );
}

function MiniEvidenceEdge({ item, option, editable, editMode, onEdit }) {
  const config = ROLE_CONFIG[item.role];
  const fromX = item.x + MINI_NODE_WIDTH;
  const fromY = item.y + MINI_NODE_HEIGHT / 2;
  const toX = option.x;
  const toY = option.y + OPTION_HEIGHT / 2;
  const midX = fromX + (toX - fromX) * 0.55;
  const midY = fromY + (toY - fromY) * 0.55;
  const label = edgeLabelPoint(fromX, fromY, toX, toY, item.edgeOffset);

  return (
    <g
      className="mini-edge"
      onDoubleClick={(event) => {
        if (!editable || !editMode) return;
        event.preventDefault();
        event.stopPropagation();
        onEdit?.();
      }}
    >
      <path
        d={`M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`}
        stroke={config.stroke}
        strokeDasharray={config.dash}
      />
      <text x={label.x} y={label.y} fill={config.text}>{config.label}</text>
    </g>
  );
}

function MiniEvidenceNode({
  item,
  miniGraph,
  editable,
  editMode,
  onEdit,
  onDelete,
  onEvidenceHover,
}) {
  const config = ROLE_CONFIG[item.role];
  const evidenceTarget = evidenceTargetIds(item);
  const hoverNode = {
    id: item.key,
    type: 'symptom',
    label: item.label,
    tooltip: buildMiniTooltip(item, miniGraph),
    hoverLabel: config.label,
    hoverColor: config.stroke,
    highlightRole: item.role,
  };

  return (
    <g
      className="mini-evidence-node"
      transform={`translate(${item.x} ${item.y})`}
      onClick={(event) => {
        if (!editable || !editMode) return;
        event.preventDefault();
        event.stopPropagation();
        onEdit();
      }}
      onDoubleClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onMouseEnter={(event) => {
        if (!editMode) onEvidenceHover?.(evidenceTarget, event, hoverNode);
      }}
      onMouseMove={(event) => {
        if (!editMode) onEvidenceHover?.(evidenceTarget, event, hoverNode);
      }}
      onMouseLeave={() => {
        if (!editMode) onEvidenceHover?.(null);
      }}
    >
      <rect
        width={MINI_NODE_WIDTH}
        height={MINI_NODE_HEIGHT}
        rx="9"
        fill={config.fill}
        stroke={config.stroke}
        strokeDasharray={config.dash}
      />
      <foreignObject x="8" y="7" width={MINI_NODE_WIDTH - 16} height={MINI_NODE_HEIGHT - 14}>
        <div className="mini-node-label">{item.label}</div>
      </foreignObject>
      {editable && editMode ? (
        <g
          className="graph-node-delete mini-node-delete"
          transform={`translate(${MINI_NODE_WIDTH - 10} 8)`}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onDelete();
          }}
        >
          <circle r="9" />
          <text y="4">x</text>
        </g>
      ) : null}
    </g>
  );
}

function evidenceTargetIds(item) {
  const ids = [
    ...(Array.isArray(item.nodeIds) ? item.nodeIds : []),
    ...(item.nodeId ? [item.nodeId] : []),
    ...((item.phrase || item.evidencePhrase) ? [item.key] : []),
  ];
  if (!ids.length) return item.key;
  return ids.length === 1 ? ids[0] : ids;
}

function MiniNodeDialog({ mode, item, onClose, onSubmit }) {
  const [role, setRole] = useState(item?.role ?? 'supports');
  const [label, setLabel] = useState(item?.label ?? '');
  const [tooltip, setTooltip] = useState(item?.tooltip ?? '');

  function submit(event) {
    event.preventDefault();
    onSubmit({
      role,
      label: label.trim() || 'New clue',
      tooltip: tooltip.trim(),
    });
  }

  return (
    <div className="graph-popover-backdrop mini-dialog-backdrop" onClick={onClose}>
      <form className="graph-node-dialog" onSubmit={submit} onClick={(event) => event.stopPropagation()}>
        <div className="modal-head">
          <h2>{mode === 'edit' ? 'Edit mini node' : 'Add mini node'}</h2>
          <button type="button" onClick={onClose}>Close</button>
        </div>

        <label className="field">
          <span>Role</span>
          <select value={role} onChange={(event) => setRole(event.target.value)}>
            {ROLE_ORDER.map((roleName) => (
              <option key={roleName} value={roleName}>{ROLE_CONFIG[roleName].label}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Node label</span>
          <input value={label} onChange={(event) => setLabel(event.target.value)} autoFocus />
        </label>

        <label className="field">
          <span>Description <small>optional</small></span>
          <textarea value={tooltip} onChange={(event) => setTooltip(event.target.value)} />
        </label>

        <button className="primary-action compact-action" type="submit">
          {mode === 'edit' ? 'Save mini node' : 'Add mini node'}
        </button>
      </form>
    </div>
  );
}

function buildMiniTooltip(item, miniGraph) {
  if (item.tooltip) return item.tooltip;
  return `No description provided for ${item.label} in ${miniGraph.optionText}.`;
}

function useMiniLayerLayout(miniGraph) {
  return useMemo(() => {
    const items = ROLE_ORDER.flatMap((role) =>
      (miniGraph[role] ?? []).map((item, index) => ({
        ...item,
        role,
        sourceIndex: index,
        key: miniEvidenceKey(miniGraph.optionId, role, index, item.label),
      })),
    );
    const rowStep = 76;
    const top = 18;
    const height = Math.max(220, top * 2 + Math.max(1, items.length) * rowStep);
    const width = 540;
    const option = {
      x: width - OPTION_WIDTH - 28,
      y: height / 2 - OPTION_HEIGHT / 2,
      label: miniGraph.optionText,
    };
    const sorted = orderEvidenceItems(items);

    const nodes = sorted.map((item, index) => {
      return {
        ...item,
        x: 28,
        y: top + index * rowStep,
        edgeOffset: 0,
      };
    });

    const layout = { width, height, nodes, option };
    return layout;
  }, [miniGraph]);
}

function orderEvidenceItems(items) {
  const roleRank = Object.fromEntries(ROLE_ORDER.map((role, index) => [role, index]));
  return [...items].sort((a, b) => {
    const roleDiff = (roleRank[a.role] ?? 99) - (roleRank[b.role] ?? 99);
    if (roleDiff !== 0) return roleDiff;
    return String(a.label).localeCompare(String(b.label));
  });
}

function edgeLabelPoint(fromX, fromY, toX, toY, offset) {
  const x = fromX + (toX - fromX) * 0.56;
  const y = fromY + (toY - fromY) * 0.56;
  const dx = toX - fromX;
  const dy = toY - fromY;
  const length = Math.hypot(dx, dy) || 1;
  return {
    x: x + (-dy / length) * offset,
    y: y + (dx / length) * offset - 5,
  };
}

function buildFallbackMiniGraphs(question) {
  return question.options
    .filter((option) => option.id !== question.correctOptionId)
    .map((option) => ({
      optionId: option.id,
      optionText: option.text,
      contradicts: [{ label: 'See explanation' }],
      summary: question.explanation?.distractors?.[option.id],
    }));
}
