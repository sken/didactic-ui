import styled from "styled-components";
import React from "react";
import {useDraggable} from "./hooks/useDraggable";
import {HUE_SLIDER_STEP, HUE_SLIDER_WIDTH, hueFromOffset} from "./colorUtils";

const Box = styled.div`
    position: absolute;
    width: 18px;
    height: 18px;
    border: 1px solid #000;
    cursor: grab;
    user-select: none;
    touch-action: none;

    &:focus-visible {
        outline: 2px solid #000;
        outline-offset: 2px;
    }
`

const RainbowBar = styled.div`
    position: relative;
    height: 20px;
    background: linear-gradient(
            to right,
            hsl(0, 100%, 50%),
            hsl(60, 100%, 50%),
            hsl(120, 100%, 50%),
            hsl(180, 100%, 50%),
            hsl(240, 100%, 50%),
            hsl(300, 100%, 50%),
            hsl(360, 100%, 50%)
    );
`

export interface DraggableProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragEnd'> {
    /** Handle position in px (controlled). */
    x?: number
    /** Called on every move while dragging (unsnapped px). */
    onDrag?: (x: number) => void
    /** Called once on release, or on a key press, with the snapped px. */
    onDragEnd: (x: number) => void
}

export function Draggable({x, onDrag, onDragEnd, ...props}: DraggableProps): React.JSX.Element {

    const {ref, onPointerDown} = useDraggable<HTMLDivElement>({
        axis: 'x',
        bounds: {left: 0, right: HUE_SLIDER_WIDTH},
        grid: [HUE_SLIDER_STEP, 0],
        position: x === undefined ? undefined : {x, y: 0},
        onDrag: onDrag ? (nx) => { onDrag(nx) } : undefined,
        onDragEnd: (nx) => { onDragEnd(nx) },
    })

    const current = x ?? 0
    const onKeyDown = (e: React.KeyboardEvent): void => {
        const next = {
            ArrowLeft: current - HUE_SLIDER_STEP,
            ArrowDown: current - HUE_SLIDER_STEP,
            ArrowRight: current + HUE_SLIDER_STEP,
            ArrowUp: current + HUE_SLIDER_STEP,
            Home: 0,
            End: HUE_SLIDER_WIDTH,
        }[e.key]
        if (next === undefined) return
        e.preventDefault()
        onDragEnd(Math.min(HUE_SLIDER_WIDTH, Math.max(0, next)))
    }

    return (
        <RainbowBar {...props}>
            <Box
                aria-label="Hue Slider"
                aria-valuemax={360}
                aria-valuemin={0}
                aria-valuenow={hueFromOffset(current, true)}
                onKeyDown={onKeyDown}
                onPointerDown={onPointerDown}
                ref={ref}
                role="slider"
                tabIndex={0}
            />
        </RainbowBar>
    )
}
