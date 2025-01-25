export const API_BASE_URL = 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  FILE_UPLOAD: `${API_BASE_URL}/files/`,
  CREATE_CASE_UNREGISTERED: `${API_BASE_URL}/cases/unregistered/create/`,
  VALIDATE_VEHICLE: `${API_BASE_URL}/cases/unregistered/validate-vehicle/`,
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login/`,
    REFRESH: `${API_BASE_URL}/auth/refresh/`,
    LOGOUT: `${API_BASE_URL}/auth/logout/`,
  },
  CASES: `${API_BASE_URL}/cases/`,
  CLAIM_FORMS: `${API_BASE_URL}/files/templates/`,
  GARAGES: `${API_BASE_URL}/garages/`,
  ASSIGN_GARAGE: (caseId) => `${API_BASE_URL}/cases/${caseId}/assign_garage/`,
  SUBMIT_ESTIMATE: (caseId) => `${API_BASE_URL}/cases/${caseId}/submit_estimate/`,
};

export const FILE_TYPES = {
  VEHICLE_PHOTO: 'VEHICLE_PHOTO',
  ACCIDENT_PHOTO: 'ACCIDENT_PHOTO',
  CLAIM_FORM: 'CLAIM_FORM',
  ESTIMATE: 'ESTIMATE',
  OTHER: 'OTHER'
};

export const TOAST_MESSAGES = {
  UPLOAD_SUCCESS: 'Photo uploaded successfully!',
  UPLOAD_ERROR: 'Failed to upload photo. Please try again.',
  CAMERA_ERROR: 'Could not access camera. Please check permissions.',
  DELETE_SUCCESS: 'Photo removed successfully!',
  SUBMIT_SUCCESS: 'Case submitted successfully!',
  SUBMIT_ERROR: 'Failed to submit case. Please try again.',
  LOGIN_ERROR: 'Failed to login. Please check your credentials.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  UNAUTHORIZED: 'You are not authorized to access this resource.'
};

export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user'
}; 