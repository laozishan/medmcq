import React, { useEffect, useRef, useState } from 'react';
import { QuestionPanel } from './QuestionPanel.jsx';
import { ExplanationPanel } from './ExplanationPanel.jsx';
import { KnowledgeGraph } from './KnowledgeGraph.jsx';
import { DistractorMiniGraphs } from './DistractorMiniGraphs.jsx';
import { QuestionBankModal } from './QuestionBankModal.jsx';
import { RegenerateModal } from './RegenerateModal.jsx';
import { RejectModal } from './RejectModal.jsx';
import { ReviewTopbar } from './ReviewTopbar.jsx';
import { modeVisibility } from '../config/reviewModes.js';
import { NODE_TYPES } from '../lib/graph.js';
import { removePhraseFromVignette } from '../lib/questions.js';

export function ReviewApp({
  questions,
  question,
  mode,
  bank,
  onModeChange,
  onQuestionChange,
  onSetup,
  onSaveQuestion,
  onResetQuestion,
  onResetMiniGraph,
  onAccept,
  onReject,
  onDeleteBankItem,
}) {
  const [hoverState, setHoverState] = useState({ id: null, x: 0, y: 0, node: null });
  const [bankOpen, setBankOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [regenerateOpen, setRegenerateOpen] = useState(false);
  const [toast, setToast] = useState('');
  const supportPaneRef = useRef(null);
  const toastTimerRef = useRef(null);
  const { showText, showGraph } = modeVisibility(mode);
  const activeEvidenceId = hoverState.id;
  const firstActiveEvidenceId = Array.isArray(activeEvidenceId) ? activeEvidenceId[0] : activeEvidenceId;
  const activeNode = hoverState.node ?? question.graph.nodes.find((node) => node.id === firstActiveEvidenceId);
  const canRegenerate = Boolean(question.regenerable);
  const canEditGraph = true;

  useEffect(() => {
    supportPaneRef.current?.scrollTo({ top: 0, left: 0 });
  }, [question.id, mode]);

  function updateGraphNodeLabel(nodeId, label) {
    onSaveQuestion({
      ...question,
      graph: {
        ...question.graph,
        nodes: question.graph.nodes.map((node) => (node.id === nodeId ? { ...node, label } : node)),
      },
    });
  }

  function updateGraphNodeType(nodeId, type) {
    onSaveQuestion({
      ...question,
      graph: {
        ...question.graph,
        nodes: question.graph.nodes.map((node) => (node.id === nodeId ? { ...node, type } : node)),
      },
    });
  }

  function deleteGraphNode(nodeId) {
    const node = question.graph.nodes.find((item) => item.id === nodeId);
    const nextGraph = {
      ...question.graph,
      nodes: question.graph.nodes.filter((item) => item.id !== nodeId),
      edges: question.graph.edges.filter((edge) => edge.from !== nodeId && edge.to !== nodeId),
    };
    onSaveQuestion({
      ...question,
      vignette: removePhraseFromVignette(question.vignette, node?.phrase),
      graph: nextGraph,
      clueCandidates: (question.clueCandidates ?? []).filter((clue) => clue.id !== nodeId),
    });
  }

  function updateGraphEdgeLabel(edgeIndex, label) {
    onSaveQuestion({
      ...question,
      graph: {
        ...question.graph,
        edges: question.graph.edges.map((edge, index) => (index === edgeIndex ? { ...edge, label } : edge)),
      },
    });
  }

  function addGraphEdge(edge) {
    onSaveQuestion({
      ...question,
      graph: {
        ...question.graph,
        edges: [
          ...question.graph.edges,
          edge,
        ],
      },
    });
  }

  function addGraphNode(partialNode) {
    const id = partialNode.id || `node_${Date.now()}`;
    const edges = [...question.graph.edges];
    if (partialNode.connectNodeId && partialNode.relation) {
      edges.push({
        from: partialNode.direction === 'new-to-existing' ? id : partialNode.connectNodeId,
        to: partialNode.direction === 'new-to-existing' ? partialNode.connectNodeId : id,
        label: partialNode.relation,
      });
    }

    onSaveQuestion({
      ...question,
      graph: {
        ...question.graph,
        nodes: [
          ...question.graph.nodes,
          {
            id,
            type: partialNode.type,
            label: partialNode.label || 'New node',
            tooltip: partialNode.tooltip || 'New graph node added during review.',
          },
        ],
        edges,
        layout: partialNode.x !== undefined && partialNode.y !== undefined
          ? {
              ...(question.graph.layout ?? {}),
              width: question.graph.layout?.width ?? 900,
              height: question.graph.layout?.height ?? 520,
              nodes: {
                ...(question.graph.layout?.nodes ?? {}),
                [id]: { x: Math.round(partialNode.x), y: Math.round(partialNode.y) },
              },
            }
          : question.graph.layout,
      },
    });
  }

  function updateGraphLayout(layout) {
    onSaveQuestion({
      ...question,
      graph: {
        ...question.graph,
        layout,
      },
    });
  }

  function updateMiniGraph(optionId, nextMiniGraph) {
    onSaveQuestion({
      ...question,
      miniGraphs: (question.miniGraphs ?? []).map((miniGraph) => (
        miniGraph.optionId === optionId ? nextMiniGraph : miniGraph
      )),
    });
  }

  function handleEvidenceHover(id, event, nodeOverride = null) {
    if (!id) {
      setHoverState((current) => ({ ...current, id: null, node: null, highlightRole: null }));
      return;
    }
    setHoverState({
      id,
      x: event?.clientX ?? hoverState.x,
      y: event?.clientY ?? hoverState.y,
      node: nodeOverride,
      highlightRole: nodeOverride?.highlightRole ?? null,
    });
  }

  function showToast(message) {
    setToast(message);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(''), 1800);
  }

  function acceptQuestion() {
    onAccept(question);
    showToast('Question added to question bank.');
  }

  return (
    <main className="review-app">
      <ReviewTopbar
        questions={questions}
        question={question}
        mode={mode}
        bankCount={bank.length}
        onModeChange={onModeChange}
        onQuestionChange={onQuestionChange}
        onSetup={onSetup}
        onOpenBank={() => setBankOpen(true)}
      />

      <div className="review-layout">
        <QuestionPanel
          question={question}
          activeEvidenceId={activeEvidenceId}
          activeEvidenceRole={hoverState.highlightRole}
          onEvidenceHover={handleEvidenceHover}
          onSave={onSaveQuestion}
          onAccept={acceptQuestion}
          onReject={() => setRejectOpen(true)}
          onRegenerate={canRegenerate ? () => setRegenerateOpen(true) : null}
          onReset={() => onResetQuestion(question.id)}
        />

        <section className="support-pane" ref={supportPaneRef}>
          {showText && !showGraph ? <ExplanationPanel question={question} /> : null}

          {showGraph ? (
            <div className="kg-stack">
            <KnowledgeGraph
              graph={question.graph}
              activeEvidenceId={activeEvidenceId}
              editable={canEditGraph}
              onEvidenceHover={handleEvidenceHover}
              onNodeLabelChange={updateGraphNodeLabel}
              onNodeTypeChange={updateGraphNodeType}
              onNodeDelete={deleteGraphNode}
              onNodeAdd={addGraphNode}
              onEdgeAdd={addGraphEdge}
              onEdgeLabelChange={updateGraphEdgeLabel}
              onGraphReset={() => onResetQuestion(question.id)}
              onLayoutChange={updateGraphLayout}
            />
            <DistractorMiniGraphs
              question={question}
              editable={canEditGraph}
              onEvidenceHover={handleEvidenceHover}
              onMiniGraphChange={updateMiniGraph}
              onMiniGraphReset={(optionId) => onResetMiniGraph(question.id, optionId)}
            />
            </div>
          ) : null}
        </section>
      </div>

      {showGraph ? <HoverExplanation node={activeNode} hoverState={hoverState} /> : null}
      {toast ? <div className="toast-status" role="status">{toast}</div> : null}

      <QuestionBankModal
        open={bankOpen}
        bank={bank}
        onClose={() => setBankOpen(false)}
        onDelete={onDeleteBankItem}
        onSelect={(questionId) => {
          onQuestionChange(questionId);
          setBankOpen(false);
        }}
      />
      <RejectModal
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        onSubmit={(feedback) => {
          onReject?.(question, feedback);
          setRejectOpen(false);
        }}
      />
      <RegenerateModal
        open={regenerateOpen}
        question={question}
        onClose={() => setRegenerateOpen(false)}
        onApply={(nextQuestion) => {
          onSaveQuestion(nextQuestion);
          setRegenerateOpen(false);
        }}
      />
    </main>
  );
}

function HoverExplanation({ node, hoverState }) {
  if (!node) return null;
  const nodeType = NODE_TYPES[node.type] ?? NODE_TYPES.symptom;
  const label = node.hoverLabel ?? nodeType.label;
  const color = node.hoverColor ?? nodeType.stroke;

  return (
    <aside
      className="hover-explanation visible"
      style={{
        left: Math.min(hoverState.x + 16, window.innerWidth - 360),
        top: Math.min(hoverState.y + 16, window.innerHeight - 180),
        borderColor: color,
      }}
    >
      <span style={{ color }}>{label}</span>
      <h3>{node.label}</h3>
      <p>{node.tooltip ?? 'This graph node is linked to the highlighted vignette evidence.'}</p>
    </aside>
  );
}
