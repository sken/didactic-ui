import styled from "styled-components";
import React from "react";
import {useDraggable} from "./hooks/useDraggable";

const Box = styled.div`
    position: absolute;
    width: 18px;
    height: 18px;
    border: 1px solid #000;
    cursor: grab;
    user-select: none;
    touch-action: none;
`

const RainbowBar = styled.div`
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

interface DraggableProps {
    onDragEnd: (x: number, y: number) => void
}

export default function Draggable({onDragEnd}: DraggableProps): React.JSX.Element {

    const {ref, onMouseDown} = useDraggable<HTMLDivElement>({
        axis: 'x',
        bounds: {left: 0, right: 42 * (360 / 18)},
        grid: [42, 0],
        onDragEnd
    })

    return (
        <RainbowBar>
            <Box onMouseDown={onMouseDown} ref={ref}/>
        </RainbowBar>
    )
}