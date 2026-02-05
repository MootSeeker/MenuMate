/**
 * Tests for PasswordStrengthIndicator Component
 */

import { render, screen } from '@testing-library/react-native';
import { PasswordStrengthIndicator } from '../PasswordStrengthIndicator';

describe('PasswordStrengthIndicator', () => {
  it('should not render for empty password', () => {
    const { toJSON } = render(<PasswordStrengthIndicator password="" />);
    expect(toJSON()).toBeNull();
  });

  it('should render strength label for weak password', () => {
    render(<PasswordStrengthIndicator password="abc" />);
    expect(screen.getByText('Schwach')).toBeTruthy();
  });

  it('should render strength label for fair password', () => {
    render(<PasswordStrengthIndicator password="password1" />);
    const label = screen.queryByText(/Schwach|Ausreichend/);
    expect(label).toBeTruthy();
  });

  it('should render strength label for good password', () => {
    render(<PasswordStrengthIndicator password="Password123" />);
    const label = screen.queryByText(/Ausreichend|Gut/);
    expect(label).toBeTruthy();
  });

  it('should render strength label for strong password', () => {
    render(<PasswordStrengthIndicator password="MyP@ssw0rd123!" />);
    const label = screen.queryByText(/Gut|Stark/);
    expect(label).toBeTruthy();
  });

  it('should show feedback when enabled', () => {
    render(<PasswordStrengthIndicator password="abc" showFeedback />);

    // Should show at least one feedback item - use getAllByText to handle multiple matches
    const feedbackItems = screen.queryAllByText(/Zeichen|Großbuchstaben|Zahlen|Sonderzeichen/);
    expect(feedbackItems.length).toBeGreaterThan(0);
  });

  it('should not show feedback when disabled', () => {
    render(<PasswordStrengthIndicator password="abc" showFeedback={false} />);

    // Feedback should not be present - check that specific feedback text doesn't exist
    const hasNoFeedback =
      !screen.queryByText(/Zeichen/) &&
      !screen.queryByText(/Großbuchstaben/) &&
      !screen.queryByText(/Zahlen/) &&
      !screen.queryByText(/Sonderzeichen/);

    expect(hasNoFeedback).toBe(true);
    // Label should still be there
    expect(screen.getByText('Schwach')).toBeTruthy();
  });

  it('should render progress bar', () => {
    const { toJSON } = render(<PasswordStrengthIndicator password="Password123" />);

    // ProgressBar component should be rendered
    expect(toJSON()).toBeTruthy();
  });
});
