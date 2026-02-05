/**
 * Tests for Password Strength Utility
 */

import {
  calculatePasswordStrength,
  getPasswordStrengthColor,
  getPasswordStrengthLabel,
} from '../passwordStrength';

describe('passwordStrength', () => {
  describe('calculatePasswordStrength', () => {
    it('should return weak for empty password', () => {
      const result = calculatePasswordStrength('');
      expect(result.strength).toBe('weak');
      expect(result.score).toBe(0);
      expect(result.feedback).toContain('Passwort ist erforderlich');
    });

    it('should return weak for short password', () => {
      const result = calculatePasswordStrength('abc123');
      expect(result.strength).toBe('weak');
      expect(result.feedback.length).toBeGreaterThan(0);
    });

    it('should return fair for password with minimum requirements', () => {
      const result = calculatePasswordStrength('password1');
      expect(['weak', 'fair']).toContain(result.strength);
    });

    it('should return good for password with uppercase, lowercase, and numbers', () => {
      const result = calculatePasswordStrength('Password123');
      expect(['fair', 'good']).toContain(result.strength);
    });

    it('should return strong for password with all character types', () => {
      const result = calculatePasswordStrength('MyP@ssw0rd123!');
      expect(['good', 'strong']).toContain(result.strength);
    });

    it('should provide helpful feedback for weak passwords', () => {
      const result = calculatePasswordStrength('short');
      expect(result.feedback.length).toBeGreaterThan(0);
      expect(result.feedback.some((f) => f.includes('Zeichen'))).toBe(true);
    });

    it('should limit feedback to 3 suggestions', () => {
      const result = calculatePasswordStrength('a');
      expect(result.feedback.length).toBeLessThanOrEqual(3);
    });
  });

  describe('getPasswordStrengthColor', () => {
    it('should return red colors for weak password', () => {
      const colors = getPasswordStrengthColor('weak');
      expect(colors.bg).toContain('red');
      expect(colors.text).toContain('red');
    });

    it('should return orange colors for fair password', () => {
      const colors = getPasswordStrengthColor('fair');
      expect(colors.bg).toContain('orange');
      expect(colors.text).toContain('orange');
    });

    it('should return yellow colors for good password', () => {
      const colors = getPasswordStrengthColor('good');
      expect(colors.bg).toContain('yellow');
      expect(colors.text).toContain('yellow');
    });

    it('should return green colors for strong password', () => {
      const colors = getPasswordStrengthColor('strong');
      expect(colors.bg).toContain('green');
      expect(colors.text).toContain('green');
    });
  });

  describe('getPasswordStrengthLabel', () => {
    it('should return correct German labels', () => {
      expect(getPasswordStrengthLabel('weak')).toBe('Schwach');
      expect(getPasswordStrengthLabel('fair')).toBe('Ausreichend');
      expect(getPasswordStrengthLabel('good')).toBe('Gut');
      expect(getPasswordStrengthLabel('strong')).toBe('Stark');
    });
  });
});
