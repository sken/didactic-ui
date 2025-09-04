import type {StorybookConfig} from '@storybook/react-vite';
import {resolve} from "path";

const config: StorybookConfig = {
    stories: [
        "../**/*.mdx",
        "../**/*.stories.@(js|jsx|mjs|ts|tsx)"
    ],

    addons: [
        '@storybook/addon-docs'
    ],

    framework: {
        "name": "@storybook/react-vite",
        "options": {}
    },

    async viteFinal(config, {configType}) {
        // customize the Vite config here
        return {
            ...config,
            define: {"process.env": {}},
            resolve: {
                alias: [
                    {
                        find: "color-picker",
                        replacement: resolve(__dirname, "../../../packages/color-picker/"),
                    },
                ],
            },
        };
    }

};

export default config;
