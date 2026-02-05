/**
 * Password Strength Calculator
 *
 * Calculates password strength based on various criteria
 */

export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

export interface PasswordStrengthResult {
  strength: PasswordStrength;
  score: number; // 0-4
  feedback: string[];
}

/**
 * Calculate password strength
 * Returns a score from 0 (very weak) to 4 (very strong)
 */
export function calculatePasswordStrength(password: string): PasswordStrengthResult {
  if (!password) {
    return {
      strength: 'weak',
      score: 0,
      feedback: ['Passwort ist erforderlich'],
    };
  }

  let score = 0;
  const feedback: string[] = [];

  // Length check
  if (password.length >= 8) {
    score++;
  } else {
    feedback.push('Mindestens 8 Zeichen');
  }

  if (password.length >= 12) {
    score++;
  }

  // Contains lowercase
  if (/[a-z]/.test(password)) {
    score++;
  } else {
    feedback.push('Kleinbuchstaben verwenden');
  }

  // Contains uppercase
  if (/[A-Z]/.test(password)) {
    score++;
  } else {
    feedback.push('Großbuchstaben verwenden');
  }

  // Contains numbers
  if (/[0-9]/.test(password)) {
    score++;
  } else {
    feedback.push('Zahlen verwenden');
  }

  // Contains special characters
  if (/[^A-Za-z0-9]/.test(password)) {
    score++;
  } else {
    feedback.push('Sonderzeichen verwenden');
  }

  // Normalize score to 0-4 range
  const normalizedScore = Math.min(Math.floor((score / 6) * 4), 4);

  // Determine strength level
  let strength: PasswordStrength;
  if (normalizedScore === 0) {
    strength = 'weak';
  } else if (normalizedScore === 1) {
    strength = 'weak';
  } else if (normalizedScore === 2) {
    strength = 'fair';
  } else if (normalizedScore === 3) {
    strength = 'good';
  } else {
    strength = 'strong';
  }

  return {
    strength,
    score: normalizedScore,
    feedback: feedback.slice(0, 3), // Show max 3 suggestions
  };
}

/**
 * Get color for password strength indicator
 */
export function getPasswordStrengthColor(strength: PasswordStrength): {
  bg: string;
  text: string;
} {
  switch (strength) {
    case 'weak':
      return { bg: 'bg-red-500', text: 'text-red-700 dark:text-red-300' };
    case 'fair':
      return { bg: 'bg-orange-500', text: 'text-orange-700 dark:text-orange-300' };
    case 'good':
      return { bg: 'bg-yellow-500', text: 'text-yellow-700 dark:text-yellow-300' };
    case 'strong':
      return { bg: 'bg-green-500', text: 'text-green-700 dark:text-green-300' };
  }
}

/**
 * Get label for password strength
 */
export function getPasswordStrengthLabel(strength: PasswordStrength): string {
  switch (strength) {
    case 'weak':
      return 'Schwach';
    case 'fair':
      return 'Ausreichend';
    case 'good':
      return 'Gut';
    case 'strong':
      return 'Stark';
  }
}
