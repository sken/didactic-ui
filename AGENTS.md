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

## 🤖 Dependabot
- Dependabot configuration is located in `.github/dependabot.yml`.
- Dependabot is configured to check for updates weekly and group related dependencies (like `@types/*`, `@storybook/*`, and linting/formatting tools) to keep PRs organized and reduce noise.

## 🚧 Boundaries & Constraints
- **Export Strategy**: Always use named exports (e.g., `export function MyComponent`). Avoid default exports entirely.
- **Return Types**: Explicitly type component return values as `React.JSX.Element`.
- **Prop Typing**: Component props should typically extend base HTML attributes (e.g., `interface Props extends HTMLAttributes<HTMLDivElement>`) to allow standard DOM props like `className` to pass through.
- **Type Imports**: Use `import type` for all TypeScript interfaces and types to ensure they are stripped during compilation.
- **Logic Separation**: Keep complex business logic and data transformations out of components (e.g., use `colorUtils.ts` for conversions).
- **Environment**: Never commit `.env` files, API keys, or sensitive secrets.
- **Task Completion**: After finishing any task, the AI agent MUST provide a suggested commit message summarizing the changes, along with the exact `git add` and `git commit` commands for the user to run.

## 🧩 Component Patterns
When creating new styled components in `@sken/color-picker`, follow this structure:

```tsx
import styled from 'styled-components';
import React from 'react';
import type { HTMLAttributes } from 'react';
import type { SharedType } from './types'; // Always import types explicitly

// 1. Define Props extending standard HTML attributes
export interface MyComponentProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    isActive?: boolean;
}

// 2. Define Styled Wrappers
const Wrapper = styled.div<{ $isActive?: boolean }>`
    display: flex;
    // Use transient props (prefixed with $) for styled-components to prevent them from leaking into the DOM
    opacity: ${({ $isActive }) => ($isActive ? 1 : 0.5)};
`;

// 3. Define and Named-Export the Component with explicit return type
export function MyComponent({ className, isActive }: MyComponentProps): React.JSX.Element {
    return (
        <Wrapper className={className} $isActive={isActive}>
            {/* Component Content */}
        </Wrapper>
    );
}
```

## 🗺 Project Map & Architecture

### `packages/color-picker` (`@sken/color-picker`)
- **Role**: A polished, self-contained React component library providing color selection tools.
- **Styling**: `styled-components`.
- **Structure**:
  - `src/index.ts`: The main entrypoint. Re-exports all public components, hooks, and utilities.
  - `src/ColorPicker.tsx`: The primary orchestrator component. It holds the core state (HSB, RGB, Hex) and coordinates subcomponents.
  - `src/types.ts`: Central location for shared types (`HSB`, `RGB`, etc.).
  - `src/colorUtils.ts`: Pure utility functions for converting between color formats.
  - **Pattern Strategy**: State is hoisted to the orchestrator (`ColorPicker`), while child components (`ColorOutput`, `ColorVariations`, `Draggable`) are largely presentational and consume state/callbacks via props.

### `apps/docs`
- **Role**: Storybook documentation and playground site.
- **Stack**: Vite + Storybook + React.
- **Pattern Strategy**: Visually tests, documents, and showcases the components exported by `@sken/color-picker`.
