import React, {useMemo} from 'react'
import styled from "styled-components"; // import your helper fns
import type {HSB, RGB} from './types'        // import your shared color interfaces
import {HSBtoRGB, RGBtoHex} from './colorUtils'

export interface ColorVariationsProps {
    hsb: HSB
    variationSteps?: number
    onColorSelect: (newHsb: HSB) => void,
    stepsUpDown?: number
}

const ResetUl = styled.ul`
    padding: 0;
    margin: 0;
`;

const ColorVariationUl = styled(ResetUl)`
    min-width: 841px;

    :hover {
        ul {
            display: block;
        }
    }
`;

const LiWithBorder = styled.li`
    border-right: 1px solid #fff;
    border-bottom: 1px solid #fff;`;

const UnstyledLi = styled(LiWithBorder)`
    list-style-type: none;
    display: block;
    float: left;
    height: 20px;
    line-height: 20px;
    width: 64px;
`;

const ColorLi = styled(UnstyledLi).attrs<{
    $backgroundColor: string
}>(props => ({$backgroundColor: props.$backgroundColor || '#fff'}))`
    cursor: pointer;
    background: ${props => props.$backgroundColor};

    &:last-child,
    &:first-child {
        width: 62px;

        > ul {
            li {
                width: 62px;
            }
        }
    }

    &:last-child {
        border-right: none;
    }

    &.main_color {
        margin-top: -4px;
        margin-left: -4px;
        height: 28px;
        line-height: 28px;
        border: 2px solid #fff;

        &:hover {
            ul {
                top: 30px;
            }
        }
    }
`;

const SubVariationUl = styled(ResetUl)`
    display: none;
    position: relative;
    top: 21px;
`;

const VariationLi = styled(UnstyledLi)`
    border-left: 1px solid #FFFFFF;
    margin-left: -1px;
    height: 15px;

    &:hover {
        margin-left: -2px;
        border-left: 3px solid #000;
        border-right: 3px solid #000;
    }
`;

export default function ColorVariations({
                                    hsb,
                                    stepsUpDown = 6,
                                    variationSteps = 8,
                                    onColorSelect,
                                }: ColorVariationsProps): React.JSX.Element {

    const stepValues = useMemo(() => {
        const result: Record<number, [number, number]> = {0: [hsb.s, hsb.b]};
        const step = 90 / stepsUpDown;

        for (let i = 1; i <= stepsUpDown; i++) {
            result[-i] = [100, Math.max(10, 100 - step * i)];
            result[i] = [Math.max(10, 100 - step * i), 100];
        }

        return result;
    }, [hsb.b, hsb.s, stepsUpDown]);

    const keys = useMemo(
        () => Object.keys(stepValues)
            .map(k => parseInt(k, 10))
            .sort((a, b) => a - b),
        [stepValues]
    );

    const gstep = 100 / variationSteps

    return (
        <ColorVariationUl>
            {keys.map(key => {
                const [s0, b0] = stepValues[key]

                const isMainCurrent =
                    hsb.s === (key === 0 ? hsb.s : s0) &&
                    hsb.b === (key === 0 ? hsb.b : b0)

                const rgbMain: RGB = HSBtoRGB({h: hsb.h, s: s0, b: b0})
                const bgMain = `#${RGBtoHex(rgbMain)}`

                const subClass = key < 0 ? 's_variation' : 'b_variation'
                const liClassName = `${key === 0 ? 'main_color' : ''} ${isMainCurrent ? 'current' : ''}`;
                return (
                    <ColorLi
                        $backgroundColor={bgMain}
                        className={liClassName}
                        key={key}
                        onClick={() => {
                            onColorSelect({h: hsb.h, s: s0, b: b0});
                        }}
                    >
                        <SubVariationUl className={subClass}>
                            {Array.from({length: variationSteps - 1}).map((_, i) => {
                                // build the sub‐variation HSV
                                const v = 100 - gstep * (i + 1)
                                let subHsb: HSB
                                if (key < 0) {
                                    subHsb = {h: hsb.h, s: v, b: b0}
                                } else if (key === 0) {
                                    subHsb = {h: hsb.h, s: v, b: v}
                                } else {
                                    subHsb = {h: hsb.h, s: s0, b: v}
                                }
                                const rgbSub = HSBtoRGB(subHsb)
                                const bgSub = `#${RGBtoHex(rgbSub)}`
                                const isSubCurrent = subHsb.s === hsb.s && subHsb.b === hsb.b

                                return (
                                    <VariationLi
                                        className={isSubCurrent ? 'current' : ''}
                                        key={i}
                                        onClick={e => {
                                            e.stopPropagation()
                                            onColorSelect(subHsb)
                                        }}
                                        style={{background: bgSub}}
                                    />
                                )
                            })}
                        </SubVariationUl>
                    </ColorLi>
                )
            })}
        </ColorVariationUl>
    )
}
