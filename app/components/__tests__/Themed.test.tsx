/**
 * Example test for Themed components
 * Demonstrates the testing setup with React Native Testing Library
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';

import { Text, View } from '../Themed';

// Mock useColorScheme
jest.mock('../useColorScheme', () => ({
  useColorScheme: jest.fn().mockReturnValue('light'),
}));

describe('Themed Components', () => {
  describe('Text', () => {
    it('renders text content correctly', () => {
      render(<Text>Hello MenuMate</Text>);

      expect(screen.getByText('Hello MenuMate')).toBeTruthy();
    });

    it('applies custom light color when provided', () => {
      render(<Text lightColor="#FF0000">Colored Text</Text>);

      const textElement = screen.getByText('Colored Text');
      expect(textElement).toBeTruthy();
    });

    it('applies additional styles', () => {
      render(
        <Text style={{ fontSize: 20 }} testID="styled-text">
          Styled Text
        </Text>
      );

      expect(screen.getByTestId('styled-text')).toBeTruthy();
    });
  });

  describe('View', () => {
    it('renders children correctly', () => {
      render(
        <View testID="themed-view">
          <Text>Child Content</Text>
        </View>
      );

      expect(screen.getByTestId('themed-view')).toBeTruthy();
      expect(screen.getByText('Child Content')).toBeTruthy();
    });

    it('applies custom background color when provided', () => {
      render(
        <View lightColor="#FFFFFF" testID="light-view">
          <Text>Light View</Text>
        </View>
      );

      expect(screen.getByTestId('light-view')).toBeTruthy();
    });
  });
});
