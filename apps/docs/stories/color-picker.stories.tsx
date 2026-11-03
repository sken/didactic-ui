import type {Meta, StoryObj} from "@storybook/react-vite";
import { ColorPicker } from "@sken/color-picker";
import { fn } from 'storybook/test';

const meta: Meta<typeof ColorPicker> = {
    component: ColorPicker,
    title: 'Color Picker/Color Picker',
    args: {
        onColorSelect: fn(),
        onColorPreview: fn(),
    },
};

export default meta;

type Story = StoryObj<typeof ColorPicker>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
export const Default: Story = {
    render: (props) => (
        <ColorPicker
            {...props}
        />
    )
};

/*
 * Starts from a given colour: the hue handle, the shade row and the selection
 * follow `initialRGB`. `onColorPreview` reports live while the handle is dragged.
 */
export const WithInitialColour: Story = {
    args: {
        initialRGB: {r: 40, g: 90, b: 170},
    },
};
