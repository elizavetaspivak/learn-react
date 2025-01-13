import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductConfigurator } from '../ProductConfigurator';
import { ProductConfig } from '../../types/ProductConfig';

describe('ProductConfigurator', () => {
  const mockInitialConfig: ProductConfig = {
    basics: {
      color: 'red',
      size: 'medium',
      material: 'cotton',
    },
    features: {
      waterproof: {
        enabled: false,
        level: 'basic',
        settings: {},
      },
    },
    addons: [
      {
        id: 'gift-wrap',
        quantity: 1,
        customization: {
          color: 'blue',
        },
      },
    ],
  };

  const mockSave = vi.fn().mockImplementation(() => Promise.resolve());

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with initial configuration', () => {
    render(<ProductConfigurator initialConfig={mockInitialConfig} onSave={mockSave} />);
    
    expect(screen.getByDisplayValue('red')).toBeInTheDocument();
    expect(screen.getByDisplayValue('medium')).toBeInTheDocument();
    expect(screen.getByDisplayValue('cotton')).toBeInTheDocument();
  });

  it('updates basic settings correctly', async () => {
    render(<ProductConfigurator initialConfig={mockInitialConfig} onSave={mockSave} />);
    
    const colorInput = screen.getByLabelText(/color/i);
    await userEvent.clear(colorInput);
    await userEvent.type(colorInput, 'blue');
    
    expect(screen.getByDisplayValue('blue')).toBeInTheDocument();
  });

  it('toggles features correctly', async () => {
    render(<ProductConfigurator initialConfig={mockInitialConfig} onSave={mockSave} />);
    
    const waterproofToggle = screen.getByRole('switch', { name: /waterproof/i });
    await userEvent.click(waterproofToggle);
    
    expect(waterproofToggle).toBeChecked();
  });

  it('manages addons correctly', async () => {
    render(<ProductConfigurator initialConfig={mockInitialConfig} onSave={mockSave} />);
    
    const quantityInput = screen.getByLabelText(/gift-wrap quantity/i);
    await userEvent.clear(quantityInput);
    await userEvent.type(quantityInput, '2');
    
    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
  });

  it('tracks changes in history', async () => {
    render(<ProductConfigurator initialConfig={mockInitialConfig} onSave={mockSave} />);
    
    const colorInput = screen.getByLabelText(/color/i);
    await userEvent.clear(colorInput);
    await userEvent.type(colorInput, 'blue');
    
    expect(screen.getByText(/changed color to blue/i)).toBeInTheDocument();
  });

  it('allows undoing changes', async () => {
    render(<ProductConfigurator initialConfig={mockInitialConfig} onSave={mockSave} />);
    
    const colorInput = screen.getByLabelText(/color/i);
    await userEvent.clear(colorInput);
    await userEvent.type(colorInput, 'blue');
    
    const undoButton = screen.getByRole('button', { name: /undo/i });
    await userEvent.click(undoButton);
    
    expect(screen.getByDisplayValue('red')).toBeInTheDocument();
  });

  it('validates configuration before saving', async () => {
    render(<ProductConfigurator initialConfig={mockInitialConfig} onSave={mockSave} />);
    
    const quantityInput = screen.getByLabelText(/gift-wrap quantity/i);
    await userEvent.clear(quantityInput);
    await userEvent.type(quantityInput, '999');
    
    const saveButton = screen.getByRole('button', { name: /save/i });
    await userEvent.click(saveButton);
    
    expect(screen.getByText(/invalid quantity/i)).toBeInTheDocument();
    expect(mockSave).not.toHaveBeenCalled();
  });

  it('handles batch updates correctly', async () => {
    render(<ProductConfigurator initialConfig={mockInitialConfig} onSave={mockSave} />);
    
    const applyPresetButton = screen.getByRole('button', { name: /apply preset/i });
    await userEvent.click(applyPresetButton);
    
    // Should record only one history entry for multiple changes
    const historyEntries = screen.getAllByRole('listitem', { name: /change history entry/i });
    expect(historyEntries).toHaveLength(1);
  });
});
