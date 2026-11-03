import styled from 'styled-components';
import type {HTMLAttributes} from "react";
import React, {useEffect, useState} from "react";
import type {HSB, RGB} from './types'
import {HSBtoRGB, RGBtoHSB, RGBtoHex, hueFromOffset, offsetFromHue} from './colorUtils'
import { Draggable } from "./Draggable";
import {ColorOutput} from "./ColorOutput";
import {ColorVariations} from "./ColorVariations";


export interface ColorPickerProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    /**
     * The colour to start from. Changing it moves the picker (hue handle,
     * shade row and selection) without calling `onColorSelect`.
     * Compared by value, so a new object with the same r/g/b is ignored.
     */
    initialRGB?: RGB;
    /**
     * Called with the hex value (without "#") when the user picks a colour:
     * a shade click or key press, or releasing the hue handle. Not called on
     * mount or when `initialRGB` changes.
     */
    onColorSelect: (color: string) => void;
    /**
     * Called continuously while the hue handle is dragged, with the colour
     * that releasing it there would select. Use it for live previews.
     */
    onColorPreview?: (color: string) => void;
}

const Wrapper = styled.div`
    width: 840px;
`;

const DEFAULT_HSB: HSB = {h: 0, s: 100, b: 100}

const hexOf = (hsb: HSB): string => RGBtoHex(HSBtoRGB(hsb))

export function ColorPicker({className, initialRGB, onColorSelect, onColorPreview}: ColorPickerProps): React.JSX.Element {

    const [hsb, setHsb] = useState<HSB>(() => (initialRGB ? RGBtoHSB(initialRGB) : DEFAULT_HSB))
    // hue of the shade row and of the slider handle (on the 18-degree grid)
    const [hueX, setHueX] = useState<number>(() => offsetFromHue(hsb.h))
    const [liveHue, setLiveHue] = useState<number | null>(null)

    const rgb = HSBtoRGB(hsb)
    const hex = RGBtoHex(rgb)

    // move the picker when the parent passes a new colour (by value, not identity)
    const r0 = initialRGB?.r
    const g0 = initialRGB?.g
    const b0 = initialRGB?.b
    useEffect(() => {
        if (r0 === undefined || g0 === undefined || b0 === undefined) return
        const next = RGBtoHSB({r: r0, g: g0, b: b0})
        setHsb(next)
        setHueX(offsetFromHue(next.h))
    }, [r0, g0, b0])

    function select(next: HSB): void {
        setHsb(next)
        onColorSelect(hexOf(next))
    }

    // while dragging: the shade row follows the handle, the parent may preview
    function handleDrag(x: number): void {
        const h = hueFromOffset(x)
        setLiveHue(h)
        onColorPreview?.(hexOf({...hsb, h}))
    }

    // on release: keep the chosen shade (saturation, brightness), change its hue
    function handleDragEnd(x: number): void {
        setLiveHue(null)
        setHueX(x)
        select({...hsb, h: hueFromOffset(x, true)})
    }

    const rowHue = liveHue ?? hueFromOffset(hueX)

    return (
        <Wrapper className={className}>
            <Draggable onDrag={handleDrag} onDragEnd={handleDragEnd} x={hueX}/>
            <ColorVariations
                hsb={{h: rowHue, s: 100, b: 100}}
                onColorSelect={select}
            />
            <ColorOutput hex={hex} hsb={hsb} rgb={rgb}/>
        </Wrapper>
    );
}
