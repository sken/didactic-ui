import styled from 'styled-components';
import type {HTMLAttributes} from "react";
import React, {useEffect, useState} from "react";
import type {HSB, RGB} from './types'
import {HSBtoRGB, RGBtoHSB, RGBtoHex} from './colorUtils'
import { Draggable } from "./Draggable";
import {ColorOutput} from "./ColorOutput";
import {ColorVariations} from "./ColorVariations";



export interface ColorPickerProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    initialRGB?: { r: number, g: number, b: number };
    onColorSelect: (color: string) => void
}

const Wrapper = styled.div`
    width: 840px;
`;

export function ColorPicker({className, initialRGB, onColorSelect}: ColorPickerProps): React.JSX.Element {

    const [mainHsb, setMainHsb] = useState<HSB>({h: 0, s: 100, b: 100})
    const [hsb, setHsb] = useState<HSB>({h: 0, s: 100, b: 100})

    // Derived state (no need for useState or separate useEffect)
    const rgb = HSBtoRGB(hsb)
    const hex = RGBtoHex(rgb)

    // on mount, if they passed initialRGB, convert to HSV
    useEffect(() => {
        if (initialRGB) {
            const _hsb = RGBtoHSB(initialRGB)
            setHsb(_hsb)
        }
    }, [initialRGB])

    // whenever hex changes, trigger the callback
    useEffect(() => {
        onColorSelect(hex)
    }, [hex, onColorSelect])


    // hue‐slider drag handler
    function handleDrag(x: number): void {
        // we assume slider width  42px  = 18°  (just like you did)
        const newHue = Math.round((x / 42) * 18)
        setMainHsb((h) => ({...h, h: newHue}))
    }


    return (
        <Wrapper className={className}>
            <Draggable onDragEnd={handleDrag}/>
            <ColorVariations
                hsb={mainHsb}
                onColorSelect={setHsb}
            />
            <ColorOutput hex={hex} hsb={hsb} rgb={rgb}/>
        </Wrapper>

    );
}