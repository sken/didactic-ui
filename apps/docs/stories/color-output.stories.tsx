import type { Meta, StoryObj } from '@storybook/react-vite';
import { ColorOutput } from '@sken/color-picker';

const meta: Meta<typeof ColorOutput> = {
  component: ColorOutput,
  title: 'Color Picker/Color Output',
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    rgb: { r: 255, g: 0, b: 0 },
    hsb: { h: 0, s: 100, b: 100 },
    hex: 'FF0000',
  },
};
