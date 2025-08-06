import {defineConfig} from "tsup";

export default defineConfig((options) => ({
    entry: [ "src/ColorPicker.tsx","src/ColorVariations.tsx"],
    format: ["cjs", "esm"],
    sourcemap:true,
    dts: true,
    external: ["react"],
    ...options,
}));
