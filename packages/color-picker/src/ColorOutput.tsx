import styled from 'styled-components';
import React from "react";
import type {HSB, RGB} from './types'

interface ColorOutputProps {
    rgb: RGB;
    hsb: HSB;
    hex: string;
}

const ColorOutputUl = styled.ul`
    list-style: none`;


export function ColorOutput({rgb, hsb, hex}: ColorOutputProps): React.JSX.Element {

    return (
        <ColorOutputUl>
            <li>rgb({rgb.r},{rgb.g},{rgb.b})</li>
            <li>#{hex}</li>
            <li>hsv({hsb.h},{hsb.s},{hsb.b})</li>
            <li style={{background: `#${hex}`}}>&nbsp;</li>
        </ColorOutputUl>
    )
}

ColorOutput.displayName = "ColorOutput";