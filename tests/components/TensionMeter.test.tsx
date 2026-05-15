import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TensionMeter } from 'components/Fight/TensionMeter';

describe('TensionMeter', () => {
  it('renders with width = value%', () => {
    render(<TensionMeter value={42} />);
    const fill = screen.getByTestId('tension-fill');
    expect(fill.style.width).toBe('42%');
  });

  it('uses safe state below 50', () => {
    render(<TensionMeter value={30} />);
    expect(screen.getByTestId('tension-fill').getAttribute('data-state')).toBe('safe');
  });

  it('uses warning state at 50-79', () => {
    render(<TensionMeter value={65} />);
    expect(screen.getByTestId('tension-fill').getAttribute('data-state')).toBe('warning');
  });

  it('uses danger state at 80+', () => {
    render(<TensionMeter value={85} />);
    expect(screen.getByTestId('tension-fill').getAttribute('data-state')).toBe('danger');
  });

  it('clamps over 100', () => {
    render(<TensionMeter value={150} />);
    expect(screen.getByTestId('tension-fill').style.width).toBe('100%');
  });
});
