import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../Login';
import api from '../../config/ConfigAPI';

jest.mock('../../config/ConfigAPI');

describe('Login', () => {
  it('renders the login form', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('displays validation errors when the form is submitted with empty fields', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument();
    });
  });

  it('displays an error message when login fails', async () => {
    const mockError = { response: { data: { detail: 'Invalid credentials' } } };
    (api.post as jest.Mock).mockRejectedValue(mockError);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'invalid@example.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('redirects to the profile page on successful login', async () => {
    const mockUserData = {
      user: {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        is_active: true,
        avatar: null,
        type: 'User',
        created: '2024-05-18T00:57:54Z',
        modified: '2024-05-18T00:57:54Z',
        role: 'User',
      },
      tokens: {
        refresh: 'refresh_token',
        access: 'access_token',
      },
    };
    (api.post as jest.Mock).mockResolvedValue({ data: mockUserData });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe(mockUserData.tokens.access);
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });
});