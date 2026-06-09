# MedMCQ User Study Prototype

This prototype supports an expert review study for medical multiple-choice questions in pediatrics and neurology.

The study asks clinicians or medical educators to inspect MCQs, judge whether the vignette and answer options are clinically appropriate, and decide whether each question should be accepted, rejected, or revised. The interface is designed to compare two forms of explanation support:

- `Text`: a conventional written explanation of the correct answer and distractors.
- `KG`: a knowledge-graph view with linked vignette highlights, node descriptions, and option-level mini graphs.

## Study Purpose

The prototype is built to explore how explanation format affects expert review of educational MCQs. In particular, it helps observe whether a knowledge-graph representation makes it easier for reviewers to:

- identify clinically implausible or over-specified clues,
- evaluate whether distractors are fair and pedagogically useful,
- revise ambiguous or misleading question wording,
- judge whether a question is too easy for the intended learner level,
- articulate the clinical reasoning behind accept/reject decisions.

## Review Tasks

The question set includes pediatrics and neurology items. Each domain contains a mixture of:

- normal questions,
- questions with reviewable flaws,
- questions that are intentionally too easy or over-specified.

The visible task labels are neutral (`Task 1`, `Task 2`, etc.) so the interface does not reveal the study condition or the intended flaw.

## Interface

Reviewers can:

- read the vignette and answer options,
- hover highlighted vignette phrases or graph nodes to inspect clinical descriptions,
- inspect the main knowledge graph for the diagnostic reasoning structure,
- inspect mini graphs for why distractor options are supported, weakened, ruled out, or missing expected findings,
- edit question text or graph nodes when a question needs revision,
- accept or reject a question,
- revisit accepted and rejected questions through the question bank.

The knowledge graph is not intended to give a final answer automatically. It is a scaffold for making the clinical script and distractor logic inspectable during expert review.

## Question Data

Questions, explanations, graph nodes, graph edges, mini graphs, and hover descriptions are stored in:

```text
src/data/questions.json
```

This makes the prototype easier to revise between study iterations without rewriting the interface.

## Local Use

```bash
npm install
npm run dev
```

For validation:

```bash
npm run smoke
npm run build
```
