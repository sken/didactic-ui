import type {HSB, RGB} from './types'

export function HSBtoRGB({h, s, b}: HSB): RGB {
    h = Math.round(h)
    s = Math.round(s * 255 / 100)
    b = Math.round(b * 255 / 100)
    let r, g, bl
    if (s === 0) {
        r = g = bl = b
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