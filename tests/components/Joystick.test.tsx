import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Joystick } from 'components/Fight/Joystick';

describe('Joystick', () => {
  it('renders the base knob', () => {
    render(<Joystick onChange={() => {}} />);
    expect(screen.getByTestId('joystick-knob')).toBeInTheDocument();
  });

  it('reports horizontal direction on pointer move', () => {
    const onChange = vi.fn();
    render(<Joystick onChange={onChange} />);
    const base = screen.getByTestId('joystick-base');
    Object.defineProperty(base, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 100, height: 100, right: 100, bottom: 100, x: 0, y: 0, toJSON: () => '' }),
    });
    fireEvent.pointerDown(base, { clientX: 50, clientY: 50, pointerId: 1 });
    fireEvent.pointerMove(base, { clientX: 90, clientY: 50, pointerId: 1 });
    const last = onChange.mock.calls.at(-1)?.[0];
    expect(last?.x).toBeGreaterThan(0.5);
  });

  it('resets to zero on pointer up', () => {
    const onChange = vi.fn();
    render(<Joystick onChange={onChange} />);
    const base = screen.getByTestId('joystick-base');
    Object.defineProperty(base, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 100, height: 100, right: 100, bottom: 100, x: 0, y: 0, toJSON: () => '' }),
    });
    fireEvent.pointerDown(base, { clientX: 50, clientY: 50, pointerId: 1 });
    fireEvent.pointerMove(base, { clientX: 90, clientY: 50, pointerId: 1 });
    fireEvent.pointerUp(base, { clientX: 90, clientY: 50, pointerId: 1 });
    const last = onChange.mock.calls.at(-1)?.[0];
    expect(last?.x).toBe(0);
    expect(last?.y).toBe(0);
  });
});
