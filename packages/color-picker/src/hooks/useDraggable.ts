import {
    useRef,
    useCallback,
    useEffect,
} from 'react'

type Axis   = 'both' | 'x' | 'y'
type Bounds = { left?: number; right?: number; top?: number; bottom?: number }
type Grid   = [number, number]

export interface UseDraggableOptions {
    axis?: Axis
    bounds?: Bounds
    grid?: Grid
    onDrag?: (x: number, y: number) => void
    onDragEnd?: (x: number, y: number) => void
    initial?: { x: number; y: number }
    /**
     * CSS transition for the snap animation on release.
     * e.g. "transform 200ms ease-out"
     */
    dropTransition?: string
}

export function useDraggable<T extends HTMLElement>(
    opts: UseDraggableOptions = {}
): { ref: React.RefObject<T>; onMouseDown: (e: React.MouseEvent) => void } {
    const {
        axis     = 'both',
        bounds   = {},
        grid     = [1, 1],
        onDrag,
        onDragEnd,
        initial,
        dropTransition = 'transform 200ms ease-out',
    } = opts

    // ref to the DOM node
    const ref = useRef<T>(null)

    // are we in a drag session?
    const draggingRef = useRef(false)

    // where the pointer was on mousedown
    const startRef = useRef({ x: 0, y: 0 })

    // base translate values at the start of this drag
    const baseRef = useRef({
        x: initial?.x ?? bounds.left ?? 0,
        y: initial?.y ?? bounds.top  ?? 0,
    })

    // helper to set transform
    const apply = (x: number, y: number) => {
        const el = ref.current!
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }

    // position element on mount
    useEffect(() => {
        apply(baseRef.current.x, baseRef.current.y)
    }, [])

    // ─── L I V E   D R A G ───────────────────────────────
    // only clamp to bounds, no grid snapping here
    const onMouseMove = useCallback((e: MouseEvent) => {
        if (!draggingRef.current) return

        let dx = e.clientX - startRef.current.x
        let dy = e.clientY - startRef.current.y

        if (axis === 'x') dy = 0
        if (axis === 'y') dx = 0

        let newX = baseRef.current.x + dx
        let newY = baseRef.current.y + dy

        // clamp to bounds only
        if (bounds.left   != null && newX < bounds.left)   newX = bounds.left
        if (bounds.right  != null && newX > bounds.right)  newX = bounds.right
        if (bounds.top    != null && newY < bounds.top)    newY = bounds.top
        if (bounds.bottom != null && newY > bounds.bottom) newY = bounds.bottom

        apply(newX, newY)
        onDrag?.(newX, newY)
    }, [axis, bounds, onDrag])

    // ─── O N   R E L E A S E ─────────────────────────────
    const onMouseUp = useCallback(() => {
        if (!draggingRef.current) return
        draggingRef.current = false

        const el = ref.current!
        // read the *actual* transform at drag‐end
        const style  = window.getComputedStyle(el)
        const matrix = new DOMMatrixReadOnly(style.transform)
        let finalX = matrix.m41
        let finalY = matrix.m42

        // now **snap to grid** and re‐clamp
        const [gX, gY] = grid
        if (gX > 0) finalX = Math.round(finalX / gX) * gX
        if (gY > 0) finalY = Math.round(finalY / gY) * gY

        if (bounds.left   != null && finalX < bounds.left)   finalX = bounds.left
        if (bounds.right  != null && finalX > bounds.right)  finalX = bounds.right
        if (bounds.top    != null && finalY < bounds.top)    finalY = bounds.top
        if (bounds.bottom != null && finalY > bounds.bottom) finalY = bounds.bottom

        // always a non-zero delta now → safe to add transition
        el.style.transition = dropTransition

        // trigger the transition next frame
        requestAnimationFrame(() => apply(finalX, finalY))

        // cleanup after transition
        const onEnd = () => {
            el.style.transition = ''
            el.removeEventListener('transitionend', onEnd)
            baseRef.current.x = finalX
            baseRef.current.y = finalY
            onDragEnd?.(finalX, finalY)
        }
        el.addEventListener('transitionend', onEnd)

        // remove global listeners
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup',   onMouseUp)
    }, [grid, bounds, dropTransition, onDragEnd, onMouseMove])

    // ─── S T A R T   D R A G ─────────────────────────────
    const onMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault()
        const el = ref.current!

        // kill any lingering transition
        el.style.transition = 'none'

        // read *current* transform into our base
        const style  = window.getComputedStyle(el)
        const matrix = new DOMMatrixReadOnly(style.transform)
        baseRef.current.x = matrix.m41
        baseRef.current.y = matrix.m42

        draggingRef.current = true
        startRef.current = { x: e.clientX, y: e.clientY }

        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup',   onMouseUp)
    }, [onMouseMove, onMouseUp])

    return { ref, onMouseDown }
}