import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Profile from '../Profile';
import api from '../../config/ConfigAPI';

jest.mock('../../config/ConfigAPI');

describe('Profile', () => {
  it('displays the user profile after loading', async () => {
    const mockUser = {
      id: '1',
      avatar: {
        id: 1,
        image_high_url: 'url',
        image_medium_url: 'url',
        image_low_url: 'url',
      },
      name: 'Test User',
      last_name: 'Last Name',
      email: 'test@example.com',
      role: { value: 1, label: 'User' },
      last_login: '2024-05-18T00:57:54Z',
      staff_role: { value: 1, label: 'Staff' },
    };

    (api.get as jest.Mock).mockResolvedValue({ data: mockUser });

    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Profile />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => screen.getByText('Your Name'));

    expect(screen.getByText('Your Name')).toBeInTheDocument();
    expect(screen.getByText('Your E-mail')).toBeInTheDocument();
    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
  });

  it('logs out the user', async () => {
    const mockUser = {
      id: '1',
      avatar: {
        id: 1,
        image_high_url: 'url',
        image_medium_url: 'url',
        image_low_url: 'url',
      },
      name: 'Test User',
      last_name: 'Last Name',
      email: 'test@example.com',
      role: { value: 1, label: 'User' },
      last_login: '2024-05-18T00:57:54Z',
      staff_role: { value: 1, label: 'Staff' },
    };

    (api.get as jest.Mock).mockResolvedValue({ data: mockUser });

    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Profile />
      </MemoryRouter>
    );

    // Wait for profile to load
    await waitFor(() => screen.getByText('Your Name'));

    // Simulate logout button click
    const logoutButton = screen.getByText('Logout');
    expect(logoutButton).toBeInTheDocument();
    fireEvent.click(logoutButton);

    // Ensure user is logged out
    expect(localStorage.getItem('token')).toBeNull();
  });
});