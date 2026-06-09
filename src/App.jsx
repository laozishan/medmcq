import React from 'react';
import questionsData from './data/questions.json';
import { SetupPage } from './components/SetupPage.jsx';
import { ReviewApp } from './components/ReviewApp.jsx';
import { useReviewSession } from './hooks/useReviewSession.js';
import './styles.css';

export default function App() {
  const session = useReviewSession(questionsData);

  if (session.setupOpen) {
    return (
      <SetupPage
        questions={session.questions}
        onStart={session.startReview}
        selectedQuestionId={session.currentQuestion.id}
      />
    );
  }

  return (
    <ReviewApp
      questions={session.questions}
      question={session.currentQuestion}
      mode={session.reviewMode}
      bank={session.bank}
      onModeChange={session.setReviewMode}
      onQuestionChange={session.selectQuestion}
      onSetup={session.openSetup}
      onSaveQuestion={session.updateQuestion}
      onResetQuestion={session.resetQuestion}
      onResetMiniGraph={session.resetMiniGraph}
      onAccept={session.saveToBank}
      onReject={session.rejectToBank}
      onDeleteBankItem={session.deleteBankItem}
    />
  );
}
