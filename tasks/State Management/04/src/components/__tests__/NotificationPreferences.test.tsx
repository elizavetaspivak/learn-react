import {render, screen} from '@testing-library/react';
import { NotificationPreferences } from '../NotificationPreferences';
import { NotificationPreferencesForm } from '../../types/NotificationPreferences';
import {beforeEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

describe('NotificationPreferences', () => {
  const mockInitialConfig: NotificationPreferencesForm = {
    email: 'ttt@gmail.com',
    frequency: 'daily' ,
    time: '09:10',
    categories: ['news', 'updates'],
    maxNotifications: 5,
  };

  const mockInitialConfigWithBadTime: NotificationPreferencesForm = {
    email: 'ttt@gmail.com',
    frequency: 'daily' ,
    time: '21:10',
    categories: ['news', 'updates'],
    maxNotifications: 5,
  };


  const mockSave = vi.fn().mockImplementation(() => Promise.resolve());

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<NotificationPreferences initialValues={mockInitialConfig} onSubmit={mockSave} />);

    expect(screen.getByDisplayValue('ttt@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('daily')).toBeInTheDocument();
    expect(screen.getByDisplayValue('09:10')).toBeInTheDocument();
    expect(screen.getByText('news')).toBeInTheDocument();
    expect(screen.getByText('updates')).toBeInTheDocument();
    expect(screen.getByDisplayValue('5')).toBeInTheDocument();
    // TODO: Test that all form fields are rendered correctly
  });

  it('validates email format', async () => {
    render(<NotificationPreferences initialValues={mockInitialConfig} onSubmit={mockSave} />);

    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'ttt@gmail');

    const saveButton = screen.getByRole('button', { name: /save/i });
    await userEvent.click(saveButton);

    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    expect(mockSave).not.toHaveBeenCalled();
    // TODO: Test email validation
  });

  it('validates time format and range', async () => {
    render(<NotificationPreferences initialValues={mockInitialConfigWithBadTime} onSubmit={mockSave} />);

    const timeInput = screen.getByLabelText(/time/i);
    await userEvent.clear(timeInput);
    await userEvent.type(timeInput, '21:50');

    const saveButton = screen.getByRole('button', { name: /save/i });
    await userEvent.click(saveButton);

    expect(screen.getByText(/invalid time/i)).toBeInTheDocument();
    expect(mockSave).not.toHaveBeenCalled();
    // TODO: Test time validation
  });

  it('validates category selection', async () => {
    // TODO: Test category validation
  });

  it('validates max notifications range', async () => {
    render(<NotificationPreferences initialValues={mockInitialConfig} onSubmit={mockSave} />);

    const maxNotificationsInput = screen.getByLabelText(/maxNotifications/i);
    await userEvent.clear(maxNotificationsInput);
    await userEvent.type(maxNotificationsInput, '0');

    const saveButton = screen.getByRole('button', { name: /save/i });
    await userEvent.click(saveButton);

    expect(screen.getByText(/invalid maxNotifications/i)).toBeInTheDocument();
    expect(mockSave).not.toHaveBeenCalled();
    // TODO: Test max notifications validation
  });

  it('disables submit button when form is invalid', async () => {
    render(<NotificationPreferences initialValues={mockInitialConfigWithBadTime} onSubmit={mockSave} />);

    const saveButton = screen.getByRole('button', { name: /save/i });
    await userEvent.click(saveButton);

    expect(mockSave).not.toHaveBeenCalled();
    // TODO: Test submit button state
  });

  it('calls onSubmit with form data when valid', async () => {
    render(<NotificationPreferences initialValues={mockInitialConfig} onSubmit={mockSave} />);

    const saveButton = screen.getByRole('button', { name: /save/i });
    await userEvent.click(saveButton);

    expect(mockSave).toHaveBeenCalled();
    // TODO: Test form submission
  });
});
