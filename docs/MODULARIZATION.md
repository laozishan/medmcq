# MedMCQ Modularization Notes

The old `Userstudy-deploy` pages are useful as deployable snapshots, but they are not a good long-term source format. A single HTML file mixes clinical data, rendering, graph behavior, revision state, and CSS, so a small clinical correction can easily become a risky whole-page edit.

This React project should be treated as the maintainable source of truth.

## Current Layers

- `src/App.jsx`: application composition only.
- `src/hooks/useReviewSession.js`: review workflow state, current question, setup page state, review mode, and question bank actions.
- `src/config/reviewModes.js`: task-to-mode rules and text/KG visibility rules.
- `src/config/difficulties.js`: shared difficulty options.
- `src/lib/catalog.js`: domain/topic/difficulty filtering helpers.
- `src/lib/questions.js`: question cloning, question replacement, question bank item creation, and vignette text helpers.
- `src/lib/graph.js`: clinical reasoning graph node types, graph layout, phrase extraction, and graph-specific helpers.
- `src/lib/text.js`: enriched-text segmentation.
- `src/components/`: UI components.
- `src/data/questions.json`: clinical question content, answer options, explanations, and KG data.

## Expansion Path

For more user-study domains, split `src/data/questions.json` into domain-specific files:

- `src/data/pediatrics.json`
- `src/data/neurology.json`
- `src/data/index.js`

Then keep the UI generic by filtering questions by `domain`, `topic`, `difficulty`, and `taskLabel`. The components should not contain clinical facts; they should only render the data schema.

## Data Rule

Clinical content should live in JSON-like data files, not in JSX components and not in static HTML. A new MCQ should be added by creating a new question object with:

- `vignette`, `stem`, `options`, and `correctOptionId`
- `explanation.whyCorrect`, `explanation.evidence`, and `explanation.distractors`
- `graph.nodes` and `graph.edges`
- optional `miniGraphs` for option-level support, contradiction, missing-clue, and quality-review cues
- optional revision metadata such as `regenerable` and `regenerateTemplate`

Main graph nodes should be concise medical concepts such as `symptom`, `sign`, `history`, `exam`, `investigation`, `mechanism`, `anatomy`, and `diagnosis`. Long vignette phrases should stay in the text layer and map to graph nodes through each node's optional `phrase` field.

## Deployment Rule

`Userstudy-deploy` should be treated as generated output or a GitHub Pages target. Do not hand-edit large HTML pages there unless it is an emergency hotfix.
