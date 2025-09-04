import type {Meta, StoryObj} from "@storybook/react-vite";
import {ColorVariations} from "@sken/color-picker";

const meta = {
    component: ColorVariations,
    argTypes: {
        hsb: {
            control: {
                type: "object"
            }
        },
        variationSteps: {
            control: {
                type: "number"
            }
        },
        stepsUpDown: {
            control: {
                type: "number",
                min: 3,
                max: 24
            }
        }
    },
    title: 'Color Picker/Color Variations',
} satisfies Meta<typeof ColorVariations>;


export default meta;

type Story = StoryObj<typeof ColorVariations>;

export const Primary: Story = {
    render: (props) => (

        <ColorVariations
            {...props}
            onColorSelect={(): void => {
                // eslint-disable-next-line no-alert -- alert for demo
                alert("Hello from Turborepo!");
            }}
        >
        </ColorVariations>

    ),
    args: {
        hsb: {h: 0, s: 100, b: 100},
        stepsUpDown: 6,
        variationSteps: 8
    }
};
