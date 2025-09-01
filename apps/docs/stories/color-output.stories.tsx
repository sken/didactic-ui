import type {Meta, StoryObj} from "@storybook/react-vite";
import ColorOutput from "@sken/color-picker/ColorOutput";
import {RGBtoHSB} from "@sken/color-picker/colorUtils";

const RGB = {r: 255, g: 0, b: 0};

const meta: Meta<typeof ColorOutput> = {
    component: ColorOutput,
    args: {
        rgb: RGB,
        hsb: RGBtoHSB(RGB),
        hex: "ff0000"
    },
};

export default meta;

type Story = StoryObj<typeof ColorOutput>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
    render: (props) => (
        <ColorOutput
            {...props}
        >
        </ColorOutput>
    ),
    name: "ColorPicker"
};
