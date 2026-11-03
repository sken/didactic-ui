/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["@repo/eslint-config/react.js"],
  rules: {
    // Components are PascalCase files (ColorPicker.tsx), utilities and hooks
    // camelCase; the package's export paths ("./ColorPicker") depend on them.
    "unicorn/filename-case": ["warn", { cases: { camelCase: true, pascalCase: true } }],
    // `import styled from "styled-components"` is the documented usage and the
    // pattern in AGENTS.md; the package also has a named `styled` export.
    "import/no-named-as-default": "off",
  },
};
