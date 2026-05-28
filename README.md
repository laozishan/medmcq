# MedMCQ React Prototype

React/Vite version of the MedMCQ expert review workspace. The UI is implemented as fixed React components, while questions, explanations, and knowledge graphs live in JSON.

## Local development

```bash
npm install
npm run dev
```

## Production preview

```bash
npm run build
npm run preview
```

## Smoke test

```bash
npm run smoke
```

The smoke test validates the question JSON schema, answer choices, explanation fields, and knowledge graph node/edge references.

## Editing questions

Edit [src/data/questions.json](src/data/questions.json) to add or update questions. Each entry owns:

- `vignette`, `stem`, `options`, and `correctOptionId`
- `explanation.whyCorrect`, `explanation.evidence`, and `explanation.distractors`
- `graph.nodes` and `graph.edges`
- optional `regenerateTemplate` for Task 3-style revision

## Deploy

Recommended settings for Vercel or Netlify:

- Framework: Vite
- Build command: `npm run build`
- Publish/output directory: `dist`

GitHub Pages is also configured through `.github/workflows/deploy.yml`.
Push this project to `https://github.com/laozishan/medmcq.git` on the `main` branch, then enable Pages with source set to **GitHub Actions** in the repository settings.
