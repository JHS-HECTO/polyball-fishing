import '@testing-library/jest-dom/vitest';

// jsdom 25 ships without a PointerEvent constructor. testing-library's
// fireEvent.pointerXxx falls back to a generic Event when PointerEvent is
// missing, which drops clientX/clientY/pointerId. Polyfill with a thin
// subclass of MouseEvent so the init dictionary survives.
if (typeof globalThis.PointerEvent === 'undefined') {
  class PointerEventPolyfill extends MouseEvent {
    pointerId: number;
    pointerType: string;
    isPrimary: boolean;

    constructor(type: string, init: PointerEventInit = {}) {
      super(type, init);
      this.pointerId = init.pointerId ?? 0;
      this.pointerType = init.pointerType ?? 'mouse';
      this.isPrimary = init.isPrimary ?? true;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).PointerEvent = PointerEventPolyfill;
}

// jsdom doesn't implement setPointerCapture/releasePointerCapture either.
if (typeof Element !== 'undefined') {
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = function () {};
  }
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = function () {};
  }
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = function () {
      return false;
    };
  }
}
