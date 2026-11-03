import { describe, it, expect } from 'vitest';
import { HSBtoRGB, RGBtoHSB, RGBtoHex, hueFromOffset, offsetFromHue } from './colorUtils';

describe('colorUtils', () => {
    describe('HSBtoRGB', () => {
        it('converts red correctly', () => {
            const rgb = HSBtoRGB({ h: 0, s: 100, b: 100 });
            expect(rgb).toEqual({ r: 255, g: 0, b: 0 });
        });

        it('converts white correctly', () => {
            const rgb = HSBtoRGB({ h: 0, s: 0, b: 100 });
            expect(rgb).toEqual({ r: 255, g: 255, b: 255 });
        });

        it('converts black correctly', () => {
            const rgb = HSBtoRGB({ h: 0, s: 0, b: 0 });
            expect(rgb).toEqual({ r: 0, g: 0, b: 0 });
        });
        
        it('converts green correctly', () => {
            const rgb = HSBtoRGB({ h: 120, s: 100, b: 100 });
            expect(rgb).toEqual({ r: 0, g: 255, b: 0 });
        });

        it('converts blue correctly', () => {
            const rgb = HSBtoRGB({ h: 240, s: 100, b: 100 });
            expect(rgb).toEqual({ r: 0, g: 0, b: 255 });
        });
    });

    describe('RGBtoHSB', () => {
        it('converts red correctly', () => {
            const hsb = RGBtoHSB({ r: 255, g: 0, b: 0 });
            expect(hsb).toEqual({ h: 0, s: 100, b: 100 });
        });

        it('converts white correctly', () => {
            const hsb = RGBtoHSB({ r: 255, g: 255, b: 255 });
            expect(hsb).toEqual({ h: 0, s: 0, b: 100 });
        });

        it('converts black correctly', () => {
            const hsb = RGBtoHSB({ r: 0, g: 0, b: 0 });
            expect(hsb).toEqual({ h: 0, s: 0, b: 0 });
        });

        it('converts green correctly', () => {
            const hsb = RGBtoHSB({ r: 0, g: 255, b: 0 });
            expect(hsb).toEqual({ h: 120, s: 100, b: 100 });
        });

        it('converts blue correctly', () => {
            const hsb = RGBtoHSB({ r: 0, g: 0, b: 255 });
            expect(hsb).toEqual({ h: 240, s: 100, b: 100 });
        });
    });

    describe('RGBtoHex', () => {
        it('converts red correctly', () => {
            const hex = RGBtoHex({ r: 255, g: 0, b: 0 });
            expect(hex).toBe('ff0000');
        });

        it('converts white correctly', () => {
            const hex = RGBtoHex({ r: 255, g: 255, b: 255 });
            expect(hex).toBe('ffffff');
        });

        it('converts black correctly', () => {
            const hex = RGBtoHex({ r: 0, g: 0, b: 0 });
            expect(hex).toBe('000000');
        });
        
        it('pads single digits with zero', () => {
            const hex = RGBtoHex({ r: 15, g: 10, b: 5 });
            expect(hex).toBe('0f0a05');
        });
    });

    describe('hue slider offsets', () => {
        it('maps the slider ends to 0 and 360 degrees', () => {
            expect(hueFromOffset(0)).toBe(0);
            expect(hueFromOffset(840)).toBe(360);
            expect(hueFromOffset(420)).toBe(180);
        });

        it('clamps offsets outside the slider', () => {
            expect(hueFromOffset(-30)).toBe(0);
            expect(hueFromOffset(900)).toBe(360);
        });

        it('snaps to 18-degree steps', () => {
            expect(hueFromOffset(50, true)).toBe(18);
            expect(hueFromOffset(62, true)).toBe(18);
            expect(hueFromOffset(64, true)).toBe(36);
        });

        it('places a hue on the 42 px grid', () => {
            expect(offsetFromHue(0)).toBe(0);
            expect(offsetFromHue(5)).toBe(0);
            expect(offsetFromHue(10)).toBe(42);
            expect(offsetFromHue(220)).toBe(504);
            expect(offsetFromHue(360)).toBe(0);
        });
    });
});
