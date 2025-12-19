# Repository Guidelines

## Project Structure & Module Organization
This repository is currently empty at the root (no source, tests, or build files detected). When the project is initialized, keep a simple, discoverable layout. A typical structure to adopt is:

- `src/` for application code
- `tests/` for unit/integration tests
- `public/` or `assets/` for static files
- `docs/` for architecture notes and diagrams

If you add a framework or build tool, ensure its config files live at the repo root (for example, `package.json`, `pyproject.toml`, or `Makefile`).

## Build, Test, and Development Commands
No build or test commands are defined yet. Once tooling is added, document the primary commands here with short descriptions. Examples to include:

- `npm run dev` — start a local dev server
- `npm test` — run the test suite
- `make build` — produce a production build

## Coding Style & Naming Conventions
No style tooling is currently configured. When you introduce a language or formatter, document it here and keep the rules consistent. Recommended baseline:

- Indentation: 2 spaces for JavaScript/TypeScript, 4 spaces for Python
- Filenames: `kebab-case` for folders, `PascalCase` for components/classes, `camelCase` for variables and functions
- Formatters/linters: add and document tools such as `prettier`, `eslint`, `black`, or `ruff`

## Testing Guidelines
No test framework is present yet. When tests are added, specify:

- Framework (for example, `jest`, `vitest`, `pytest`)
- Naming pattern (for example, `*.test.ts`, `test_*.py`)
- How to run tests locally and in CI

## Commit & Pull Request Guidelines
There is no Git history to infer conventions. Until a standard emerges, use clear, imperative commit messages:

- `Add budget dashboard layout`
- `Fix CSV import parsing`

For pull requests, include:

- A concise description of changes and intent
- Linked issues or tasks (if any)
- Screenshots or recordings for UI changes
- Notes on testing performed (commands and results)

## Security & Configuration Tips
Store secrets in environment variables and keep them out of version control. If configuration files are added (for example, `.env`), add an example file like `.env.example` with safe defaults.
