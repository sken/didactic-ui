import type {HSB, RGB} from './types'

export function HSBtoRGB(hsb: HSB): RGB {
    let h = Math.round(hsb.h)
    const s = Math.round(hsb.s * 255 / 100)
    const b = Math.round(hsb.b * 255 / 100)
    let r, g, bl
    if (s === 0) {
        r = b
        g = b
        bl = b
    } else {
        const t1 = b
        const t2 = ((255 - s) * b) / 255
        const t3 = (t1 - t2) * (h % 60) / 60
        if (h === 360) h = 0
        if (h < 60) {
            r = t1;
            g = t2 + t3;
            bl = t2
        } else if (h < 120) {
            r = t1 - t3;
            g = t1;
            bl = t2
        } else if (h < 180) {
            r = t2;
            g = t1;
            bl = t2 + t3
        } else if (h < 240) {
            r = t2;
            g = t1 - t3;
            bl = t1
        } else if (h < 300) {
            r = t2 + t3;
            g = t2;
            bl = t1
        } else {
            r = t1;
            g = t2;
            bl = t1 - t3
        }
    }
    return {
        r: Math.round(r),
        g: Math.round(g),
        b: Math.round(bl),
    }
}

export function RGBtoHSB({r, g, b}: RGB): HSB {
    const min = Math.min(r, g, b)
    const max = Math.max(r, g, b)
    const delta = max - min
    let h = 0
    const s = max === 0 ? 0 : (255 * delta) / max
    const v = max
    if (s !== 0) {
        if (r === max) {
            h = (g - b) / delta
        } else if (g === max) {
            h = 2 + (b - r) / delta
        } else {
            h = 4 + (r - g) / delta
        }
    }
    h = h * 60
    if (h < 0) h += 360
    return {
        h: Math.round(h),
        s: Math.round((s * 100) / 255),
        b: Math.round((v * 100) / 255),
    }
}

export function RGBtoHex({r, g, b}: RGB): string {
    const hr = r.toString(16).padStart(2, '0')
    const hg = g.toString(16).padStart(2, '0')
    const hb = b.toString(16).padStart(2, '0')
    return `${hr}${hg}${hb}`
}

/** The hue slider: 840 px for 360 degrees, in 20 steps of 42 px (18 degrees). */
export const HUE_SLIDER_WIDTH = 840
export const HUE_SLIDER_STEP = 42

/** Hue (0-360) at a slider offset in px, clamped. With `snap`, to the nearest 18-degree step. */
export function hueFromOffset(x: number, snap = false): number {
    const clamped = Math.min(HUE_SLIDER_WIDTH, Math.max(0, x))
    const px = snap ? Math.round(clamped / HUE_SLIDER_STEP) * HUE_SLIDER_STEP : clamped
    return Math.round((px / HUE_SLIDER_WIDTH) * 360)
}

/** Slider offset in px for a hue, on the 18-degree grid. */
export function offsetFromHue(h: number): number {
    const steps = HUE_SLIDER_WIDTH / HUE_SLIDER_STEP
    return Math.round((((h % 360) + 360) % 360) / 360 * steps) * HUE_SLIDER_STEP
}
