import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {UserDashboard} from '../UserDashboard';
import {server} from '../../setupTests';
import {describe, expect, it} from 'vitest';
import {http, HttpResponse} from "msw";

describe('UserDashboard', () => {
    it('renders loading state initially', () => {
        render(<UserDashboard/>);
        expect(screen.getByText('Loading db.json...')).toBeInTheDocument();
    });

    it('renders db.json after loading', async () => {
        render(<UserDashboard/>);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        });
    });

    it('shows error when loading fails', async () => {
        server.use(
            http.get('/users', () => {
               return new HttpResponse(null, {
                    status: 500,
                    statusText: 'Server error',
                })
            })
        );

        render(<UserDashboard/>);

        await waitFor(() => {
            expect(screen.getByText(/error/i)).toBeInTheDocument();
        });
    });

    it('shows user details when clicking view details', async () => {
        render(<UserDashboard/>);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        fireEvent.click(screen.getAllByText('View Details')[0]);

        await waitFor(() => {
            expect(screen.getByText('User Details')).toBeInTheDocument();
            expect(screen.getByText(/john@example.com/)).toBeInTheDocument();
        });
    });

    it('allows editing user details', async () => {
        render(<UserDashboard/>);

        // Ждем загрузки пользователей
        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        // Открываем детали
        fireEvent.click(screen.getAllByText('View Details')[0]);

        // Ждем загрузки деталей
        await waitFor(() => {
            expect(screen.getByText('User Details')).toBeInTheDocument();
        });

        // Нажимаем кнопку редактирования
        fireEvent.click(screen.getByText('Edit'));

        // Изменяем имя
        const nameInput = screen.getByLabelText('Name:') as HTMLInputElement;
        await userEvent.clear(nameInput);
        await userEvent.type(nameInput, 'John Updated');

        // Сохраняем изменения
        fireEvent.click(screen.getByText('Save'));

        // Проверяем, что изменения отображаются
        await waitFor(() => {
            expect(screen.getByText('John Updated')).toBeInTheDocument();
        });
    });

    it('handles save errors', async () => {
        server.use(
            http.put('/users/:id', () => {
                return new HttpResponse(null, {
                    status: 500,
                    statusText: 'Save failed',
                })
            })
        );

        render(<UserDashboard/>);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        fireEvent.click(screen.getAllByText('View Details')[0]);

        await waitFor(() => {
            expect(screen.getByText('User Details')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Edit'));
        fireEvent.click(screen.getByText('Save'));

        await waitFor(() => {
            expect(screen.getByText(/error/i)).toBeInTheDocument();
        });
    });

    it('cancels editing without saving', async () => {
        render(<UserDashboard/>);

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });

        fireEvent.click(screen.getAllByText('View Details')[0]);

        await waitFor(() => {
            expect(screen.getByText('User Details')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Edit'));

        const nameInput = screen.getByLabelText('Name:') as HTMLInputElement;
        await userEvent.clear(nameInput);
        await userEvent.type(nameInput, 'John Changed');

        fireEvent.click(screen.getByText('Cancel'));

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
        });
    });
});
