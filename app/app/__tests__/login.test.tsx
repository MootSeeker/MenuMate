/**
 * Tests for Login Screen
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import LoginScreen from '../auth/login';
import { useAuthStore } from '@/features/auth/stores';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock auth store
jest.mock('@/features/auth/stores', () => ({
  useAuthStore: jest.fn(),
}));

describe('LoginScreen', () => {
  const mockSignIn = jest.fn();
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      signIn: mockSignIn,
    });
  });

  it('should render login form', () => {
    render(<LoginScreen />);

    expect(screen.getByText('MenuMate')).toBeTruthy();
    expect(screen.getByText('Willkommen zurück')).toBeTruthy();
    expect(screen.getByPlaceholderText('deine@email.de')).toBeTruthy();
    expect(screen.getByPlaceholderText('Dein Passwort')).toBeTruthy();
    expect(screen.getByText('Anmelden')).toBeTruthy();
  });

  it('should show validation errors for empty fields', async () => {
    render(<LoginScreen />);

    const submitButton = screen.getByText('Anmelden');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(screen.getByText('E-Mail ist erforderlich')).toBeTruthy();
      expect(screen.getByText('Passwort ist erforderlich')).toBeTruthy();
    });
  });

  it('should show validation error for invalid email', async () => {
    render(<LoginScreen />);

    const emailInput = screen.getByPlaceholderText('deine@email.de');
    fireEvent.changeText(emailInput, 'invalid-email');

    const submitButton = screen.getByText('Anmelden');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Bitte eine gültige E-Mail eingeben')).toBeTruthy();
    });
  });

  it('should call signIn with valid credentials', async () => {
    mockSignIn.mockResolvedValue({ success: true });

    render(<LoginScreen />);

    const emailInput = screen.getByPlaceholderText('deine@email.de');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByText('Anmelden');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('should call signIn when login fails', async () => {
    mockSignIn.mockRejectedValue(new Error('Invalid credentials'));

    render(<LoginScreen />);

    const emailInput = screen.getByPlaceholderText('deine@email.de');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByText('Anmelden');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'wrongpassword');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
    });
  });

  it('should show loading state during submission', async () => {
    mockSignIn.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 100))
    );

    render(<LoginScreen />);

    const emailInput = screen.getByPlaceholderText('deine@email.de');
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByText('Anmelden');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(submitButton);

    // Check that button shows loading state
    await waitFor(() => {
      expect(screen.queryByText('Anmeldung läuft...')).toBeTruthy();
    });

    // Wait for login to complete
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalled();
    });
  });

  it('should render register link', () => {
    render(<LoginScreen />);

    expect(screen.getByText('Noch kein Konto?')).toBeTruthy();
    expect(screen.getByText('Jetzt registrieren')).toBeTruthy();
  });

  it('should render forgot password placeholder', () => {
    render(<LoginScreen />);

    expect(screen.getByText('Passwort vergessen? (Demnächst verfügbar)')).toBeTruthy();
  });
});
