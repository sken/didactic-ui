import styled from 'styled-components';
import type {HTMLAttributes} from "react";
import React, {useEffect, useState} from "react";
import type {HSB, RGB} from './types'
import {HSBtoRGB, RGBtoHSB, RGBtoHex} from './colorUtils'
import Draggable from "./Draggable";
import ColorVariations from "./ColorVariations";


export interface ColorPickerProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    initialRGB?: { r: number, g: number, b: number };
    onColorSelect: (color: string) => void
}

const Wrapper = styled.div`
    width: 840px;
`;


interface ColorOutputProps {
    rgb: RGB;
    hsb: HSB;
    hex: string;
}

function ColorOutput({rgb, hsb, hex}: ColorOutputProps): React.JSX.Element {

    return (
        <ul>
            <li>rgb({rgb.r},{rgb.g},{rgb.b})</li>
            <li>#{hex}</li>
            <li>hsv({hsb.h},{hsb.s},{hsb.b})</li>
            <li style={{background: `#${hex}`}}>&nbsp;</li>
        </ul>
    )
}

function ColorPicker({className, initialRGB, onColorSelect}: ColorPickerProps): React.JSX.Element {

    const [mainHsb, setMainHsb] = useState<HSB>({h: 0, s: 100, b: 100})
    const [hsb, setHsb] = useState<HSB>({h: 0, s: 100, b: 100})
    const [rgb, setRgb] = useState<RGB>({r: 255, g: 0, b: 0})
    const [hex, setHex] = useState<string>('ff0000')


    // on mount, if they passed initialRGB, convert to HSV
    useEffect(() => {
        if (initialRGB) {
            const _hsb = RGBtoHSB(initialRGB)
            setHsb(_hsb)
        }
    }, [initialRGB])

    // whenever hsb changes recalc rgb, hex & fetch images
    useEffect(() => {
        const _rgb = HSBtoRGB(hsb)
        setRgb(_rgb)
        setHex(RGBtoHex(_rgb))
        onColorSelect(hex)
    }, [hsb, hex, onColorSelect])


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

export default ColorPicker;