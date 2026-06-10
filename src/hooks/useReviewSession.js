import { useMemo, useState } from 'react';
import { defaultModeForQuestion } from '../config/reviewModes.js';
import {
  cloneQuestion,
  cloneQuestionList,
  makeBankItem,
  replaceQuestion,
} from '../lib/questions.js';
import { useLocalStorage } from '../lib/useLocalStorage.js';

export function useReviewSession(initialQuestions) {
  const activeInitialQuestions = initialQuestions.filter((question) => !question.archived);
  const sessionQuestions = activeInitialQuestions.length ? activeInitialQuestions : initialQuestions;
  const [layoutOverrides, setLayoutOverrides] = useLocalStorage('medmcq_graph_layout_overrides_latest_v2', {});
  const [questions, setQuestions] = useState(() => (
    applyLayoutOverrides(cloneQuestionList(sessionQuestions), layoutOverrides)
  ));
  const [setupOpen, setSetupOpen] = useState(true);
  const [currentQuestionId, setCurrentQuestionId] = useState(sessionQuestions[0].id);
  const [reviewMode, setReviewMode] = useState(defaultModeForQuestion(sessionQuestions[0]));
  const [bank, setBank] = useLocalStorage('medmcq_question_bank', []);

  const currentQuestion = useMemo(
    () => questions.find((question) => question.id === currentQuestionId) ?? questions[0],
    [currentQuestionId, questions],
  );

  function selectQuestion(nextQuestionId) {
    const nextQuestion =
      questions.find((question) => question.id === nextQuestionId) ?? questions[0];
    setCurrentQuestionId(nextQuestion.id);
    setReviewMode(defaultModeForQuestion(nextQuestion));
  }

  function startReview(nextQuestionId) {
    selectQuestion(nextQuestionId);
    setSetupOpen(false);
  }

  function updateQuestion(nextQuestion) {
    setQuestions((current) => replaceQuestion(current, nextQuestion));
    setLayoutOverrides((current) => {
      const nextLayouts = extractLayoutOverride(nextQuestion);
      if (!nextLayouts) {
        const { [nextQuestion.id]: _removed, ...rest } = current;
        return rest;
      }
      return { ...current, [nextQuestion.id]: nextLayouts };
    });
  }

  function resetQuestion(questionId) {
    const original = sessionQuestions.find((question) => question.id === questionId);
    if (original) updateQuestion(cloneQuestion(original));
  }

  function resetMiniGraph(questionId, optionId) {
    const originalQuestion = sessionQuestions.find((question) => question.id === questionId);
    const originalMiniGraph = originalQuestion?.miniGraphs?.find((miniGraph) => miniGraph.optionId === optionId);
    if (!originalMiniGraph) return;

    const currentQuestion = questions.find((question) => question.id === questionId);
    if (!currentQuestion) return;

    updateQuestion({
      ...currentQuestion,
      miniGraphs: (currentQuestion.miniGraphs ?? []).map((miniGraph) => (
        miniGraph.optionId === optionId ? structuredClone(originalMiniGraph) : miniGraph
      )),
    });
  }

  function saveToBank(question, status = 'accepted', feedback = []) {
    setBank((current) => [makeBankItem(question, status, feedback), ...current]);
  }

  function rejectToBank(question, feedback = []) {
    saveToBank(question, 'rejected', feedback);
  }

  function deleteBankItem(itemId) {
    setBank((current) => current.filter((item) => item.id !== itemId));
  }

  return {
    questions,
    currentQuestion,
    setupOpen,
    reviewMode,
    bank,
    selectQuestion,
    startReview,
    updateQuestion,
    resetQuestion,
    resetMiniGraph,
    saveToBank,
    rejectToBank,
    deleteBankItem,
    setReviewMode,
    openSetup: () => setSetupOpen(true),
  };
}

function applyLayoutOverrides(questions, overrides) {
  return questions.map((question) => {
    const override = overrides?.[question.id];
    if (!override) return question;

    return {
      ...question,
      graph: {
        ...question.graph,
        layout: override.graph?.layout ?? question.graph?.layout,
      },
    };
  });
}

function extractLayoutOverride(question) {
  if (!question.graph?.layout) return null;

  return {
    graph: { layout: question.graph.layout },
  };
}
