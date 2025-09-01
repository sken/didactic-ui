import type {Meta, StoryObj} from "@storybook/react-vite";
import ColorPicker from "@sken/color-picker/ColorPicker";
import { fn } from 'storybook/test';

const meta: Meta<typeof ColorPicker> = {
    component: ColorPicker,
    args: {
        onColorSelect: fn()
    },
};

export default meta;

type Story = StoryObj<typeof ColorPicker>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
    render: (props) => (
        <ColorPicker
            {...props}
        >
        </ColorPicker>
    ),
    name: "ColorPicker"
};
