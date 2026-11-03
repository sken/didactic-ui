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
    /** Called on every move while dragging, before grid snapping. */
    onDrag?: (x: number, y: number) => void
    /** Called once on release, with the snapped position. */
    onDragEnd?: (x: number, y: number) => void
    initial?: { x: number; y: number }
    /**
     * Controlled position. When it changes (and no drag is running) the
     * element moves there, e.g. when the parent gets a new initial colour.
     */
    position?: { x: number; y: number }
    /**
     * CSS transition for the snap animation on release.
     * e.g. "transform 200ms ease-out"
     */
    dropTransition?: string
}

export interface UseDraggableResult<T extends HTMLElement> {
    ref: React.RefObject<T>
    onPointerDown: (e: React.PointerEvent) => void
}

/**
 * Drag an element with mouse, pen or touch (pointer events with pointer
 * capture), clamped to bounds and snapped to a grid on release.
 */
export function useDraggable<T extends HTMLElement>(
    opts: UseDraggableOptions = {}
): UseDraggableResult<T> {
    const {
        axis     = 'both',
        bounds   = {},
        grid     = [1, 1],
        initial,
        position,
        dropTransition = 'transform 200ms ease-out',
    } = opts

    const ref = useRef<T>(null)
    const draggingRef = useRef(false)
    // where the pointer was on pointerdown
    const startRef = useRef({ x: 0, y: 0 })
    // translate values at the start of this drag
    const baseRef = useRef({
        x: position?.x ?? initial?.x ?? bounds.left ?? 0,
        y: position?.y ?? initial?.y ?? bounds.top  ?? 0,
    })
    // latest options, so the listeners never see stale callbacks or bounds
    const optsRef = useRef(opts)
    optsRef.current = opts

    const apply = (x: number, y: number): void => {
        const el = ref.current
        if (el) el.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }

    const clamp = (x: number, y: number): [number, number] => {
        const {left = -Infinity, right = Infinity, top = -Infinity, bottom = Infinity} = optsRef.current.bounds ?? {}
        return [Math.min(right, Math.max(left, x)), Math.min(bottom, Math.max(top, y))]
    }

    // position the element on mount, and whenever the controlled position changes
    const px = position?.x
    const py = position?.y
    useEffect(() => {
        if (draggingRef.current) return
        if (px !== undefined) baseRef.current.x = px
        if (py !== undefined) baseRef.current.y = py
        apply(baseRef.current.x, baseRef.current.y)
    }, [px, py])

    const onPointerMove = useCallback((e: PointerEvent) => {
        if (!draggingRef.current) return
        let dx = e.clientX - startRef.current.x
        let dy = e.clientY - startRef.current.y
        if (axis === 'x') dy = 0
        if (axis === 'y') dx = 0
        const [x, y] = clamp(baseRef.current.x + dx, baseRef.current.y + dy)
        apply(x, y)
        optsRef.current.onDrag?.(x, y)
    }, [axis])

    const onPointerUp = useCallback((e: PointerEvent) => {
        if (!draggingRef.current) return
        draggingRef.current = false
        const el = ref.current
        if (!el) return
        el.removeEventListener('pointermove', onPointerMove)
        el.removeEventListener('pointerup', onPointerUp)
        el.removeEventListener('pointercancel', onPointerUp)
        if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId)

        const matrix = new DOMMatrixReadOnly(window.getComputedStyle(el).transform)
        let finalX = matrix.m41
        let finalY = matrix.m42
        const [gX, gY] = optsRef.current.grid ?? grid
        if (gX > 0) finalX = Math.round(finalX / gX) * gX
        if (gY > 0) finalY = Math.round(finalY / gY) * gY
        ;[finalX, finalY] = clamp(finalX, finalY)

        // animate the snap; report right away (a zero-distance snap fires no transitionend)
        el.style.transition = dropTransition
        requestAnimationFrame(() => { apply(finalX, finalY) })
        const onEnd = (): void => {
            el.style.transition = ''
            el.removeEventListener('transitionend', onEnd)
        }
        el.addEventListener('transitionend', onEnd)
        baseRef.current = { x: finalX, y: finalY }
        optsRef.current.onDragEnd?.(finalX, finalY)
    }, [grid, dropTransition, onPointerMove])

    const onPointerDown = useCallback((e: React.PointerEvent) => {
        if (e.button !== 0) return
        const el = ref.current
        if (!el) return
        e.preventDefault()
        el.style.transition = 'none'
        const matrix = new DOMMatrixReadOnly(window.getComputedStyle(el).transform)
        baseRef.current = { x: matrix.m41, y: matrix.m42 }
        draggingRef.current = true
        startRef.current = { x: e.clientX, y: e.clientY }
        // pointer capture: moves keep arriving even outside the element, also for touch
        el.setPointerCapture(e.pointerId)
        el.addEventListener('pointermove', onPointerMove)
        el.addEventListener('pointerup', onPointerUp)
        el.addEventListener('pointercancel', onPointerUp)
    }, [onPointerMove, onPointerUp])

    return { ref, onPointerDown }
}
