import {dirname, join, resolve} from "path";

import type {StorybookConfig} from '@storybook/react-vite';

const config: StorybookConfig = {
    stories: ["../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],

    addons: [
        '@storybook/addon-docs'
    ],

    framework: '@storybook/react-vite',

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
