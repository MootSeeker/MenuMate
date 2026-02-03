/**
 * Mock for expo-camera
 * Used in tests to simulate camera functionality
 */

import React from 'react';

// Camera permission status
export const PermissionStatus = {
  UNDETERMINED: 'undetermined',
  GRANTED: 'granted',
  DENIED: 'denied',
} as const;

// Camera types
export const CameraType = {
  front: 'front',
  back: 'back',
} as const;

export const FlashMode = {
  off: 'off',
  on: 'on',
  auto: 'auto',
  torch: 'torch',
} as const;

// Mock permission response
export const mockPermissionResponse = {
  status: PermissionStatus.GRANTED,
  granted: true,
  canAskAgain: true,
  expires: 'never' as const,
};

// Mock camera ref methods
export const mockCameraRef = {
  takePictureAsync: jest.fn().mockResolvedValue({
    uri: 'file:///mock/photo.jpg',
    width: 1920,
    height: 1080,
    base64: 'mockBase64String',
  }),
  recordAsync: jest.fn().mockResolvedValue({
    uri: 'file:///mock/video.mp4',
  }),
  stopRecording: jest.fn(),
  pausePreview: jest.fn(),
  resumePreview: jest.fn(),
  getAvailablePictureSizesAsync: jest.fn().mockResolvedValue(['1920x1080', '1280x720', '640x480']),
};

// Hook mocks
export const useCameraPermissions = jest.fn().mockReturnValue([
  mockPermissionResponse,
  jest.fn().mockResolvedValue(mockPermissionResponse),
]);

export const useMicrophonePermissions = jest.fn().mockReturnValue([
  mockPermissionResponse,
  jest.fn().mockResolvedValue(mockPermissionResponse),
]);

// Static methods
export const requestCameraPermissionsAsync = jest.fn().mockResolvedValue(mockPermissionResponse);
export const getCameraPermissionsAsync = jest.fn().mockResolvedValue(mockPermissionResponse);
export const requestMicrophonePermissionsAsync = jest.fn().mockResolvedValue(mockPermissionResponse);
export const getMicrophonePermissionsAsync = jest.fn().mockResolvedValue(mockPermissionResponse);

// Camera component mock
export const CameraView = jest.fn().mockImplementation(
  React.forwardRef(({ children, ...props }: { children?: React.ReactNode }, ref) => {
    // Attach mock methods to ref
    React.useImperativeHandle(ref, () => mockCameraRef);
    
    return React.createElement(
      'View',
      { ...props, testID: 'mock-camera-view' },
      children
    );
  })
);

// Legacy Camera component (for older expo-camera versions)
export const Camera = CameraView;

// Helper to reset all camera mocks
export const resetCameraMocks = () => {
  mockCameraRef.takePictureAsync.mockClear();
  mockCameraRef.recordAsync.mockClear();
  mockCameraRef.stopRecording.mockClear();
  mockCameraRef.pausePreview.mockClear();
  mockCameraRef.resumePreview.mockClear();
  useCameraPermissions.mockClear();
  useMicrophonePermissions.mockClear();
  requestCameraPermissionsAsync.mockClear();
  getCameraPermissionsAsync.mockClear();
};

// Helper to set permission status
export const setMockPermissionStatus = (
  status: 'granted' | 'denied' | 'undetermined',
  canAskAgain = true
) => {
  const response = {
    status,
    granted: status === 'granted',
    canAskAgain,
    expires: 'never' as const,
  };
  
  useCameraPermissions.mockReturnValue([
    response,
    jest.fn().mockResolvedValue(response),
  ]);
  
  requestCameraPermissionsAsync.mockResolvedValue(response);
  getCameraPermissionsAsync.mockResolvedValue(response);
};

export default {
  CameraView,
  Camera,
  CameraType,
  FlashMode,
  PermissionStatus,
  useCameraPermissions,
  useMicrophonePermissions,
  requestCameraPermissionsAsync,
  getCameraPermissionsAsync,
  requestMicrophonePermissionsAsync,
  getMicrophonePermissionsAsync,
};
