import { render, screen } from '@testing-library/react-native';
import { NativeWindTest } from '../NativeWindTest';

describe('NativeWindTest', () => {
  it('renders the title', () => {
    render(<NativeWindTest />);

    expect(screen.getByText('NativeWind Test')).toBeTruthy();
  });

  it('renders the success message', () => {
    render(<NativeWindTest />);

    expect(screen.getByText('Tailwind CSS is working in React Native! 🎉')).toBeTruthy();
  });

  it('renders the dark mode indicator', () => {
    render(<NativeWindTest />);

    expect(screen.getByText('Dark mode classes are configured ✓')).toBeTruthy();
  });

  it('renders the button', () => {
    render(<NativeWindTest />);

    expect(screen.getByText('Press Me')).toBeTruthy();
  });

  it('renders typography examples', () => {
    render(<NativeWindTest />);

    expect(screen.getByText('Extra Small Text')).toBeTruthy();
    expect(screen.getByText('Small Text')).toBeTruthy();
    expect(screen.getByText('Base Text')).toBeTruthy();
    expect(screen.getByText('Large Medium')).toBeTruthy();
    expect(screen.getByText('Extra Large Bold')).toBeTruthy();
  });
});
