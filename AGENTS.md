# AGENTS.md

Welcome! This is the canonical, tool-agnostic instructions and guidelines file for all AI coding agents working on this repository.

## 🏎 Project Overview
This repository is a Turborepo-powered monorepo for a React design system. It contains:
- `apps/docs`: A component documentation site powered by Storybook, Vite, and React.
- `packages/color-picker`: A React color picker component library (`@sken/color-picker`) using `styled-components`.
- `packages/eslint-config`: Shared ESLint presets.
- `packages/typescript-config`: Shared TypeScript configurations.

## 🛠 Dev Environment & Setup
- **Package Manager**: `pnpm` (version `8.15.6` or higher)
- **Local Dev Port Preference**: Run dev/preview servers on port `4300` when possible (per user settings).
- **Core Commands**:
  - Install dependencies: `pnpm install`
  - Run development server (Storybook): `pnpm dev`
  - Build all workspaces: `pnpm build`
  - Lint codebase: `pnpm lint`
  - Clean workspaces (delete build artifacts and node_modules): `pnpm clean`
  - Format code: `pnpm format`
  - Generate a versioning changeset: `pnpm changeset`
  - Version packages: `pnpm version-packages`

## 📦 Workspace Dependencies
To add dependencies:
- To a specific workspace: `pnpm add <dependency> --filter <workspace-name>` (e.g., `pnpm add react-icons --filter docs`)
- To the root workspace: `pnpm add -w <dependency>` (e.g., `pnpm add -D prettier -w`)

## 🎨 Code Style & Conventions
- **Language**: TypeScript (strict mode enabled). Keep files 100% typed.
- **Components**: React 18, functional components, hooks.
- **Styling**: Vanilla CSS or `styled-components` (in `packages/color-picker`). Avoid adding ad-hoc styles; use CSS variables / theme properties.
- **Exports**: Follow the `exports` configuration in `packages/color-picker/package.json` when adding new modules.

## 🤖 Renovate Bot
- Renovate configuration is located in the root `renovate.json` or `.github/renovate.json`.
- When updating packages, group them logically to minimize PR noise (e.g., group `@types/*` packages, group storybook packages).
