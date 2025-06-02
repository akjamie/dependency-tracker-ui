import api from './api';

// Search violations with filters
export const searchViolations = async (params) => {
  try {
    const response = await api.get('/api/v1/rule-violations', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to search violations');
  }
};

// Get violations by rule ID
export const getViolationsByRuleId = async (ruleId) => {
  try {
    const response = await api.get(`/api/v1/rule-violations/${ruleId}/violations`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch violations for rule');
  }
};

// Update violation status
export const updateViolationStatus = async (violationId, status) => {
  try {
    const response = await api.patch(`/api/v1/rule-violations/${violationId}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update violation status');
  }
};

// Get violation details
export const getViolationDetails = async (violationId) => {
  try {
    const response = await api.get(`/api/v1/rule-violations/${violationId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch violation details');
  }
}; 